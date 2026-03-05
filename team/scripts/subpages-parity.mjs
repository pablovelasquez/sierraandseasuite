#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import playwrightPkg from "../dashboard/node_modules/playwright/index.js";
import utilsBundlePkg from "../dashboard/node_modules/playwright-core/lib/utilsBundle.js";
const { chromium } = playwrightPkg;
const { PNG } = utilsBundlePkg;

const WEBSITE_DIR = path.resolve("website");
const OUT_DIR = path.resolve("artifacts/parity/subpages");

const LIVE_BASE = process.env.LIVE_BASE ?? "https://www.sierraseasuite.com";
const LOCAL_BASE = process.env.LOCAL_BASE ?? "http://100.114.78.113:3002";

const TARGETS = [
  { name: "desktop", viewport: { width: 1440, height: 2600 } },
  { name: "mobile", viewport: { width: 390, height: 2400 } },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listHtmlFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

function buildDiffImage(a, b, width, height) {
  const diff = new PNG({ width, height });
  let totalAbsDiff = 0;
  let changedPixels = 0;

  for (let i = 0; i < width * height * 4; i += 4) {
    const dr = Math.abs(a.data[i] - b.data[i]);
    const dg = Math.abs(a.data[i + 1] - b.data[i + 1]);
    const db = Math.abs(a.data[i + 2] - b.data[i + 2]);

    const delta = dr + dg + db;
    totalAbsDiff += delta;

    const pixelChanged = delta > 40;
    if (pixelChanged) changedPixels += 1;

    diff.data[i] = pixelChanged ? 255 : 0;
    diff.data[i + 1] = pixelChanged ? 20 : 0;
    diff.data[i + 2] = pixelChanged ? 20 : 0;
    diff.data[i + 3] = 255;
  }

  const pixels = width * height;
  const mae = totalAbsDiff / (pixels * 3);
  const changedPct = (changedPixels / pixels) * 100;

  return { diff, mae, changedPct };
}

async function capture(page, url, outFile) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll("[style*='animation']").forEach((el) => {
      el.style.animation = "none";
    });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: outFile, fullPage: true });
}

async function comparePair(baseName, viewportName) {
  const livePath = path.join(OUT_DIR, `${baseName}-${viewportName}-live.png`);
  const localPath = path.join(OUT_DIR, `${baseName}-${viewportName}-local.png`);
  const diffPath = path.join(OUT_DIR, `${baseName}-${viewportName}-diff.png`);

  const [liveBuf, localBuf] = await Promise.all([
    fs.readFile(livePath),
    fs.readFile(localPath),
  ]);

  const livePng = PNG.sync.read(liveBuf);
  const localPng = PNG.sync.read(localBuf);

  const width = Math.min(livePng.width, localPng.width);
  const height = Math.min(livePng.height, localPng.height);

  const crop = (png) => {
    const out = new PNG({ width, height });
    PNG.bitblt(png, out, 0, 0, width, height, 0, 0);
    return out;
  };

  const liveCrop = crop(livePng);
  const localCrop = crop(localPng);
  const { diff, mae, changedPct } = buildDiffImage(liveCrop, localCrop, width, height);
  await fs.writeFile(diffPath, PNG.sync.write(diff));

  return {
    viewport: viewportName,
    comparedSize: `${width}x${height}`,
    mae: Number(mae.toFixed(2)),
    changedPct: Number(changedPct.toFixed(2)),
    files: {
      live: livePath,
      local: localPath,
      diff: diffPath,
    },
  };
}

function slugForPath(relPath) {
  return relPath
    .replace(/^\/+/, "")
    .replace(/\.html$/i, "")
    .replace(/\//g, "__")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
}

async function main() {
  await ensureDir(OUT_DIR);

  const htmlFiles = await listHtmlFiles(WEBSITE_DIR);
  const pagePaths = htmlFiles
    .map((f) => "/" + path.relative(WEBSITE_DIR, f).replaceAll(path.sep, "/"))
    .filter((p) => p !== "/index.html")
    .sort();

  const browser = await chromium.launch({ headless: true });
  const reports = [];

  try {
    for (const pagePath of pagePaths) {
      const baseName = slugForPath(pagePath);
      const liveUrl = `${LIVE_BASE}${pagePath}`;
      const localUrl = `${LOCAL_BASE}${pagePath}`;

      const pageReport = { pagePath, liveUrl, localUrl, results: [] };

      for (const target of TARGETS) {
        const context = await browser.newContext({
          viewport: target.viewport,
          deviceScaleFactor: 1,
        });
        const page = await context.newPage();

        const liveOut = path.join(OUT_DIR, `${baseName}-${target.name}-live.png`);
        const localOut = path.join(OUT_DIR, `${baseName}-${target.name}-local.png`);

        await capture(page, liveUrl, liveOut);
        await capture(page, localUrl, localOut);
        await context.close();

        const result = await comparePair(baseName, target.name);
        pageReport.results.push(result);
      }

      reports.push(pageReport);
      const desktop = pageReport.results.find((r) => r.viewport === "desktop");
      const mobile = pageReport.results.find((r) => r.viewport === "mobile");
      console.log(
        `${pagePath} :: desktop ${desktop.changedPct}% | mobile ${mobile.changedPct}%`
      );
    }
  } finally {
    await browser.close();
  }

  const summary = reports
    .map((p) => {
      const desktop = p.results.find((r) => r.viewport === "desktop");
      const mobile = p.results.find((r) => r.viewport === "mobile");
      const avgChangedPct = Number(
        (((desktop?.changedPct ?? 0) + (mobile?.changedPct ?? 0)) / 2).toFixed(2)
      );
      return {
        pagePath: p.pagePath,
        avgChangedPct,
        desktopChangedPct: desktop?.changedPct ?? null,
        mobileChangedPct: mobile?.changedPct ?? null,
      };
    })
    .sort((a, b) => b.avgChangedPct - a.avgChangedPct);

  const output = {
    generatedAt: new Date().toISOString(),
    liveBase: LIVE_BASE,
    localBase: LOCAL_BASE,
    pageCount: reports.length,
    summary,
    pages: reports,
  };

  const reportPath = path.join(OUT_DIR, "report.json");
  await fs.writeFile(reportPath, JSON.stringify(output, null, 2));
  console.log(`\nReport: ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


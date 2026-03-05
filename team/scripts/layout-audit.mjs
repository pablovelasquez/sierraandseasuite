#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import playwrightPkg from "../dashboard/node_modules/playwright/index.js";
const { chromium } = playwrightPkg;

const BASE = process.env.LOCAL_BASE ?? "http://100.114.78.113:3002";
const OUT_DIR = path.resolve("artifacts/layout-audit");

const PAGES = [
  { name: "en-home", path: "/" },
  { name: "es-home", path: "/es/inicio.html" },
  { name: "en-contact", path: "/contact-us.html" },
  { name: "es-contact", path: "/es/contactanos.html" },
  { name: "en-faq", path: "/faq.html" },
  { name: "es-faq", path: "/es/preguntas-fecuentes.html" },
  { name: "en-guide", path: "/santa-marta-and-sierra-nevada-tourist-guide.html" },
  { name: "es-guide", path: "/es/guia-turistica.html" },
  { name: "en-rules", path: "/rules-and-policies.html" },
  { name: "es-rules", path: "/es/reglas-y-politicas.html" },
];

const VIEWPORTS = [
  { name: "mobile", viewport: { width: 390, height: 900 } },
  { name: "tablet", viewport: { width: 1024, height: 1366 } },
  { name: "desktop", viewport: { width: 1440, height: 1000 } },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function capture(page, url, outFile) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll("[style*='animation']").forEach((el) => {
      el.style.animation = "none";
      el.style.transition = "none";
    });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: outFile, fullPage: false });
}

async function main() {
  await ensureDir(OUT_DIR);
  const browser = await chromium.launch({ headless: true });

  try {
    for (const pageDef of PAGES) {
      for (const vp of VIEWPORTS) {
        const context = await browser.newContext({ viewport: vp.viewport, deviceScaleFactor: 1 });
        const page = await context.newPage();
        const url = `${BASE}${pageDef.path}`;
        const outFile = path.join(OUT_DIR, `${pageDef.name}-${vp.name}.png`);
        await capture(page, url, outFile);
        await context.close();
        console.log(`captured: ${outFile}`);
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

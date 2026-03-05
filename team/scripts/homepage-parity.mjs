#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import playwrightPkg from "../dashboard/node_modules/playwright/index.js";
const { chromium } = playwrightPkg;

const OUT_DIR = path.resolve("artifacts/qa-mobile-check");

const TARGETS = [
  { name: "en-390", url: "http://100.114.78.113:3002/", viewport: { width: 390, height: 900 } },
  { name: "en-430", url: "http://100.114.78.113:3002/", viewport: { width: 430, height: 932 } },
  { name: "es-390", url: "http://100.114.78.113:3002/es/inicio.html", viewport: { width: 390, height: 900 } },
  { name: "es-430", url: "http://100.114.78.113:3002/es/inicio.html", viewport: { width: 430, height: 932 } },
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
    });
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: outFile, fullPage: false });
}

async function main() {
  await ensureDir(OUT_DIR);
  const browser = await chromium.launch({ headless: true });

  try {
    for (const target of TARGETS) {
      const context = await browser.newContext({
        viewport: target.viewport,
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      const filePath = path.join(OUT_DIR, `${target.name}.png`);
      await capture(page, target.url, filePath);
      await context.close();
      console.log(`captured: ${filePath}`);
    }    
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const WEBSITE_DIR = path.join(ROOT, "website");
const OUTPUT_SITEMAP = path.join(WEBSITE_DIR, "sitemap.xml");
const OUTPUT_MANIFEST = path.join(WEBSITE_DIR, "seo-route-manifest.json");
const OUTPUT_CF_FUNCTION = path.join(ROOT, "infrastructure", "cloudfront", "clean-url-redirect.js");
const OUTPUT_CF_README = path.join(ROOT, "infrastructure", "cloudfront", "README.md");
const BASE_URL = (process.env.BASE_URL || "https://www.sierraseasuite.com").replace(/\/$/, "");
const EXTRA_FUNCTION_ROUTES = {
  "/es/manual-de-huespedes": "/es/manual-de-huespedes.html",
  "/en/guest-manual": "/en/guest-manual.html"
};

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function htmlPathFromRel(relPath) {
  return `/${toPosix(relPath)}`;
}

function cleanPathFromRel(relPath) {
  const rel = toPosix(relPath);
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) {
    return `/${rel.slice(0, -"/index.html".length)}`;
  }
  if (rel.endsWith(".html")) {
    return `/${rel.slice(0, -".html".length)}`;
  }
  return `/${rel}`;
}

function xmlEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function main() {
  const allFiles = await walk(WEBSITE_DIR);
  const htmlFiles = allFiles
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.relative(WEBSITE_DIR, f));

  const routes = [];

  for (const rel of htmlFiles) {
    const abs = path.join(WEBSITE_DIR, rel);
    const stat = await fs.stat(abs);
    const htmlContent = await fs.readFile(abs, "utf8");
    const isNoIndex = /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(htmlContent);
    if (isNoIndex) continue;
    const htmlPath = htmlPathFromRel(rel);
    const cleanPath = cleanPathFromRel(rel);
    routes.push({
      cleanPath,
      htmlPath,
      relPath: toPosix(rel),
      lastmod: new Date(stat.mtime).toISOString().slice(0, 10)
    });
  }

  routes.sort((a, b) => a.cleanPath.localeCompare(b.cleanPath));

  const uniqueByClean = new Map();
  for (const r of routes) {
    if (!uniqueByClean.has(r.cleanPath)) uniqueByClean.set(r.cleanPath, r);
  }
  const uniqueRoutes = [...uniqueByClean.values()];

  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...uniqueRoutes.map((r) => {
      const loc = `${BASE_URL}${r.cleanPath}`;
      return [
        "  <url>",
        `    <loc>${xmlEscape(loc)}</loc>`,
        `    <lastmod>${r.lastmod}</lastmod>`,
        "  </url>"
      ].join("\n");
    }),
    "</urlset>",
    ""
  ].join("\n");

  await fs.writeFile(OUTPUT_SITEMAP, sitemapXml, "utf8");

  await fs.writeFile(
    OUTPUT_MANIFEST,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        baseUrl: BASE_URL,
        routes: uniqueRoutes
      },
      null,
      2
    ) + "\n",
    "utf8"
  );

  const cleanToHtml = {
    ...Object.fromEntries(uniqueRoutes.map((r) => [r.cleanPath, r.htmlPath])),
    ...EXTRA_FUNCTION_ROUTES
  };

  const functionSource = `function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: location },
      'cache-control': { value: 'public, max-age=3600' }
    }
  };
}

var ROUTES = ${JSON.stringify(cleanToHtml, null, 2)};

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var host = request.headers && request.headers.host && request.headers.host.value
    ? request.headers.host.value.toLowerCase()
    : '';
  var isGuestHost = host === 'huespedes.sierraseasuite.com';

  if (isGuestHost && (uri === '/' || uri === '/index.html')) {
    request.uri = '/es/manual-de-huespedes.html';
    return request;
  }

  if (uri !== '/' && uri.endsWith('/')) {
    var noSlash = uri.slice(0, -1);
    if (ROUTES[noSlash]) {
      return redirect(noSlash);
    }
  }

  if (uri === '/index.html') {
    return redirect('/');
  }

  if (uri.endsWith('.html')) {
    var clean = uri.slice(0, -5);
    if (clean === '') clean = '/';
    if (ROUTES[clean]) {
      return redirect(clean);
    }
  }

  if (uri === '/es') {
    return redirect('/es/inicio');
  }

  if (uri === '/') {
    request.uri = '/index.html';
    return request;
  }

  if (ROUTES[uri]) {
    request.uri = ROUTES[uri];
    return request;
  }

  return request;
}
`;

  await ensureDir(OUTPUT_CF_FUNCTION);
  await fs.writeFile(OUTPUT_CF_FUNCTION, functionSource, "utf8");

  const cfReadme = `# CloudFront Clean URL + 301 Function

Generated by \`scripts/generate_sitemap_and_redirects.mjs\`.

## Purpose

- Keep canonical URLs without \`.html\` (SEO)
- 301 redirect from \`.html\` to clean route
- Internally rewrite clean route to matching \`.html\` file on S3

## Attach in AWS

1. Open CloudFront -> Functions
2. Create function (or update existing) and paste code from:
   - \`infrastructure/cloudfront/clean-url-redirect.js\`
3. Publish function
4. Associate it to your distribution:
   - Behavior: default (*)
   - Event type: Viewer request

## Notes

- Sitemap uses clean URLs and is generated at \`website/sitemap.xml\`.
- Route map is at \`website/seo-route-manifest.json\`.
`;

  await fs.writeFile(OUTPUT_CF_README, cfReadme, "utf8");

  const robotsPath = path.join(WEBSITE_DIR, "robots.txt");
  const robots = "User-agent: *\nDisallow: /\n";
  await fs.writeFile(robotsPath, robots, "utf8");

  console.log(`Generated ${OUTPUT_SITEMAP}`);
  console.log(`Generated ${OUTPUT_MANIFEST}`);
  console.log(`Generated ${OUTPUT_CF_FUNCTION}`);
  console.log(`Generated ${OUTPUT_CF_README}`);
  console.log(`Generated ${robotsPath}`);
  console.log(`Routes: ${uniqueRoutes.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

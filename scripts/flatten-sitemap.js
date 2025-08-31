/*
  Overwrite public/sitemap-index.xml with the contents of the first generated sitemap file (e.g., sitemap-0.xml).
  This makes the default sitemap URL serve the URL list directly, without an index or redirects.
*/

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const indexPath = path.join(publicDir, 'sitemap-index.xml');

function findPrimarySitemapFile() {
  const preferredNames = ['sitemap-0.xml', 'sitemap.xml'];

  for (const name of preferredNames) {
    const fullPath = path.join(publicDir, name);
    if (fs.existsSync(fullPath)) return fullPath;
  }

  const files = fs.readdirSync(publicDir);
  const candidates = files
    .filter((f) => /^sitemap-.*\.xml$/i.test(f) && f !== 'sitemap-index.xml')
    .sort();

  if (candidates.length > 0) {
    return path.join(publicDir, candidates[0]);
  }

  return null;
}

function main() {
  try {
    if (!fs.existsSync(publicDir)) {
      console.warn(`[flatten-sitemap] public directory not found: ${publicDir}`);
      return;
    }

    const primarySitemap = findPrimarySitemapFile();
    if (!primarySitemap) {
      console.warn('[flatten-sitemap] No primary sitemap file found to copy from.');
      return;
    }

    const content = fs.readFileSync(primarySitemap);
    fs.writeFileSync(indexPath, content);
    console.log(`[flatten-sitemap] Wrote ${path.basename(primarySitemap)} to ${path.basename(indexPath)}`);
  } catch (err) {
    console.error('[flatten-sitemap] Failed to flatten sitemap:', err);
    process.exitCode = 1;
  }
}

main();



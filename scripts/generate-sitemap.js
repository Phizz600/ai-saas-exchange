import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, '..', p);

// Import route configuration
const { getSitemapRoutes } = await import('../src/config/routes.ts');

const DOMAIN = 'https://aiexchange.club';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

function generateSitemap() {
  const routes = getSitemapRoutes();
  
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to public directory
  const sitemapPath = toAbsolute('public/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml);
  console.log(`✅ Generated sitemap.xml with ${routes.length} routes`);
  console.log(`📍 Saved to: ${sitemapPath}`);
}

generateSitemap();
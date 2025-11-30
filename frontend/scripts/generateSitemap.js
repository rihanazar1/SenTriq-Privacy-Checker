import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://sentriq.com';
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';

// Static pages configuration
const staticPages = [
  {
    loc: `${baseUrl}/`,
    changefreq: 'weekly',
    priority: '1.0'
  },
  {
    loc: `${baseUrl}/blog`,
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    loc: `${baseUrl}/data-vault`,
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    loc: `${baseUrl}/email-checker`,
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    loc: `${baseUrl}/apps-tracker`,
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    loc: `${baseUrl}/fake-data-generator`,
    changefreq: 'monthly',
    priority: '0.8'
  }
];

async function fetchBlogs() {
  try {
    console.log('Fetching blogs from API...');
    const response = await fetch(`${API_URL}/api/blogs?status=published&limit=1000`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data?.blogs || [];
  } catch (error) {
    console.warn('Failed to fetch blogs:', error.message);
    return [];
  }
}

function generateSitemapXML(pages) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Disallow admin and private pages
Disallow: /admin
Disallow: /dashboard
Disallow: /profile
Disallow: /login
Disallow: /register

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1`;
}

async function generateSitemap() {
  try {
    console.log('Starting sitemap generation...');
    
    // Fetch dynamic blog pages
    const blogs = await fetchBlogs();
    console.log(`Found ${blogs.length} published blogs`);
    
    // Create blog pages for sitemap
    const blogPages = blogs.map(blog => ({
      loc: `${baseUrl}/blog/${blog.slug}`,
      lastmod: new Date(blog.updatedAt).toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.7'
    }));
    
    // Combine all pages
    const allPages = [...staticPages, ...blogPages];
    console.log(`Total pages in sitemap: ${allPages.length}`);
    
    // Generate sitemap XML
    const sitemapXML = generateSitemapXML(allPages);
    
    // Generate robots.txt
    const robotsTxt = generateRobotsTxt();
    
    // Ensure public directory exists
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write sitemap.xml
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');
    console.log(`✅ Sitemap generated: ${sitemapPath}`);
    
    // Write robots.txt
    const robotsPath = path.join(publicDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
    console.log(`✅ Robots.txt generated: ${robotsPath}`);
    
    console.log('🎉 Sitemap generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
generateSitemap();
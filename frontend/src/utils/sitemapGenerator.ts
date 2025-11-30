interface BlogPost {
  slug: string;
  updatedAt: string;
  status: string;
}

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://sentriq.com';
  const currentDate = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages: SitemapUrl[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/data-vault`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/email-checker`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/apps-tracker`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/fake-data-generator`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    }
  ];

  try {
    // Fetch published blogs from API
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs?status=published&limit=1000`);
    const blogsData = await response.json();

    const blogPages: SitemapUrl[] = blogsData.data?.blogs?.map((blog: BlogPost) => ({
      loc: `${baseUrl}/blog/${blog.slug}`,
      lastmod: new Date(blog.updatedAt).toISOString().split('T')[0],
      changefreq: 'weekly' as const,
      priority: '0.7'
    })) || [];

    const allPages = [...staticPages, ...blogPages];

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Fallback to static pages only
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return xml;
  }
};

export const generateRobotsTxt = (): string => {
  const baseUrl = 'https://sentriq.com';

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
};
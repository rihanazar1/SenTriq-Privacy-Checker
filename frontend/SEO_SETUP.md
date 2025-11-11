# SEO Setup Guide for Sentriq Blog

## ✅ Implemented Features

### 1. React-Snap for Pre-rendering
- Automatically generates static HTML for all routes during build
- Google crawlers will see fully rendered content
- Configured in `package.json` with `postbuild` script

### 2. React Helmet Async
- Dynamic meta tags for each blog post
- Open Graph tags for social media sharing
- Twitter Card support
- Structured data (JSON-LD) for rich snippets

### 3. SEO Meta Tags
- Title, description, keywords for each page
- Canonical URLs to prevent duplicate content
- Author and article metadata
- Robots meta tags

### 4. Sitemap & Robots.txt
- `public/robots.txt` - Tells crawlers what to index
- `public/sitemap.xml` - Lists all important pages

## 🚀 Installation

Run this command to install dependencies:

```bash
npm install
```

This will install:
- `react-snap` - Pre-rendering tool
- `react-helmet-async` - SEO meta tags management

## 📦 Build Process

When you run build, react-snap will automatically pre-render your pages:

```bash
npm run build
```

The build process:
1. Vite builds your React app
2. React-snap crawls and pre-renders pages
3. Static HTML files are generated in `dist/` folder

## 🔍 How It Works

### Before (CSR - Client Side Rendering)
```html
<!-- Google sees this -->
<div id="root"></div>
<script src="bundle.js"></script>
```

### After (Pre-rendered with react-snap)
```html
<!-- Google sees this -->
<div id="root">
  <article>
    <h1>Your Blog Title</h1>
    <p>Full blog content here...</p>
  </article>
</div>
<script src="bundle.js"></script>
```

## 📝 Important Notes

### Dynamic Blog URLs
React-snap will only pre-render routes it knows about. For dynamic blog posts:

**Option 1: Add routes to package.json**
```json
"reactSnap": {
  "include": [
    "/",
    "/blog",
    "/blog/your-blog-slug-1",
    "/blog/your-blog-slug-2"
  ]
}
```

**Option 2: Generate sitemap dynamically (Recommended)**
Create a build script that:
1. Fetches all blog slugs from your API
2. Generates sitemap.xml with all blog URLs
3. Adds them to react-snap include list

### Vercel Deployment
If deploying to Vercel, use:
```bash
npm run build:vercel
```

Note: React-snap might have issues on Vercel. Consider these alternatives:
- Use Vercel's ISR (Incremental Static Regeneration) with Next.js
- Use a prerendering service like Prerender.io
- Generate static pages at build time

## 🧪 Testing SEO

### 1. Test Locally
```bash
npm run build
npm run preview
```

View page source (Ctrl+U) - you should see full HTML content

### 2. Google Rich Results Test
https://search.google.com/test/rich-results

### 3. Facebook Sharing Debugger
https://developers.facebook.com/tools/debug/

### 4. Twitter Card Validator
https://cards-dev.twitter.com/validator

## 🎯 SEO Checklist

- ✅ Meta title (50-60 characters)
- ✅ Meta description (150-160 characters)
- ✅ Canonical URL
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD)
- ✅ Alt text for images
- ✅ Semantic HTML (h1, h2, article, etc.)
- ✅ Mobile responsive
- ✅ Fast loading time
- ✅ HTTPS
- ✅ Sitemap.xml
- ✅ Robots.txt

## 🔧 Troubleshooting

### React-snap fails during build
- Check if all routes are accessible
- Ensure API calls don't fail during pre-rendering
- Add error boundaries

### Content not showing in view source
- Verify react-snap ran successfully
- Check dist/ folder for pre-rendered HTML
- Ensure hydration works correctly

### Dynamic content missing
- Add routes to reactSnap.include in package.json
- Use static data during pre-rendering
- Consider SSR with Next.js for fully dynamic content

## 📚 Additional Resources

- [React Helmet Async Docs](https://github.com/staylor/react-helmet-async)
- [React-Snap GitHub](https://github.com/stereobooster/react-snap)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org BlogPosting](https://schema.org/BlogPosting)

## 🚨 Known Limitations

1. **React-snap limitations:**
   - Only pre-renders routes it knows about
   - Can't handle authentication-required pages
   - May have issues with complex JavaScript

2. **Better alternatives for production:**
   - **Next.js** - Built-in SSR/SSG
   - **Remix** - Server-side rendering
   - **Prerender.io** - Cloud-based pre-rendering service

## 💡 Next Steps

1. Test the build locally
2. Deploy to staging
3. Submit sitemap to Google Search Console
4. Monitor indexing status
5. Consider migrating to Next.js for better SEO in the long term

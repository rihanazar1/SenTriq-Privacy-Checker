import { useEffect } from 'react';

interface SEOHeadProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    siteName?: string;
}

const SEOHead = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    siteName = 'SenTriq'
}: SEOHeadProps) => {
    useEffect(() => {
        // Update document title
        document.title = title;

        // Helper function to update or create meta tag
        const updateMetaTag = (selector: string, content: string) => {
            let element = document.querySelector(selector) as HTMLMetaElement;
            if (element) {
                element.content = content;
            } else {
                element = document.createElement('meta');
                if (selector.includes('property=')) {
                    element.setAttribute('property', selector.split('"')[1]);
                } else if (selector.includes('name=')) {
                    element.setAttribute('name', selector.split('"')[1]);
                }
                element.content = content;
                document.head.appendChild(element);
            }
        };

        // Basic meta tags
        updateMetaTag('meta[name="description"]', description);
        if (keywords) updateMetaTag('meta[name="keywords"]', keywords);
        if (author) updateMetaTag('meta[name="author"]', author);

        // Open Graph tags
        updateMetaTag('meta[property="og:title"]', title);
        updateMetaTag('meta[property="og:description"]', description);
        updateMetaTag('meta[property="og:type"]', type);
        updateMetaTag('meta[property="og:site_name"]', siteName);

        if (url) updateMetaTag('meta[property="og:url"]', url);
        if (image) updateMetaTag('meta[property="og:image"]', image);

        // Article specific tags
        if (type === 'article') {
            if (publishedTime) updateMetaTag('meta[property="article:published_time"]', publishedTime);
            if (modifiedTime) updateMetaTag('meta[property="article:modified_time"]', modifiedTime);
            if (author) updateMetaTag('meta[property="article:author"]', author);
        }

        // Twitter Card tags
        updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
        updateMetaTag('meta[name="twitter:title"]', title);
        updateMetaTag('meta[name="twitter:description"]', description);
        if (image) updateMetaTag('meta[name="twitter:image"]', image);

        // Structured data for articles
        if (type === 'article') {
            const structuredData: any = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": title,
                "description": description,
                "author": {
                    "@type": "Person",
                    "name": author || "SenTriq Team"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": siteName,
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${window.location.origin}/logo.png`
                    }
                },
                "datePublished": publishedTime,
                "dateModified": modifiedTime || publishedTime,
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": url || window.location.href
                }
            };

            if (image) {
                structuredData.image = {
                    "@type": "ImageObject",
                    "url": image
                };
            }

            // Remove existing structured data
            const existingScript = document.querySelector('script[type="application/ld+json"]');
            if (existingScript) {
                existingScript.remove();
            }

            // Add new structured data
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(structuredData);
            document.head.appendChild(script);
        }

    }, [title, description, keywords, image, url, type, publishedTime, modifiedTime, author, siteName]);

    return null; // This component doesn't render anything
};

export default SEOHead;
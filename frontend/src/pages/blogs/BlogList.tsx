import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetAllBlogsQuery } from '../../store/api/blogApi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Plus } from 'lucide-react';

const BlogList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, error } = useGetAllBlogsQuery({
    status: 'published',
    page,
    limit: 9,
    search,
    category: category || undefined,
    sortBy: 'createdAt',
    order: 'desc'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const categories = data?.data.blogs
    .map(blog => blog.category)
    .filter((cat, index, self) => cat && self.indexOf(cat) === index) || [];

  return (
    <div className="min-h-screen bg-[#0A191F] text-white">
      <Helmet>
        <title>Blog - Sentriq | Privacy & Security Insights</title>
        <meta name="description" content="Read the latest articles on privacy, security, and data protection. Stay informed with expert insights from Sentriq." />
        <meta name="keywords" content="privacy blog, security articles, data protection, cybersecurity insights, digital privacy" />
        <link rel="canonical" href="https://sentriq.com/blog" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sentriq.com/blog" />
        <meta property="og:title" content="Blog - Sentriq | Privacy & Security Insights" />
        <meta property="og:description" content="Read the latest articles on privacy, security, and data protection." />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://sentriq.com/blog" />
        <meta property="twitter:title" content="Blog - Sentriq | Privacy & Security Insights" />
        <meta property="twitter:description" content="Read the latest articles on privacy, security, and data protection." />
      </Helmet>

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Blog</h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Insights on privacy, security, and taking control of your digital life
          </p>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/blog/create")}
              className="flex items-center gap-2 w-full justify-center py-3 border border-[#a2e535] rounded-lg font-medium 
                 hover:bg-[#a2e535] hover:text-black transition-all duration-300"
            >
              Create Blog
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* Search and Filter */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-[#a2e535] text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#a2e535] text-black rounded-md hover:bg-[#a6cf63] transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => { setCategory(''); setPage(1); }}
                className={`px-4 py-2 rounded-full transition-colors ${!category
                  ? 'bg-[#a2e535] text-black'
                  : 'bg-slate-800/50 border border-slate-700 hover:border-[#a2e535]'
                  }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat!); setPage(1); }}
                  className={`px-4 py-2 rounded-full transition-colors ${category === cat
                    ? 'bg-[#a2e535] text-black'
                    : 'bg-slate-800/50 border border-slate-700 hover:border-[#a2e535]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a2e535]"></div>
            <p className="mt-4 text-slate-300">Loading articles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400">Failed to load articles. Please try again later.</p>
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && !error && data?.data.blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-300 text-xl">No articles found.</p>
          </div>
        )}

        {!isLoading && !error && data && data.data.blogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {data.data.blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden hover:border-[#a2e535] transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                >
                  {blog.coverImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {blog.category && (
                      <span className="inline-block px-3 py-1 bg-[#a2e535]/20 text-[#a2e535] rounded-full text-sm mb-3">
                        {blog.category}
                      </span>
                    )}
                    <h2 className="text-2xl font-bold mb-3 line-clamp-2 hover:text-[#a2e535] transition-colors">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="text-slate-300 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                      <div className="flex items-center gap-4">
                        <span>👁️ {blog.viewsCount}</span>
                        <span>❤️ {blog.likesCount}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {data.data.pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!data.data.pagination.hasPrev}
                  className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#a2e535] transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: data.data.pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors ${page === pageNum
                        ? 'bg-[#a2e535] text-black'
                        : 'bg-slate-800/50 border border-slate-700 hover:border-[#a2e535]'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data.data.pagination.hasNext}
                  className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#a2e535] transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogList;

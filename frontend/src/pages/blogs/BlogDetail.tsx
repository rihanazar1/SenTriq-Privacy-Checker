import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  useGetBlogBySlugQuery, 
  useLikeBlogMutation,
  useGetBlogCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation
} from '../../store/api/blogApi';
import { useGetProfileQuery } from '../../store/api/authApi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const token = localStorage.getItem('token');
  const { data: profileData } = useGetProfileQuery(undefined, { skip: !token });
  
  const { data: blogData, isLoading, error } = useGetBlogBySlugQuery(slug || '');
  const { data: commentsData, isLoading: commentsLoading } = useGetBlogCommentsQuery(
    { blogId: blogData?.data._id || '', params: { page: 1, limit: 50 } },
    { skip: !blogData?.data._id }
  );

  const [likeBlog, { isLoading: liking }] = useLikeBlogMutation();
  const [addComment, { isLoading: commenting }] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

  const blog = blogData?.data;
  const comments = commentsData?.data.comments || [];
  const currentUser = profileData?.data;

  // Generate structured data for SEO
  const generateStructuredData = () => {
    if (!blog) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.excerpt || blog.metaDescription || "",
      "image": blog.coverImage || "",
      "author": {
        "@type": "Person",
        "name": blog.author.name
      },
      "publisher": {
        "@type": "Organization",
        "name": "Sentriq",
        "logo": {
          "@type": "ImageObject",
          "url": "https://sentriq.com/logo.png"
        }
      },
      "datePublished": blog.createdAt,
      "dateModified": blog.updatedAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://sentriq.com/blog/${blog.slug}`
      },
      "keywords": blog.tags?.join(", ") || "",
      "articleSection": blog.category || "",
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/LikeAction",
          "userInteractionCount": blog.likesCount
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/CommentAction",
          "userInteractionCount": comments.length
        }
      ]
    };
  };

  const handleLike = async () => {
    if (!blog) return;
    try {
      await likeBlog(blog._id).unwrap();
    } catch (error) {
      console.error('Failed to like blog:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !commentText.trim() || !token) return;

    try {
      await addComment({
        blogId: blog._id,
        content: commentText.trim()
      }).unwrap();
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !replyText.trim() || !replyToCommentId || !token) return;

    try {
      await addComment({
        blogId: blog._id,
        content: replyText.trim(),
        parentCommentId: replyToCommentId
      }).unwrap();
      setReplyText('');
      setReplyToCommentId(null);
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editCommentText.trim()) return;

    try {
      await updateComment({
        id: commentId,
        content: editCommentText.trim()
      }).unwrap();
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment(commentId).unwrap();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A191F] text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a2e535]"></div>
          <p className="mt-4 text-slate-300">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#0A191F] text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-slate-300 mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/blog" className="px-6 py-3 bg-[#a2e535] text-black rounded-lg hover:bg-[#a6cf63] transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A191F] text-white">
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{blog.metaTitle || `${blog.title} - Sentriq Blog`}</title>
        <meta name="title" content={blog.metaTitle || blog.title} />
        <meta name="description" content={blog.metaDescription || blog.excerpt || ''} />
        <meta name="keywords" content={blog.tags?.join(', ') || ''} />
        <link rel="canonical" href={`https://sentriq.com/blog/${blog.slug}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://sentriq.com/blog/${blog.slug}`} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || blog.metaDescription || ''} />
        {blog.coverImage && <meta property="og:image" content={blog.coverImage} />}
        <meta property="article:published_time" content={blog.createdAt} />
        <meta property="article:modified_time" content={blog.updatedAt} />
        <meta property="article:author" content={blog.author.name} />
        {blog.category && <meta property="article:section" content={blog.category} />}
        {blog.tags?.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://sentriq.com/blog/${blog.slug}`} />
        <meta property="twitter:title" content={blog.title} />
        <meta property="twitter:description" content={blog.excerpt || blog.metaDescription || ''} />
        {blog.coverImage && <meta property="twitter:image" content={blog.coverImage} />}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData())}
        </script>
      </Helmet>
      
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-slate-400">
          <Link to="/" className="hover:text-[#a2e535]">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-[#a2e535]">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{blog.title}</span>
        </nav>

        {/* Category */}
        {blog.category && (
          <span className="inline-block px-4 py-1.5 bg-[#a2e535]/20 text-[#a2e535] rounded-full text-sm mb-6">
            {blog.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-6 text-slate-400 mb-8 pb-8 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{blog.author.name}</span>
          </div>
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
          <span>•</span>
          <span>👁️ {blog.viewsCount} views</span>
        </div>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="mb-12 rounded-xl overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none mb-12
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-[#a2e535] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-code:text-[#a2e535] prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
            prose-img:rounded-xl
            prose-blockquote:border-l-4 prose-blockquote:border-[#a2e535] prose-blockquote:pl-4 prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Like Button & Admin Actions */}
        <div className="flex items-center justify-between mb-12 pb-12 border-b border-slate-700">
          <button
            onClick={handleLike}
            disabled={liking}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-[#a2e535] transition-colors disabled:opacity-50"
          >
            <span className="text-2xl">❤️</span>
            <span>{blog.likesCount} Likes</span>
          </button>

          {/* Admin Edit Button */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => navigate(`/admin/blog/edit/${blog.slug}`)}
              className="flex items-center gap-2 px-6 py-3 bg-[#a2e535] text-black rounded-lg hover:bg-[#a6cf63] transition-colors font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Blog
            </button>
          )}
        </div>

        {/* Comments Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          {token ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-[#a2e535] text-white resize-none"
              />
              <button
                type="submit"
                disabled={commenting || !commentText.trim()}
                className="mt-3 px-6 py-2 bg-[#a2e535] text-black rounded-lg hover:bg-[#a6cf63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {commenting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-6 bg-slate-800/30 border border-slate-700 rounded-lg text-center">
              <p className="text-slate-300 mb-4">Please login to comment</p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-[#a2e535] text-black rounded-lg hover:bg-[#a6cf63] transition-colors"
              >
                Login
              </button>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a2e535]"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">{comment.user.name}</p>
                      <p className="text-sm text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    {currentUser && (currentUser.id === comment.user._id || currentUser.role === 'admin') && (
                      <div className="flex gap-2">
                        {currentUser.id === comment.user._id && (
                          <button
                            onClick={() => {
                              setEditingCommentId(comment._id);
                              setEditCommentText(comment.content);
                            }}
                            className="text-sm text-[#a2e535] hover:underline"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-sm text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment._id ? (
                    <div>
                      <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-[#a2e535] text-white resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditComment(comment._id)}
                          className="px-4 py-1.5 bg-[#a2e535] text-black rounded-md hover:bg-[#a6cf63] transition-colors text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditCommentText('');
                          }}
                          className="px-4 py-1.5 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-300 mb-3">{comment.content}</p>
                      
                      {token && (
                        <button
                          onClick={() => setReplyToCommentId(comment._id)}
                          className="text-sm text-[#a2e535] hover:underline"
                        >
                          Reply
                        </button>
                      )}

                      {/* Reply Form */}
                      {replyToCommentId === comment._id && (
                        <form onSubmit={handleReply} className="mt-4">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            rows={3}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-[#a2e535] text-white resize-none"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              type="submit"
                              disabled={!replyText.trim()}
                              className="px-4 py-1.5 bg-[#a2e535] text-black rounded-md hover:bg-[#a6cf63] transition-colors text-sm disabled:opacity-50"
                            >
                              Reply
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReplyToCommentId(null);
                                setReplyText('');
                              }}
                              className="px-4 py-1.5 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Nested Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-8 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold text-white text-sm">{reply.user.name}</p>
                                  <p className="text-xs text-slate-400">
                                    {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                {currentUser && (currentUser.id === reply.user._id || currentUser.role === 'admin') && (
                                  <button
                                    onClick={() => handleDeleteComment(reply._id)}
                                    className="text-xs text-red-400 hover:underline"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                              <p className="text-slate-300 text-sm">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Blog */}
        <div className="text-center">
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-[#a2e535] transition-colors"
          >
            ← Back to All Articles
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetail;

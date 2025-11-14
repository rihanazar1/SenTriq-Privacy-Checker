import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useGetBlogBySlugQuery
} from '../../store/api/blogApi';
import { useGetProfileQuery } from '../../store/api/authApi';
import Navbar from '../../components/Navbar';
import RichTextEditor from '../../components/RichTextEditor';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const isEditMode = !!slug;

  const { data: profileData } = useGetProfileQuery();
  const { data: blogData } = useGetBlogBySlugQuery(slug || '', { skip: !isEditMode });

  const [createBlog, { isLoading: creating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    isFeatured: false,
    metaTitle: '',
    metaDescription: ''
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (profileData && profileData.data.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [profileData, navigate]);

  // Load blog data in edit mode
  useEffect(() => {
    if (isEditMode && blogData?.data) {
      const blog = blogData.data;
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt || '',
        category: blog.category || '',
        tags: blog.tags?.join(', ') || '',
        status: blog.status,
        isFeatured: blog.isFeatured,
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || ''
      });
      if (blog.coverImage) {
        setImagePreview(blog.coverImage);
      }
    }
  }, [isEditMode, blogData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const blogPayload = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        category: formData.category || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        status: formData.status,
        isFeatured: formData.isFeatured,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        coverImage: coverImage || undefined
      };

      if (isEditMode && blogData?.data) {
        await updateBlog({
          id: blogData.data._id,
          data: blogPayload
        }).unwrap();
        alert('Blog updated successfully!');
      } else {
        await createBlog(blogPayload).unwrap();
        alert('Blog created successfully!');
      }

      navigate('/blog');
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to save blog');
    }
  };

  const isLoading = creating || updating;

  if (profileData && profileData.data.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A191F] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="text-slate-400">
            {isEditMode ? 'Update your blog post' : 'Share your insights with the community'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter blog title..."
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-[#a2e535] text-white"
              required
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Cover Image {!isEditMode && <span className="text-slate-400">(Max 5MB)</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-[#a2e535] text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#a2e535] file:text-black file:cursor-pointer hover:file:bg-[#a6cf63]"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-md rounded-lg border border-slate-700"
                />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Excerpt <span className="text-slate-400">(Short description)</span>
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary of your blog post..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-[#a2e535] text-white resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Content <span className="text-red-400">*</span>
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Write your blog content here..."
            />
            <p className="mt-2 text-sm text-slate-400">
              Use the toolbar above to format your content. Supports headings, lists, links, images, and more.
            </p>
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Technology, Security, Privacy"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-[#a2e535] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Tags <span className="text-slate-400">(comma separated)</span>
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., privacy, security, tips"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-[#a2e535] text-white"
              />
            </div>
          </div>

          {/* SEO Meta Tags */}
          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-xl font-bold mb-4">SEO Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO optimized title (defaults to blog title)"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-[#a2e535] text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Meta Description</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO meta description (defaults to excerpt)"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-[#a2e535] text-white resize-none"
                />
              </div>
            </div>
          </div>

          {/* Status and Featured */}
          <div className="flex flex-wrap gap-6 items-center border-t border-slate-700 pt-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="draft"
                    checked={formData.status === 'draft'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' })}
                    className="w-4 h-4 text-[#a2e535] focus:ring-[#a2e535]"
                  />
                  <span>Draft</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="published"
                    checked={formData.status === 'published'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' })}
                    className="w-4 h-4 text-[#a2e535] focus:ring-[#a2e535]"
                  />
                  <span>Published</span>
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-[#a2e535] focus:ring-[#a2e535] rounded"
                />
                <span className="text-sm font-semibold">Featured Post</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-[#a2e535] text-black rounded-lg font-semibold hover:bg-[#a6cf63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Blog' : 'Create Blog'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="px-8 py-3 bg-slate-800/50 border border-slate-700 rounded-lg font-semibold hover:border-[#a2e535] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;

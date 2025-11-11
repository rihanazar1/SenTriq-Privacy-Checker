import { baseApi } from "./baseApi";

// Types
export interface Blog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    author: {
        _id: string;
        name: string;
        email: string;
    };
    category?: string;
    tags?: string[];
    status: "draft" | "published";
    isFeatured: boolean;
    viewsCount: number;
    likesCount: number;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: string;
    updatedAt: string;
    comments?: Comment[];
}

export interface Comment {
    _id: string;
    content: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    blogId: string;
    parentCommentId?: string;
    replies?: Comment[];
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface GetBlogsParams {
    status?: "published" | "draft";
    category?: string;
    isFeatured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
}

export interface GetBlogsResponse {
    success: boolean;
    data: {
        blogs: Blog[];
        pagination: Pagination;
    };
}

export interface GetBlogResponse {
    success: boolean;
    data: Blog;
}

export interface CreateBlogRequest {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: File;
    category?: string;
    tags?: string[];
    status?: "draft" | "published";
    isFeatured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
}

export interface UpdateBlogRequest {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: File;
    category?: string;
    tags?: string[];
    status?: "draft" | "published";
    isFeatured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
}

export interface BlogStatsResponse {
    success: boolean;
    data: {
        overview: {
            totalBlogs: number;
            publishedBlogs: number;
            draftBlogs: number;
            featuredBlogs: number;
            totalViews: number;
            totalLikes: number;
            avgViews: number;
            avgLikes: number;
        };
        categories: Array<{
            _id: string;
            count: number;
        }>;
    };
}

export interface AddCommentRequest {
    blogId: string;
    content: string;
    parentCommentId?: string;
}

export interface GetCommentsParams {
    page?: number;
    limit?: number;
}

export interface GetCommentsResponse {
    success: boolean;
    data: {
        comments: Comment[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalComments: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    };
}

export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all blogs (Public)
        getAllBlogs: builder.query<GetBlogsResponse, GetBlogsParams | void>({
            query: (params) => ({
                url: "/blogs",
                params: params || {},
            }),
            providesTags: ["Blog"],
        }),

        // Get single blog by slug (Public)
        getBlogBySlug: builder.query<GetBlogResponse, string>({
            query: (slug) => `/blogs/${slug}`,
            providesTags: (_result, _error, slug) => [{ type: "Blog", id: slug }],
        }),

        // Create blog (Admin only)
        createBlog: builder.mutation<GetBlogResponse, CreateBlogRequest>({
            query: (blogData) => {
                const formData = new FormData();

                formData.append("title", blogData.title);
                formData.append("content", blogData.content);

                if (blogData.excerpt) formData.append("excerpt", blogData.excerpt);
                if (blogData.coverImage) formData.append("coverImage", blogData.coverImage);
                if (blogData.category) formData.append("category", blogData.category);
                if (blogData.tags) formData.append("tags", JSON.stringify(blogData.tags));
                if (blogData.status) formData.append("status", blogData.status);
                if (blogData.isFeatured !== undefined) formData.append("isFeatured", String(blogData.isFeatured));
                if (blogData.metaTitle) formData.append("metaTitle", blogData.metaTitle);
                if (blogData.metaDescription) formData.append("metaDescription", blogData.metaDescription);

                return {
                    url: "/blogs",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Blog"],
        }),

        // Update blog (Admin only)
        updateBlog: builder.mutation<GetBlogResponse, { id: string; data: UpdateBlogRequest }>({
            query: ({ id, data }) => {
                const formData = new FormData();

                if (data.title) formData.append("title", data.title);
                if (data.content) formData.append("content", data.content);
                if (data.excerpt) formData.append("excerpt", data.excerpt);
                if (data.coverImage) formData.append("coverImage", data.coverImage);
                if (data.category) formData.append("category", data.category);
                if (data.tags) formData.append("tags", JSON.stringify(data.tags));
                if (data.status) formData.append("status", data.status);
                if (data.isFeatured !== undefined) formData.append("isFeatured", String(data.isFeatured));
                if (data.metaTitle) formData.append("metaTitle", data.metaTitle);
                if (data.metaDescription) formData.append("metaDescription", data.metaDescription);

                return {
                    url: `/blogs/${id}`,
                    method: "PUT",
                    body: formData,
                };
            },
            invalidatesTags: (_result, _error, { id }) => [
                "Blog",
                { type: "Blog", id },
            ],
        }),

        // Delete blog (Admin only)
        deleteBlog: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blog"],
        }),

        // Toggle blog status (Admin only)
        toggleBlogStatus: builder.mutation<GetBlogResponse, string>({
            query: (id) => ({
                url: `/blogs/${id}/toggle-status`,
                method: "PATCH",
            }),
            invalidatesTags: (_result, _error, id) => [
                "Blog",
                { type: "Blog", id },
            ],
        }),

        // Like blog (Public)
        likeBlog: builder.mutation<{ success: boolean; data: { likesCount: number } }, string>({
            query: (id) => ({
                url: `/blogs/${id}/like`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, id) => [{ type: "Blog", id }],
        }),

        // Get blog stats (Admin only)
        getBlogStats: builder.query<BlogStatsResponse, void>({
            query: () => "/blogs/admin/stats",
            providesTags: ["Blog"],
        }),

        // Add comment (Authenticated)
        addComment: builder.mutation<{ success: boolean; data: Comment }, AddCommentRequest>({
            query: (commentData) => ({
                url: "/comments",
                method: "POST",
                body: commentData,
            }),
            invalidatesTags: (_result, _error, { blogId }) => [
                "Comment",
                { type: "Blog", id: blogId },
            ],
        }),

        // Get blog comments (Public)
        getBlogComments: builder.query<GetCommentsResponse, { blogId: string; params?: GetCommentsParams }>({
            query: ({ blogId, params = {} }) => ({
                url: `/comments/blog/${blogId}`,
                params,
            }),
            providesTags: (_result, _error, { blogId }) => [
                "Comment",
                { type: "Blog", id: blogId },
            ],
        }),

        // Update comment (Owner only)
        updateComment: builder.mutation<{ success: boolean; data: Comment }, { id: string; content: string }>({
            query: ({ id, content }) => ({
                url: `/comments/${id}`,
                method: "PUT",
                body: { content },
            }),
            invalidatesTags: ["Comment"],
        }),

        // Delete comment (Owner or Admin)
        deleteComment: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/comments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Comment"],
        }),
    }),
});

export const {
    useGetAllBlogsQuery,
    useGetBlogBySlugQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useToggleBlogStatusMutation,
    useLikeBlogMutation,
    useGetBlogStatsQuery,
    useAddCommentMutation,
    useGetBlogCommentsQuery,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = blogApi;

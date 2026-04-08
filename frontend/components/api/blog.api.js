import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const BlogApi = createApi({
    reducerPath: "blogApi",
    baseQuery: fetchBaseQuery({
        baseUrl:process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders:(headers)=>{
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("_at");
                if (token) {
                  headers.set("Authorization", `Bearer ${token}`);
                }
              }
            return headers;
        }
    }),
    tagTypes: ['Blog', 'BlogList'],
    // Keep unused data for 10 minutes for better performance
    keepUnusedDataFor: 600,
    // Refetch on reconnect for better UX
    refetchOnReconnect: true,
    // Refetch on focus for fresh data when user returns
    refetchOnFocus: true,
    endpoints: (builder) => ({
        listAll: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => 
              `/blogs?page=${page}&limit=${limit}&search=${search}`,
            providesTags: (result, error, { page, search }) => [
                { type: 'BlogList', id: `${page}-${search}` },
                'Blog'
            ],
            // Keep paginated data for 5 minutes
            keepUnusedDataFor: 300,
            // Transform response to normalize data structure
            transformResponse: (response) => {
                return {
                    ...response,
                    // Add timestamp for cache validation
                    cachedAt: Date.now()
                };
            },
        }),
        createBlog:builder.mutation({
            query:(formData)=> ({
                url: "/blogs",
                body:formData,
                method:"POST",
                // Don't set Content-Type for FormData - browser handles it automatically
            }),
            invalidatesTags: ['Blog', 'BlogList'],
            // Optimistic update for better UX
            onQueryStarted: async (formData, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate all list queries to refresh data
                    dispatch(BlogApi.util.invalidateTags(['BlogList']));
                } catch {}
            },
        }),
        showById:builder.query({
            query:(id)=>`/blogs/${id}`,
            providesTags: (result, error, id) => [
                { type: 'Blog', id }
            ],
            // Keep individual collection data for 15 minutes
            keepUnusedDataFor: 900,
            // Transform response to add metadata
            transformResponse: (response) => ({
                ...response,
                cachedAt: Date.now()
            }),
        }),
        updateBlog:builder.mutation({
            query:({id,payload})=> ({
                url: `/blogs/${id}`,
                body:payload,
                method:"PUT",
                // Don't set Content-Type for FormData - browser handles it automatically
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Blog', id },
                'BlogList'
            ],
            // Optimistic update for better UX
            onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate specific collection and lists
                    dispatch(BlogApi.util.invalidateTags([
                        { type: 'Blog', id },
                        'BlogList'
                    ]));
                } catch {}
            },
        }),
        deleteBlog:builder.mutation({
            query:(id)=>({
                url:`/blogs/${id}`,
                method:"DELETE"
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Blog', id },
                'BlogList'
            ],
            // Optimistic update for better UX
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate all related caches
                    dispatch(BlogApi.util.invalidateTags([
                        { type: 'Blog', id },
                        'BlogList'
                    ]));
                } catch {}
            },
        }),
        // Add prefetch methods for better performance
        prefetchHome: builder.query({
            query: () => "/blogs",
            keepUnusedDataFor: 1800,
            providesTags: [{ type: 'Blog', id: 'HOME_PREFETCH' }],
        }),
        
        prefetchBlog: builder.query({
            query: (id) => `/blogs/${id}`,
            keepUnusedDataFor: 900,
            providesTags: (result, error, id) => [
                { type: 'Blog', id: `${id}_PREFETCH` }
            ],
        }),

        // Like a blog
        likeBlog: builder.mutation({
            query: (id) => ({
                url: `/blogs/${id}/like`,
                method: "POST",
            }),
            // Optimistically update the cache
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    // Update the cache with the new blog data from backend
                    dispatch(
                        BlogApi.util.updateQueryData('showById', id, (draft) => {
                            if (draft?.details && data?.details) {
                                // Update with the latest data from server
                                draft.details = data.details;
                            }
                        })
                    );
                } catch {}
            },
            invalidatesTags: (result, error, id) => [
                { type: 'Blog', id }
            ],
        }),

        // Track blog view
        viewBlog: builder.mutation({
            query: (id) => ({
                url: `/blogs/${id}/view`,
                method: "POST",
            }),
            // Update cache with new view count
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    // Update the cache with the new blog data from backend
                    dispatch(
                        BlogApi.util.updateQueryData('showById', id, (draft) => {
                            if (draft?.details && data?.details) {
                                // Update with the latest data from server
                                draft.details = data.details;
                            }
                        })
                    );
                } catch {}
            },
        })

    })
})
export const { 
    useListAllQuery, 
    useCreateBlogMutation, 
    useShowByIdQuery, 
    useUpdateBlogMutation, 
    useDeleteBlogMutation, 
    usePrefetchHomeQuery, 
    usePrefetchBlogQuery,
    useLikeBlogMutation,
    useViewBlogMutation
} = BlogApi;

// Export utility functions for manual cache management
export const {
    prefetch,
    invalidateTags,
    updateQueryData
} = BlogApi.util
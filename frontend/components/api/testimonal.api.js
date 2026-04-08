import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const TestimonialApi = createApi({
    reducerPath: "testimonalApi",
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
    tagTypes: ['Testimonials', 'TestimonialsList'],
    // Keep unused data for 10 minutes for better performance
    keepUnusedDataFor: 600,
    // Refetch on reconnect for better UX
    refetchOnReconnect: true,
    // Refetch on focus for fresh data when user returns
    refetchOnFocus: true,
    endpoints: (builder) => ({
        listAll: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => 
              `/testimonial?page=${page}&limit=${limit}&search=${search}`,
            providesTags: (result, error, { page, search }) => [
                { type: 'TestimonialsList', id: `${page}-${search}` },
                'Testimonials'
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
        createTestimonials:builder.mutation({
            query:(formData)=> ({
                url: "/testimonial",
                body:formData,
                method:"POST",
                headers:()=>([
                    {"Content-Type":"multipart/form-data"}
                ])
            }),
            invalidatesTags: ['Testimonials', 'TestimonialsList'],
            // Optimistic update for better UX
            onQueryStarted: async (formData, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate all list queries to refresh data
                    dispatch(TestimonialApi.util.invalidateTags(['TestimonialsList']));
                } catch {}
            },
        }),
        showById:builder.query({
            query:(id)=>`/testimonial/${id}`,
            providesTags: (result, error, id) => [
                { type: 'Testimonials', id }
            ],
            // Keep individual collection data for 15 minutes
            keepUnusedDataFor: 900,
            // Transform response to add metadata
            transformResponse: (response) => ({
                ...response,
                cachedAt: Date.now()
            }),
        }),
        updateTestimonials:builder.mutation({
            query:({id,payload})=> ({
                url: `/testimonial/${id}`,
                body:payload,
                method:"PUT",
                headers:()=>([
                    {"Content-Type":"multipart/form-data"}
                ])
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Testimonials', id },
                'TestimonialsList'
            ],
            // Optimistic update for better UX
            onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate specific collection and lists
                    dispatch(TestimonialApi.util.invalidateTags([
                        { type: 'Testimonials', id },
                        'TestimonialsList'
                    ]));
                } catch {}
            },
        }),
        deleteTestimonials:builder.mutation({
            query:(id)=>({
                url:`/testimonial/${id}`,
                method:"DELETE"
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Testimonials', id },
                'TestimonialsList'
            ],
            // Optimistic update for better UX
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate all related caches
                    dispatch(TestimonialApi.util.invalidateTags([
                        { type: 'Testimonials', id },
                        'TestimonialsList'
                    ]));
                } catch {}
            },
        }),
        // Add prefetch methods for better performance
        prefetchHome: builder.query({
            query: () => "/testimonial",
            keepUnusedDataFor: 1800,
            providesTags: [{ type: 'Testimonials', id: 'HOME_PREFETCH' }],
        }),

        prefetchProjects: builder.query({
            query: (id) => `/testimonial/${id}`,
            keepUnusedDataFor: 900,
            providesTags: (result, error, id) => [
                { type: 'Testimonials', id: `${id}_PREFETCH` }
            ],
        })
    })
})
export const { useListAllQuery, useCreateTestimonialsMutation, useShowByIdQuery, useUpdateTestimonialsMutation, useDeleteTestimonialsMutation, usePrefetchHomeQuery, usePrefetchTestimonialsQuery } = TestimonialApi;

// Export utility functions for manual cache management
export const {
    prefetch,
    invalidateTags,
    updateQueryData
} = TestimonialApi.util
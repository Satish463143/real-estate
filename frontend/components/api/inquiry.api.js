import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const InquiryApi = createApi({
    reducerPath: "inquiryApi",
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
    tagTypes: ['Inquiry', 'InquiryList'],
    // Keep unused data for 10 minutes for better performance
    keepUnusedDataFor: 600,
    // Refetch on reconnect for better UX
    refetchOnReconnect: true,
    // Refetch on focus for fresh data when user returns
    refetchOnFocus: true,
    endpoints: (builder) => ({
        listAll: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => 
              `/inquiry?page=${page}&limit=${limit}&search=${search}`,
            providesTags: (result, error, { page, search }) => [
                { type: 'InquiryList', id: `${page}-${search}` },
                'Inquiry'
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
        getMyInquiry: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => 
              `/inquiry/my?page=${page}&limit=${limit}&search=${search}`,
            providesTags: (result, error, { page, search }) => [
                { type: 'InquiryList', id: `${page}-${search}` },
                'Inquiry'
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
        createInquiry:builder.mutation({
            query:(formData)=> ({
                url: "/inquiry",
                body:formData,
                method:"POST",
                // Don't set Content-Type for FormData - browser handles it automatically
            }),
            invalidatesTags: ['Inquiry', 'InquiryList'],
            // Optimistic update for better UX
            onQueryStarted: async (formData, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate all list queries to refresh data
                    dispatch(InquiryApi.util.invalidateTags(['InquiryList']));
                } catch {}
            },
        }),
        showById:builder.query({
            query:(id)=>`/inquiry/${id}`,
            providesTags: (result, error, id) => [
                { type: 'Inquiry', id }
            ],
            // Keep individual collection data for 15 minutes
            keepUnusedDataFor: 900,
            // Transform response to add metadata
            transformResponse: (response) => ({
                ...response,
                cachedAt: Date.now()
            }),
        }),
        updateInquiry:builder.mutation({
            query:({id,payload})=> ({
                url: `/inquiry/${id}`,
                body:payload,
                method:"PATCH",
                // Don't set Content-Type for FormData - browser handles it automatically
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Inquiry', id },
                'InquiryList'
            ],
            onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate specific collection and lists
                    dispatch(InquiryApi.util.invalidateTags([
                        { type: 'Inquiry', id },
                        'InquiryList'
                    ]));
                } catch {}
            },
        }),
        deleteInquiry:builder.mutation({
            query:(id)=>({
                url:`/inquiry/${id}`,
                method:"DELETE"
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Inquiry', id },
                'InquiryList'
            ],
            // Optimistic update for better UX
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate all related caches
                    dispatch(InquiryApi.util.invalidateTags([
                        { type: 'Inquiry', id },
                        'InquiryList'
                    ]));
                } catch {}
            },
        }),
        // Add prefetch methods for better performance
        prefetchHome: builder.query({
            query: () => "/inquiry",
            keepUnusedDataFor: 1800,
            providesTags: [{ type: 'Inquiry', id: 'HOME_PREFETCH' }],
        }),
        
        prefetchInquiry: builder.query({
            query: (id) => `/inquiry/${id}`,
            keepUnusedDataFor: 900,
            providesTags: (result, error, id) => [
                { type: 'Inquiry', id: `${id}_PREFETCH` }
            ],
        })

    })
})
export const { 
    useListAllQuery, 
    useGetMyInquiryQuery,
    useCreateInquiryMutation, 
    useShowByIdQuery, 
    useUpdateInquiryMutation, 
    useDeleteInquiryMutation, 
    usePrefetchHomeQuery, 
    usePrefetchInquiryQuery
} = InquiryApi;

// Export utility functions for manual cache management
export const {
    prefetch,
    invalidateTags,
    updateQueryData
} = InquiryApi.util
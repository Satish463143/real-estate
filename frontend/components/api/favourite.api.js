import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const FavouriteApi = createApi({
    reducerPath: "FavouriteApi",
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
    tagTypes: ['Favourite', 'FavouriteList'],
    // Keep unused data for 10 minutes for better performance
    keepUnusedDataFor: 600,
    // Refetch on reconnect for better UX
    refetchOnReconnect: true,
    // Refetch on focus for fresh data when user returns
    refetchOnFocus: true,
    endpoints: (builder) => ({
        listAll: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => 
              `/favourite?page=${page}&limit=${limit}&search=${search}`,
            providesTags: (result, error, { page, search }) => [
                { type: 'FavouriteList', id: `${page}-${search}` },
                'Favourite'
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
        createFavourite:builder.mutation({
            query:(formData)=> ({
                url: "/favourite",
                body:formData,
                method:"POST",
                // Don't set Content-Type for FormData - browser handles it automatically
            }),
            invalidatesTags: ['Favourite', 'FavouriteList'],
            // Optimistic update for better UX
            onQueryStarted: async (formData, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate all list queries to refresh data
                    dispatch(FavouriteApi.util.invalidateTags(['FavouriteList']));
                } catch {}
            },
        }),
        deleteFavourite:builder.mutation({
            query:(id)=>({
                url:`/favourite/${id}`,
                method:"DELETE"
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Favourite', id },
                'FavouriteList'
            ],
            // Optimistic update for better UX
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate all related caches
                    dispatch(FavouriteApi.util.invalidateTags([
                        { type: 'Favourite', id },
                        'FavouriteList'
                    ]));
                } catch {}
            },
        }),
        // Add prefetch methods for better performance
        prefetchHome: builder.query({
            query: () => "/favourite",
            keepUnusedDataFor: 1800,
            providesTags: [{ type: 'Favourite', id: 'HOME_PREFETCH' }],
        }),
        
        prefetchFavourite: builder.query({
            query: (id) => `/favourite/${id}`,
            keepUnusedDataFor: 900,
            providesTags: (result, error, id) => [
                { type: 'Favourite', id: `${id}_PREFETCH` }
            ],
        })

    })
})
export const { 
    useListAllQuery, 
    useCreateFavouriteMutation, 
    useDeleteFavouriteMutation, 
    usePrefetchHomeQuery, 
    usePrefetchFavouriteQuery,
} = FavouriteApi;

// Export utility functions for manual cache management
export const {
    prefetch,
    invalidateTags,
    updateQueryData
} = FavouriteApi.util
import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const AgentApi = createApi({
    reducerPath: "agentApi",
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
    tagTypes: ['Agent', 'AgentList'],
    // Keep unused data for 10 minutes for better performance
    keepUnusedDataFor: 600,
    // Refetch on reconnect for better UX
    refetchOnReconnect: true,
    // Refetch on focus for fresh data when user returns
    refetchOnFocus: true,
    endpoints: (builder) => ({
        listAll: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => 
              `/agent?page=${page}&limit=${limit}&search=${search}`,
            providesTags: (result, error, { page, search }) => [
                { type: 'AgentList', id: `${page}-${search}` },
                'Agent'
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
        createAgent:builder.mutation({
            query:(formData)=> ({
                url: "/agent",
                body:formData,
                method:"POST"
                // Don't set Content-Type for FormData - browser handles it automatically
            }),
            invalidatesTags: ['Agent', 'AgentList'],
            // Optimistic update for better UX
            onQueryStarted: async (formData, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate all list queries to refresh data
                    dispatch(AgentApi.util.invalidateTags(['AgentList']));
                } catch {}
            },
        }),
        showById:builder.query({
            query:(id)=>`/agent/${id}`,
            providesTags: (result, error, id) => [
                { type: 'Agent', id }
            ],
            // Keep individual collection data for 15 minutes
            keepUnusedDataFor: 900,
            // Transform response to add metadata
            transformResponse: (response) => ({
                ...response,
                cachedAt: Date.now()
            }),
        }),
        updateAgent:builder.mutation({
            query:({id,payload})=> ({
                url: `/agent/${id}`,
                body:payload,
                method:"PUT"
                // Don't set Content-Type for FormData - browser handles it automatically
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Agent', id },
                'AgentList'
            ],
            // Optimistic update for better UX
            onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate specific collection and lists
                    dispatch(AgentApi.util.invalidateTags([
                        { type: 'Agent', id },
                        'AgentList'
                    ]));
                } catch {}
            },
        }),
        deleteAgent:builder.mutation({
            query:(id)=>({
                url:`/agent/${id}`,
                method:"DELETE"
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Agent', id },
                'AgentList'
            ],
            // Optimistic update for better UX
            onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Invalidate all related caches
                    dispatch(AgentApi.util.invalidateTags([
                        { type: 'Agent', id },
                        'AgentList'
                    ]));
                } catch {}
            },
        }),
        // Add prefetch methods for better performance
        prefetchHome: builder.query({
            query: () => "/agent",
            keepUnusedDataFor: 1800,
            providesTags: [{ type: 'Agent', id: 'HOME_PREFETCH' }],
        }),

        prefetchAgent: builder.query({
            query: (id) => `/agent/${id}`,
            keepUnusedDataFor: 900,
            providesTags: (result, error, id) => [
                { type: 'Agent', id: `${id}_PREFETCH` }
            ],
        })
    })
})
export const { useListAllQuery, useCreateAgentMutation, useShowByIdQuery, useUpdateAgentMutation, useDeleteAgentMutation, usePrefetchHomeQuery, usePrefetchAgentQuery } = AgentApi;

// Export utility functions for manual cache management
export const {
    prefetch,
    invalidateTags,
    updateQueryData
} = AgentApi.util
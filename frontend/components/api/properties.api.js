import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const PropertiesApi = createApi({
    reducerPath: "propertiesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("_at")
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`)
                }
            }
            return headers
        },
    }),
    tagTypes: ["Property", "PropertyList"],
    keepUnusedDataFor: 600,
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        // Admin: paginated list with search
        listAll: builder.query({
            query: ({ page = 1, limit = 10, search = "" }) =>
                `/property?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
            providesTags: (result, error, { page, search }) => [
                { type: "PropertyList", id: `${page}-${search}` },
                "Property",
            ],
            keepUnusedDataFor: 300,
            transformResponse: (response) => ({
                ...response,
                cachedAt: Date.now(),
            }),
        }),

        // Public listing for home page
        listForHome: builder.query({
            query: ({ page = 1, limit = 10, search = "", ...rest } = {}) => {
                const params = new URLSearchParams({
                    page,
                    limit,
                    ...(search && { search }),
                    ...rest,
                }).toString()
                return `/property/listForHome?${params}`
            },
            providesTags: ["Property"],
            keepUnusedDataFor: 300,
            transformResponse: (response) => ({
                ...response,
                cachedAt: Date.now(),
            }),
        }),

        // Get single property by id
        showById: builder.query({
            query: (id) => `/property/${id}`,
            providesTags: (result, error, id) => [{ type: "Property", id }],
            keepUnusedDataFor: 900,
            transformResponse: (response) => ({
                ...response,
                cachedAt: Date.now(),
            }),
        }),

        // Admin: create property (multipart/form-data)
        createProperty: builder.mutation({
            query: (formData) => ({
                url: "/property",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Property", "PropertyList"],
        }),

        // Admin: update property (multipart/form-data)
        updateProperty: builder.mutation({
            query: ({ id, payload }) => ({
                url: `/property/${id}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Property", id },
                "PropertyList",
            ],
        }),

        // Admin: delete property
        deleteProperty: builder.mutation({
            query: (id) => ({
                url: `/property/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Property", id },
                "PropertyList",
            ],
        }),
    }),
})

export const {
    useListAllQuery,
    useListForHomeQuery,
    useShowByIdQuery,
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
} = PropertiesApi

export const { prefetch, invalidateTags, updateQueryData } = PropertiesApi.util
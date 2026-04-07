import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("_at");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 error (unauthorized/malformed token), clear the tokens
  if (result.error && result.error.status === 401) {
    localStorage.removeItem('_at');
    localStorage.removeItem('_rt');
    // Optionally redirect to login
    if (window.location.pathname !== '/login') {
      // Don't redirect if already on login page
      // window.location.href = '/login';
    }
  }

  return result;
};

export const AuthApi = createApi({
    reducerPath:'AuthApi',
    baseQuery: baseQueryWithReauth,
      endpoints:(builder)=>({        
        login :builder.mutation({
            query:(args)=>({
                url:'auth/login',
                body:args,
                method:"POST",
                headers:()=>([
                    {"Content-Type":"multipart/form-data"}
                ])
            })
        }),        
        me: builder.query({
            query: () => ({
            url: 'auth/me',
            method: 'GET',  
            headers:()=>([
                {"Content-Type":"multipart/form-data"}
            ])          
            }),
        }), 
        logout: builder.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
                headers:()=>([
                    {"Content-Type":"multipart/form-data"}
                ])
            })
        }),
      })

})
export const { useCreateCustomerMutation, useMeQuery, useLoginMutation} = AuthApi
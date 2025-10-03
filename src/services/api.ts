import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
        headers.set("Content-Type", "application/json");
        return headers;
    },
    credentials: "include",
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error?.status === 401 && window.location.pathname !== "/login") {
        //localStorage.clear();
        //window.location.href = "/login";
    }
    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Admin', 'Receptionist', 'Employee', 'Buyer', 'Supplier', 'Product', 'Batch', 'Sales', 'Visits'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ['User'], // Invalidate user cache on login
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ['User', 'Buyer', 'Supplier', 'Product', 'Batch'], // Clear all cache on logout
        }),
        loadUser: builder.query({
            query: () => '/auth/load-user',
            providesTags: ['User'], // Provide user cache tag
        }),
        getBuyers: builder.query({
            query: ({
                page = 1,
                limit = 10,
                searchQuery = "",
                sortField = "createdAt",
                sortOrder = "desc"
            }) => ({
                url: "/buyer/all",
                method: "GET",
                params: {
                    page,
                    limit,
                    searchQuery,
                    sortField,
                    sortOrder,
                },
            }),
            providesTags: ['Buyer'],
        }),
        getDashboardData: builder.query({
            query: () => '/dashboard'
        }),
        getProjects: builder.query({
            query: ({
                page = 1,
                limit = 10,
                status = "",
                sortField = "createdAt",
                sortOrder = "desc",
                searchQuery = ""
            }) => ({
                url: `rag/projects`,
                method: "GET",
                params: {
                    page,
                    limit,
                    status,
                    sortField,
                    sortOrder,
                    searchQuery
                },
            })
        }),
        newProject: builder.mutation({
            query: ({ name, description, settings }) => ({
                url: `/rag/projects`,
                method: "POST",
                body: { name, description, settings },
            }),
        })
    }),
});

export const {
    useLoginMutation,
    useLoadUserQuery,
    useGetBuyersQuery,
    useLogoutMutation,
    useGetDashboardDataQuery,
    useGetProjectsQuery,
    useNewProjectMutation
} = api;
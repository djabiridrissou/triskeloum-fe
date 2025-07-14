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
        window.location.href = "/login";
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            })
        }),
        loadUser: builder.query({
            query: () => '/auth/load-user',
        }),
        createPayRequest: builder.mutation({
            query: (data) => ({
                url: "/registration-fee/create-pay",
                method: "POST",
                body: data,
            }),
        }),
        validatePayment: builder.mutation({
            query: (data) => ({
                url: `/registration-fee/make-payment?feeId=${data.feeId}`,
                method: "POST",
            }),
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
        }),
        getBuyer: builder.query({
            query: (id) => ({
                url: `/buyer/one`,
                method: "GET",
                params: { id }
            }),
        }),
        updateCanLogin: builder.mutation({
            query: (data) => ({
                url: "/user/update",
                method: "POST",
                body: data,
            }),
        }),
        getSellers: builder.query({
            query: ({
                page = 1,
                limit = 10,
                searchQuery = "",
                sortField = "createdAt",
                sortOrder = "desc"
            }) => ({
                url: "/supplier/all",
                method: "GET",
                params: {
                    page,
                    limit,
                    searchQuery,
                    sortField,
                    sortOrder,
                },
            }),
        }),
        getSeller: builder.query({
            query: (id) => ({
                url: `/supplier/one`,
                method: "GET",
                params: { id }
            }),
        }),
        getProducts: builder.query({
            query: ({
                page = 1,
                limit = 10,
                searchQuery = "",
                sortField = "createdAt",
                sortOrder = "desc"
            }) => ({
                url: "/product/all",
                method: "GET",
                params: {
                    page,
                    limit,
                    searchQuery,
                    sortField,
                    sortOrder,
                },
            }),
        }),
        createProduct: builder.mutation({
            query: (formData) => ({
                url: 'products',
                method: 'POST',
                body: formData,
            }),
        }),
        getDashboardData: builder.query({
            query: () => ({
                url: '/admin/dashboard',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLoadUserQuery,
    useGetProductsQuery,
    useCreatePayRequestMutation,
    useValidatePaymentMutation,
    useGetBuyersQuery,
    useGetBuyerQuery,
    useUpdateCanLoginMutation,
    useGetSellersQuery,
    useGetSellerQuery,
    useCreateProductMutation,
    useGetDashboardDataQuery
} = api;
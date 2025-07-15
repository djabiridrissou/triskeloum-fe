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
        localStorage.clear();
        window.location.href = "/login";
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Buyer', 'Supplier', 'Product', 'Batch'],
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
            providesTags: ['Buyer'],
        }),
        getBuyer: builder.query({
            query: (id) => ({
                url: `/buyer/one`,
                method: "GET",
                params: { id }
            }),
            providesTags: (result, error, id) => [{ type: 'Buyer', id }],
        }),
        updateCanLogin: builder.mutation({
            query: (data) => ({
                url: "/user/update",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['User', 'Buyer', 'Supplier'],
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
            providesTags: ['Supplier'],
        }),
        getSeller: builder.query({
            query: (id) => ({
                url: `/supplier/one`,
                method: "GET",
                params: { id }
            }),
            providesTags: (result, error, id) => [{ type: 'Supplier', id }],
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
            providesTags: ['Product'],
        }),
        createProduct: builder.mutation({
            query: (formData) => ({
                url: 'products',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Product'],
        }),
        getDashboardData: builder.query({
            query: () => ({
                url: '/admin/dashboard',
                method: 'GET',
            }),
            providesTags: ['User', 'Buyer', 'Supplier', 'Product'],
        }),
        addBatch: builder.mutation({
            query: (body) => ({
                url: '/product/add-batch',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Batch', 'Product'],
        }),
        getBatches: builder.query({
            query: (params) => ({
                url: '/product/list-batch',
                method: 'GET',
                params,
            }),
            providesTags: ['Batch'],
        }),
        getEvaluatedBatches: builder.query({
            query: (params) => ({
                url: '/product/evaluated-batch',
                method: 'GET',
                params,
            }),
            providesTags: ['Batch'],
        }),
        makeEvaluation: builder.mutation({
            query: (body) => ({
                url: '/evaluation/create',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Batch', 'Product'],
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
    useGetDashboardDataQuery,
    useAddBatchMutation,
    useGetBatchesQuery,
    useLogoutMutation,
    useGetEvaluatedBatchesQuery,
    useMakeEvaluationMutation,
} = api;
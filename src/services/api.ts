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

    if (result.error?.status === 401) {
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
        loadUser: builder.query({
            query: () => ({
                url: "/auth/load-user",
                method: "GET",
            }),
        }),
        getProducts: builder.query({
            query: () => ({
                url: "/product/all",
                method: "GET",
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
} = api;
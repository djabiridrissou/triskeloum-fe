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
            }),
        }),

        tutorLogin: builder.mutation({
            query: (credentials) => ({
                url: "/auth/tutor-login",
                method: "POST",
                body: credentials,
            }),
        }),

        studentRegister: builder.mutation({
            query: (credentials) => ({
                url: `/students/write`,
                method: "POST",
                body: credentials,
            }),
        }),

        tutorRegister: builder.mutation({
            query: (credentials) => ({
                url: `/tutors/write`,
                method: "POST",
                body: credentials
            }),
        }),

        verifyStudent: builder.mutation({
            query: (credentials) => ({
                url: `/students/verify`,
                method: "POST",
                body: credentials
            }),
        }),

        verifyTutor: builder.mutation({
            query: (credentials) => ({
                url: `/tutors/verify`,
                method: "POST",
                body: credentials
            }),
        }),

        loadUser: builder.query({
            query: () => ({
                url: "/auth/load-user",
                method: "GET",
            }),
        }),

        // STUDENTS
        getStudents: builder.query({
            query: (params) => ({
                url: "/students/all",
                method: "GET",
                params,
            }),
        }),

        deleteDepartment: builder.mutation({
            query: (id) => ({
                url: `/department/delete?id=${id}`,
                method: "DELETE",
            }),
        }),


        getTutors: builder.query({
            query: (params) => ({
                url: "/tutors/all",
                method: "GET",
                params,
            }),
        }),

        getAdvertisements: builder.query({
            query: (params) => ({
                url: "/advertisements/all",
                method: "GET",
                params,
            }),
        }),

        getStudentsAdvertisements: builder.query({
            query: (params) => ({
                url: "/advertisements/all",
                method: "GET",
                params,
            }),
        }),

        getDepartments: builder.query({
            query: (params) => ({
                url: "/department/all",
                method: "GET",
                params,
            }),
        }),

        getLevelsByDepartment: builder.query({
            query: (params) => ({
                url: "/level/all",
                method: "GET",
                params,
            }),
        }),

        getClassesByLevel: builder.query({
            query: (params) => ({
                url: "/class/all",
                method: "GET",
                params,
            }),
        }),

        adminLogin: builder.mutation({
            query: (credentials) => ({
                url: "/auth/admin/login",
                method: "POST",
                body: credentials,
            }),
        }),

    }),
});

export const {
    useLoginMutation,
    useGetStudentsQuery,
    useLoadUserQuery,
    useDeleteDepartmentMutation,
    useGetTutorsQuery,
    useGetAdvertisementsQuery,
    useTutorLoginMutation,
    useStudentRegisterMutation,
    useTutorRegisterMutation,
    useVerifyStudentMutation,
    useVerifyTutorMutation,
    useGetStudentsAdvertisementsQuery,
    useGetDepartmentsQuery,
    useGetLevelsByDepartmentQuery,
    useGetClassesByLevelQuery,
    useAdminLoginMutation
} = api;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Paragraph from "antd/es/skeleton/Paragraph";

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
    tagTypes: [
        'User', 
        'Admin', 
        'Receptionist', 
        'Employee', 
        'Buyer', 
        'Supplier', 
        'Product', 
        'Batch', 
        'Sales', 
        'Visits',
        'Conversations'
    ],
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
        }),
        getDocuments: builder.query({
            query: ({ projectId, page, limit, status }) => ({
                url: `/rag/documents`,
                method: "GET",
                params: {
                    projectId,
                    page,
                    limit,
                    status
                }
            })
        }),
        getProjectDetails: builder.query({
            query: ({ projectId }) => ({
                url: `/rag/projects/${projectId}`,
                method: "GET",
            })
        }),
        getFilePreview: builder.query({
            query: ({ projectId, documentId }) => ({
                url: `/rag/projects/${projectId}/documents/${documentId}/preview`,
                method: "GET",
            })
        }),
        downloadFile: builder.query({
            query: ({ projectId, documentId }) => ({
                url: `/rag/projects/${projectId}/documents/${documentId}/download`,
                method: "GET",
            })
        }),
        getFileData: builder.query({
            query: ({ projectId, documentId }) => ({
                url: `/rag/projects/${projectId}/documents/${documentId}/data`,
                method: "GET",
            })
        }),
        uploadDocuments: builder.mutation({
            query: (formData) => ({
                url: `/rag/upload/multiple`,
                method: "POST",
                body: formData,

            }),
        }),
        // services/api.ts
        conversationHistory: builder.query({
            query: ({ projectId, before, limit = 30 }) => ({
                url: `/conversation/projects/${projectId}/history`,
                method: "GET",
                params: { before, limit }
            }),
            // Merge strategy pour append les messages
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${queryArgs.projectId}`;
            },
            merge: (currentCache, newItems, { arg }) => {
                if (!arg.before) {
                    // Premier chargement
                    return newItems;
                }
                // Charger plus : append au début
                return {
                    ...newItems,
                    data: {
                        ...newItems.data,
                        conversations: [
                            ...newItems.data.conversations,
                            ...currentCache.data.conversations
                        ]
                    }
                };
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg?.before !== previousArg?.before;
            },
            providesTags: ['Conversations'], // Tag pour invalider si besoin
        }),

        // Ajouter cette mutation
        textSearch: builder.mutation({
            query: ({ query, projectId, limit = 100 }) => ({
                url: '/rag/search',
                method: 'POST',
                body: {
                    query,
                    projectId,
                    limit
                }
            }),
            invalidatesTags: ['Conversations'], // Invalider le cache des conversations pour recharger
        }),

    }),


});

export const {
    useLoginMutation,
    useLoadUserQuery,
    useGetBuyersQuery,
    useLogoutMutation,
    useGetDashboardDataQuery,
    useGetProjectsQuery,
    useNewProjectMutation,
    useGetDocumentsQuery,
    useGetProjectDetailsQuery,
    useGetFilePreviewQuery,
    useDownloadFileQuery,
    useGetFileDataQuery,
    useUploadDocumentsMutation,
    useConversationHistoryQuery,
    useTextSearchMutation
} = api;
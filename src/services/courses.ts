// src/services/course.service.ts
import { AxiosProgressEvent } from 'axios';
import axiosClient from './axiosClient';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:2082/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const courseService = {
    getCoursesByCategory: async (categoryId: number) => {
        const response = await axiosClient.get(`${BASE_URL}/app/categories/${categoryId}/courses`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getCourseDetails: async (courseId: number) => {
        const response = await axiosClient.get(`${BASE_URL}/app/courses/${courseId}`, {
            headers: getAuthHeader(),
            params: { id: courseId }
        });
        return response.data;
    },

    createCourse: async (formData: FormData, onProgress?: (progress: number) => void) => {
        const response = await axiosClient.post(`${BASE_URL}/app/courses`, formData, {
            headers: {
                // Ne PAS définir Content-Type, axios le fait automatiquement avec boundary
                ...getAuthHeader()
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress?.(progress);
                }
            }
        });
        return response.data;
    },

    updateCourse: async (courseId: number, formData: FormData, onProgress?: (progress: number) => void) => {
        const response = await axiosClient.put(`${BASE_URL}/app/courses/${courseId}`, formData, {
            headers: {
                ...getAuthHeader()
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress?.(progress);
                }
            }
        });
        return response.data;
    },

    createSection: async (courseId: number, data: any) => {
        const response = await axiosClient.post(`${BASE_URL}/app/courses/${courseId}/sections`, data, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        });
        return response.data;
    },

    getLevels: async () => {
        const response = await axiosClient.get(`${BASE_URL}/app/levels`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
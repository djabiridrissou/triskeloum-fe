import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:2082/api';


const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const uploadService = {
    uploadDocuments: async (projectId: string, files: File[], onProgress?: (progress: number) => void) => {
        const formData = new FormData();
        
        files.forEach(file => {
            formData.append('documents', file);
        });
        formData.append('projectId', projectId);

        const response = await axios.post(`${BASE_URL}/rag/upload/multiple`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress?.(progress);
                }
            }
        });

        return response.data;
    },

    createCategory: async (formData: FormData, onProgress?: (progress: number) => void) => {
        const response = await axios.post(`${BASE_URL}/app/categories`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeader()
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress?.(progress);
                }
            }
        });

        return response.data;
    },


    updateCategory: async (id: number, formData: FormData, onProgress?: (progress: number) => void) => {
        const response = await axios.put(`${BASE_URL}/app/categories/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeader()
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress?.(progress);
                }
            }
        });

        return response.data;
    },

    uploadCategoryCover: async (categoryId: string, coverFile: File, onProgress?: (progress: number) => void) => {
        const formData = new FormData();
        formData.append('cover', coverFile);

        const response = await axios.patch(`${BASE_URL}/app/categories/${categoryId}/cover`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeader()
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress?.(progress);
                }
            }
        });

        return response.data;
    }
};
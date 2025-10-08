import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:2082/api';

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
    }
};
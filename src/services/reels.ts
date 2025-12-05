// src/services/reels.ts
import { AxiosProgressEvent } from 'axios';
import axiosClient from './axiosClient';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:2082/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const reelService = {
    // Créer un reel avec upload de fichiers vidéo
    createReel: async (formData: FormData, onProgress?: (progress: number) => void) => {
        const response = await axiosClient.post(`${BASE_URL}/admin/reels`, formData, {
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

    // Mettre à jour un reel avec upload optionnel de fichiers vidéo
    updateReel: async (reelId: number, formData: FormData, onProgress?: (progress: number) => void) => {
        const response = await axiosClient.put(`${BASE_URL}/admin/reels/${reelId}`, formData, {
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

    // Récupérer les reels (pour list)
    getReels: async (page: number = 1, limit: number = 10, search?: string) => {
        const response = await axiosClient.get(`${BASE_URL}/admin/reels`, {
            headers: getAuthHeader(),
            params: { page, limit, ...(search && { search }) }
        });
        return response.data;
    },

    // Récupérer un reel spécifique
    getReel: async (id: number) => {
        const response = await axiosClient.get(`${BASE_URL}/admin/reels/${id}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },
};
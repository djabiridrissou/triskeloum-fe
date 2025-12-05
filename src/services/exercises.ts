import { AxiosProgressEvent } from 'axios';
import axiosClient from './axiosClient';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:2082/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const exerciseService = {
    // Créer un exercice avec upload de fichiers PDF
    createExercise: async (formData: FormData, onProgress?: (progress: number) => void) => {
        const response = await axiosClient.post(`${BASE_URL}/admin/exercises`, formData, {
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

    // Mettre à jour un exercice avec upload optionnel de fichiers PDF
    updateExercise: async (exerciseId: number, formData: FormData, onProgress?: (progress: number) => void) => {
        const response = await axiosClient.put(`${BASE_URL}/admin/exercises/${exerciseId}`, formData, {
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

    // Récupérer les exercices (pour list)
    getExercises: async (page: number = 1, limit: number = 10, type?: string, search?: string) => {
        const response = await axiosClient.get(`${BASE_URL}/admin/exercises`, {
            headers: getAuthHeader(),
            params: { page, limit, ...(type && { type }), ...(search && { search }) }
        });
        return response.data;
    },

    // Récupérer un exercice spécifique
    getExercise: async (exerciseId: number) => {
        const response = await axiosClient.get(`${BASE_URL}/admin/exercises/${exerciseId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Supprimer un exercice
    deleteExercise: async (exerciseId: number) => {
        const response = await axiosClient.delete(`${BASE_URL}/admin/exercises/${exerciseId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Basculer le statut actif/inactif
    toggleActive: async (exerciseId: number) => {
        const response = await axiosClient.patch(`${BASE_URL}/admin/exercises/${exerciseId}/toggle-active`, {}, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
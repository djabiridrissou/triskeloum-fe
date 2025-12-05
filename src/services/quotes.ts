import axiosClient from './axiosClient';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:2082/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const quoteService = {
    // Récupérer toutes les quotes
    getQuotes: async (page: number = 1, limit: number = 10, search?: string) => {
        const response = await axiosClient.get(`${BASE_URL}/admin/quotes`, {
            headers: getAuthHeader(),
            params: { page, limit, ...(search && { search }) }
        });
        return response.data;
    },

    // Récupérer une quote spécifique
    getQuote: async (id: number) => {
        const response = await axiosClient.get(`${BASE_URL}/admin/quotes/${id}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    // Créer une quote avec upload d'image optionnel
    createQuote: async (formData: FormData) => {
        const response = await axiosClient.post(`${BASE_URL}/admin/quotes`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Mettre à jour une quote avec upload d'image optionnel
    updateQuote: async (id: number, formData: FormData) => {
        const response = await axiosClient.put(`${BASE_URL}/admin/quotes/${id}`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Supprimer une quote
    deleteQuote: async (id: number) => {
        const response = await axiosClient.delete(`${BASE_URL}/admin/quotes/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
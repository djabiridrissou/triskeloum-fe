// src/services/faqs.ts
import axiosClient from "./axiosClient";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:2082/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export interface FaqData {
    question: string;
    answer: string;
    category: 'account' | 'courses' | 'payment' | 'settings';
    order?: number;
    tags?: string[];
    is_published?: boolean;
}

export const faqService = {
    // Récupérer toutes les FAQs
    getFaqs: async (page: number = 1, limit: number = 10, search?: string) => {
        const response = await axiosClient.get(`${BASE_URL}/admin/faqs`, {
            headers: getAuthHeader(),
            params: { page, limit, ...(search && { search }) }
        });
        return response.data;
    },

    // Récupérer une FAQ spécifique
    getFaq: async (id: number) => {
        const response = await axiosClient.get(`${BASE_URL}/admin/faqs/${id}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    // Créer une FAQ
    createFaq: async (faqData: FaqData) => {
        const response = await axiosClient.post(`${BASE_URL}/admin/faqs`, faqData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Mettre à jour une FAQ
    updateFaq: async (id: number, faqData: Partial<FaqData>) => {
        const response = await axiosClient.put(`${BASE_URL}/admin/faqs/${id}`, faqData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Supprimer une FAQ
    deleteFaq: async (id: number) => {
        const response = await axiosClient.delete(`${BASE_URL}/admin/faqs/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
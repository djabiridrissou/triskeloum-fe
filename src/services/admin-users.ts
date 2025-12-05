import axiosClient from "./axiosClient";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4005/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const adminUsersService = {
  // Récupérer la liste des utilisateurs
  getAllUsers: async (page: number = 1, limit: number = 20, filters?: { search?: string; level?: string; role?: string; sortField?: string; sortDirection?: 'ASC' | 'DESC' }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.level && { level: filters.level }),
      ...(filters?.role && { role: filters.role }),
      ...(filters?.sortField && { sortField: filters.sortField }),
      ...(filters?.sortDirection && { sortDirection: filters.sortDirection })
    });

    const response = await axiosClient.get(`${BASE_URL}/admin/users?${params.toString()}`, {
      headers: getAuthHeader()
    });
    return response.data?.payload;
  },

  // Récupérer les détails d'un utilisateur
  getUserDetails: async (id: number) => {
    const response = await axiosClient.get(`${BASE_URL}/admin/users/${id}`, {
      headers: getAuthHeader()
    });
    return response.data.data;
  },

  // Bloquer un utilisateur
  blockUser: async (id: number) => {
    const response = await axiosClient.patch(`${BASE_URL}/admin/users/${id}/block`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Débloquer un utilisateur
  unblockUser: async (id: number) => {
    const response = await axiosClient.patch(`${BASE_URL}/admin/users/${id}/unblock`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Supprimer un utilisateur
  deleteUser: async (id: number) => {
    const response = await axiosClient.delete(`${BASE_URL}/admin/users/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Créer un utilisateur
  createUser: async (data: any) => {
    const response = await axiosClient.post(`${BASE_URL}/admin/users`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Modifier un utilisateur
  updateUser: async (id: number, data: any) => {
    const response = await axiosClient.put(`${BASE_URL}/admin/users/${id}`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};
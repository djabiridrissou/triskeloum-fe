import React, { useState, useEffect } from 'react';
import { TrashIcon, LockClosedIcon, LockOpenIcon, PencilIcon, PlusIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import { adminUsersService } from '../../services/admin-users';
import SearchBar from '../../components/SearchBar';
import ConfirmModal from '../../components/ConfirmModal';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Pagination from '../../components/Pagination';
import UserFormModal from '../../components/UserFormModal';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  role: string;
  is_blocked: boolean;
  created_at: string;
  last_login: string | null;
  level?: {
    name: string;
    rank: number;
  };
}

interface UsersData {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
  
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState<number | null>(null);

  // Form modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [levels, setLevels] = useState<any[]>([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data: UsersData = await adminUsersService.getAllUsers(page, 20, {
        search: debouncedSearch,
        sortField,
        sortDirection
      });

      console.log("🚀 ~ file: Users.tsx:105 ~ fetchUsers ~ data:", data);
      
      setUsers(data?.users);
      setPagination(data.pagination);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortDirection('ASC');
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return <span className="ml-1 text-gray-400">⇅</span>;
    }
    return sortDirection === 'ASC' 
      ? <span className="ml-1 text-blue-600">▲</span>
      : <span className="ml-1 text-blue-600">▼</span>;
  };

  // Load levels on mount
  useEffect(() => {
    const loadLevels = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/app/level/all`);
        if (response.ok) {
          const data = await response.json();
          setLevels(data.payload?.data || []);
        }
      } catch (error) {
        console.error('Error loading levels:', error);
      }
    };
    loadLevels();
  }, []);

  const handleBlock = async (user: User) => {
    try {
      setIsProcessing(true);
      await adminUsersService.blockUser(user.id);
      toast.success('Utilisateur bloqué avec succès');
      setUsers(users.map(u => u.id === user.id ? { ...u, is_blocked: true } : u));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erreur lors du blocage');
    } finally {
      setIsProcessing(false);
    }
  };

  // Unblock user
  const handleUnblock = async (user: User) => {
    try {
      setIsProcessing(true);
      await adminUsersService.unblockUser(user.id);
      toast.success('Utilisateur débloqué avec succès');
      setUsers(users.map(u => u.id === user.id ? { ...u, is_blocked: false } : u));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erreur lors du déblocage');
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete user
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setIsProcessing(true);
      await adminUsersService.deleteUser(selectedUser.id);
      toast.success('Utilisateur supprimé avec succès');
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Create user
  const handleCreateUser = () => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  };

  // Edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  // Start chat with user
  const handleStartChat = async (user: User) => {
    try {
      setIsChatLoading(user.id);
      
      const token = localStorage.getItem('accessToken');
      const response = await axiosClient.get(
        `${import.meta.env.VITE_BASE_URL}/app/direct/${user.id}`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Chat ouvert');
        navigate('/admin/crm', { state: { selectedRoomId: response.data.payload.id } });
      } else {
        toast.error('Erreur lors de l\'ouverture du chat');
      }
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast.error(error?.response?.data?.message || 'Erreur lors de l\'ouverture du chat');
    } finally {
      setIsChatLoading(null);
    }
  };

  // Submit form
  const handleFormSubmit = async (formData: any) => {
    try {
      setIsFormSubmitting(true);
      
      if (editingUser) {
        // Update user
        await adminUsersService.updateUser(editingUser.id, formData);
        toast.success('Utilisateur modifié avec succès');
        
        // Update local state
        setUsers(users.map(u => 
          u.id === editingUser.id 
            ? { ...u, ...formData }
            : u
        ));
      } else {
        // Create user
        const newUser = await adminUsersService.createUser(formData);
        toast.success('Utilisateur créé avec succès');
        
        // Refresh users list
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 p-8 overflow-auto">
      <div className="max-w-8xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-gray-600 mt-2">Gérez et contrôlez les utilisateurs de la plateforme</p>
          </div>
          <button
            onClick={handleCreateUser}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Créer utilisateur
          </button>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center gap-4">
          <div className="w-full max-w-md">
            <SearchBar 
              value={search} 
              onChange={setSearch}
              placeholder="Rechercher par nom, email ou téléphone..."
            />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total: <span className="font-bold text-lg">{pagination.total}</span></p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={() => handleSort('firstname')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Utilisateur
                  <SortIcon field="firstname" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('email')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Email
                  <SortIcon field="email" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('phone')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Téléphone
                  <SortIcon field="phone" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Niveau
              </th>
              <th 
                onClick={() => handleSort('role')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Rôle
                  <SortIcon field="role" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Statut
              </th>
              <th 
                onClick={() => handleSort('last_login')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  Dernière connexion
                  <SortIcon field="last_login" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8">
                  <LoadingSkeleton />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8">
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">
                      {search ? 'Aucun utilisateur correspondant à votre recherche' : 'Aucun utilisateur trouvé'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.firstname} {user.lastname}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.level ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                          {user.level.name}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">#{user.level.rank}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_blocked
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.is_blocked ? '🔒 Bloqué' : '✅ Actif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(user.last_login)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStartChat(user)}
                        disabled={isProcessing || isChatLoading === user.id}
                        className="p-2 rounded-md text-green-600 hover:bg-green-50 disabled:opacity-50 transition-colors"
                        title="Démarrer un chat"
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        disabled={isProcessing}
                        className="p-2 rounded-md text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors"
                        title="Modifier l'utilisateur"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      {user.is_blocked ? (
                        <button
                          onClick={() => handleUnblock(user)}
                          disabled={isProcessing}
                          className="p-2 rounded-md text-green-600 hover:bg-green-50 disabled:opacity-50 transition-colors"
                          title="Débloquer l'utilisateur"
                        >
                          <LockOpenIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlock(user)}
                          disabled={isProcessing}
                          className="p-2 rounded-md text-yellow-600 hover:bg-yellow-50 disabled:opacity-50 transition-colors"
                          title="Bloquer l'utilisateur"
                        >
                          <LockClosedIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(user)}
                        disabled={isProcessing}
                        className="p-2 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                        title="Supprimer l'utilisateur"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination 
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleFormSubmit}
        user={editingUser}
        levels={levels}
        isLoading={isFormSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedUser?.firstname} ${selectedUser?.lastname} ? Cette action ne peut pas être annulée.`}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        isLoading={isProcessing}
        confirmText="Supprimer"
        isDangerous={true}
      />
    </div>
  );
};

export default Users;
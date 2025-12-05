// src/pages/admin/Levels.tsx
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import SearchBar from '../../components/SearchBar';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Pagination from '../../components/Pagination';
import Modal2 from '../../components/Modal2';
import {
    useGetAdminLevelsQuery,
    useGetLevelsStatsQuery,
    useCreateLevelMutation,
    useUpdateLevelMutation,
    useDeleteLevelMutation,
} from '../../services/api';

interface LevelForm {
    name: string;
    rank: number;
    is_public: boolean;
}

const Levels: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortField, setSortField] = useState<string>('rank');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<any | null>(null);
    const [formData, setFormData] = useState<LevelForm>({
        name: '',
        rank: 0,
        is_public: false,
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Queries
    const { data: levelsData, isLoading, refetch } = useGetAdminLevelsQuery({
        page,
        limit: 5,
        search: debouncedSearch,
        sortField,
        sortDirection
    });

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

    const { data: statsData, refetch: refetchStats } = useGetLevelsStatsQuery();

    // Mutations
    const [createLevel, { isLoading: isCreating }] = useCreateLevelMutation();
    const [updateLevel, { isLoading: isUpdating }] = useUpdateLevelMutation();
    const [deleteLevel, { isLoading: isDeleting }] = useDeleteLevelMutation();

    // Handlers
    const handleCreate = () => {
        setSelectedLevel(null);
        setFormData({ name: '', rank: 0, is_public: false });
        setFormErrors({});
        setIsFormModalOpen(true);
    };

    const handleEdit = (level: any) => {
        setSelectedLevel(level);
        setFormData({
            name: level.name,
            rank: level.rank,
            is_public: level.is_public,
        });
        setFormErrors({});
        setIsFormModalOpen(true);
    };

    const handleDelete = (level: any) => {
        setSelectedLevel(level);
        setIsDeleteModalOpen(true);
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'Le nom est requis';
        }

        if (!formData.rank || formData.rank < 1) {
            errors.rank = 'Le rang doit être supérieur à 0';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (selectedLevel) {
                // Update
                await updateLevel({
                    id: selectedLevel.id,
                    data: formData,
                }).unwrap();
                toast.success('Niveau mis à jour avec succès');
            } else {
                // Create
                await createLevel(formData).unwrap();
                toast.success('Niveau créé avec succès');
            }

            setIsFormModalOpen(false);
            setFormData({ name: '', rank: 0, is_public: false });
            refetch();
            refetchStats();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Une erreur est survenue');
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedLevel) return;

        try {
            await deleteLevel(selectedLevel.id).unwrap();
            toast.success('Niveau supprimé avec succès');
            setIsDeleteModalOpen(false);
            setSelectedLevel(null);
            refetch();
            refetchStats();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Une erreur est survenue');
        }
    };

    // Data extraction
    const levels = levelsData?.payload?.data || [];
    const totalPages = levelsData?.payload?.pagination?.totalPages || 1;
    const stats = statsData?.payload;

    return (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 overflow-auto">
            <div className="max-w-8xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Niveaux</h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">Gérez les niveaux de votre plateforme</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nouveau niveau
                    </button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">📊</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Publics</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">{stats.public}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🌐</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Privés</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-2">{stats.private}</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🔒</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Rechercher un niveau..."
                    />
                </div>

                {/* Content */}
                {isLoading ? (
                    <LoadingSkeleton />
                ) : levels.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📚</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {debouncedSearch ? 'Aucun niveau trouvé' : 'Aucun niveau'}
                        </h3>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base">
                            {debouncedSearch
                                ? 'Essayez de modifier votre recherche'
                                : 'Commencez par créer votre premier niveau'}
                        </p>
                        {!debouncedSearch && (
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Créer un niveau
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr className="border-b">
                                        <th 
                                            onClick={() => handleSort('rank')}
                                            className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center">
                                                Rang
                                                <SortIcon field="rank" />
                                            </div>
                                        </th>
                                        <th 
                                            onClick={() => handleSort('name')}
                                            className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center">
                                                Nom
                                                <SortIcon field="name" />
                                            </div>
                                        </th>
                                        <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-900">Cours</th>
                                        <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-900">Utilisateurs</th>
                                        <th 
                                            onClick={() => handleSort('is_public')}
                                            className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center">
                                                Statut
                                                <SortIcon field="is_public" />
                                            </div>
                                        </th>
                                        <th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {levels.map((level: any) => (
                                        <tr key={level.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                                                    {level.rank}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 font-medium truncate">{level.name}</td>
                                            <td className="hidden sm:table-cell px-6 py-4 text-xs text-gray-600">{level.courses_count || 0}</td>
                                            <td className="hidden lg:table-cell px-6 py-4 text-xs text-gray-600">{level.users_count || 0}</td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                                                        level.is_public
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {level.is_public ? 'Public' : 'Privé'}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(level)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(level)}
                                                        disabled={isDeleting}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Supprimer"
                                                    >
                                                        <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Form Modal */}
                <Modal2
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    size="md"
                >
                    <div className="p-4 sm:p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {selectedLevel ? 'Modifier le niveau' : 'Créer un nouveau niveau'}
                    </h2>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom du niveau *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="ex: Level 1"
                            />
                            {formErrors.name && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                            )}
                        </div>

                        {/* Rank */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rang *
                            </label>
                            <input
                                type="number"
                                value={formData.rank}
                                onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) || 0 })}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    formErrors.rank ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="ex: 1"
                                min="1"
                            />
                            {formErrors.rank && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.rank}</p>
                            )}
                        </div>

                        {/* Public/Private */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_public"
                                checked={formData.is_public}
                                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <label htmlFor="is_public" className="ml-3 text-sm font-medium text-gray-700">
                                Rendre ce niveau public
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsFormModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isCreating || isUpdating}
                                className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {isCreating || isUpdating ? 'Chargement...' : selectedLevel ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </form>
                    </div>
                </Modal2>

                {/* Delete Confirmation Modal */}
                <Modal2
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    size="md"
                >
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                                <span className="text-xl">⚠️</span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Supprimer le niveau
                            </h2>
                        </div>

                        <p className="text-gray-600 mb-6 text-sm sm:text-base">
                            Êtes-vous sûr de vouloir supprimer le niveau{' '}
                            <span className="font-semibold text-gray-900">"{selectedLevel?.name}"</span> ?
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-6">
                            Cette action est irréversible.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                {isDeleting ? 'Suppression...' : 'Supprimer'}
                            </button>
                        </div>
                    </div>
                </Modal2>
            </div>
        </div>
    );
};

export default Levels;
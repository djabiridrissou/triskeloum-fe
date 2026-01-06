// src/pages/admin/Levels.tsx
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ChartBarIcon, GlobeAltIcon, LockClosedIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { BookOpen } from 'lucide-react';
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
    const [limit, setLimit] = useState(10);
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
        limit,
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
            return <span className="ml-1 text-gray-400 dark:text-gray-600">⇅</span>;
        }
        return sortDirection === 'ASC'
            ? <span className="ml-1 text-amber-600 dark:text-amber-400">▲</span>
            : <span className="ml-1 text-amber-600 dark:text-amber-400">▼</span>;
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
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-bg-primary p-4 sm:p-6 lg:p-8 overflow-auto transition-colors duration-300">
            <div className="max-w-8xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-1"
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                            Niveaux
                        </h1>
                        <p className="text-gray-600 dark:text-text-tertiary mt-1 text-sm sm:text-base">Gérez les niveaux de votre plateforme</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nouveau niveau
                    </button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {/* Total */}
                        <div className="relative bg-gradient-to-br from-amber-50/30 to-white dark:from-transparent dark:to-transparent dark:bg-bg-tertiary rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 group overflow-hidden shadow-sm hover:shadow-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-500/5 dark:to-transparent" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <ChartBarIcon className="h-6 w-6 text-black" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-text-tertiary mb-1">Total Niveaux</h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">{stats.total}</p>
                            </div>
                        </div>

                        {/* Public */}
                        <div className="relative bg-gradient-to-br from-amber-50/30 to-white dark:from-transparent dark:to-transparent dark:bg-bg-tertiary rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 group overflow-hidden shadow-sm hover:shadow-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent dark:from-green-500/5 dark:to-transparent" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <GlobeAltIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-text-tertiary mb-1">Niveaux Publics</h3>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.public}</p>
                            </div>
                        </div>

                        {/* Private */}
                        <div className="relative bg-gradient-to-br from-amber-50/30 to-white dark:from-transparent dark:to-transparent dark:bg-bg-tertiary rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 group overflow-hidden shadow-sm hover:shadow-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent dark:from-gray-500/5 dark:to-transparent" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <LockClosedIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-text-tertiary mb-1">Niveaux Privés</h3>
                                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.private}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="bg-gradient-to-br from-amber-50/30 to-white dark:from-transparent dark:to-transparent dark:bg-bg-tertiary rounded-xl shadow-sm hover:shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-800 transition-all duration-300">
                    <div className="w-full sm:max-w-md">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Rechercher un niveau..."
                        />
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <LoadingSkeleton />
                ) : levels.length === 0 ? (
                    <div className="bg-white dark:bg-bg-tertiary rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center transition-colors">
                        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-2">
                            {debouncedSearch ? 'Aucun niveau trouvé' : 'Aucun niveau'}
                        </h3>
                        <p className="text-gray-600 dark:text-text-tertiary mb-6 text-sm sm:text-base">
                            {debouncedSearch
                                ? 'Essayez de modifier votre recherche'
                                : 'Commencez par créer votre premier niveau'}
                        </p>
                        {!debouncedSearch && (
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Créer un niveau
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Rows per page selector */}
                        <div className="mb-4">
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-bg-secondary text-gray-900 dark:text-text-primary focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent text-sm transition-all"
                            >
                                <option value={5}>5 par page</option>
                                <option value={10}>10 par page</option>
                                <option value={25}>25 par page</option>
                                <option value={50}>50 par page</option>
                                <option value={100}>100 par page</option>
                            </select>
                        </div>

                        {/* Table */}
                        <div className="bg-white dark:bg-bg-tertiary rounded-lg shadow-md border border-gray-200 dark:border-gray-800 overflow-x-auto transition-colors">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-bg-secondary">
                                    <tr className="border-b border-gray-200 dark:border-gray-800">
                                        <th
                                            onClick={() => handleSort('rank')}
                                            className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-text-tertiary cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-center">
                                                Rang
                                                <SortIcon field="rank" />
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('name')}
                                            className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-text-tertiary cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-center">
                                                Nom
                                                <SortIcon field="name" />
                                            </div>
                                        </th>
                                        <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-text-tertiary">Cours</th>
                                        <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-text-tertiary">Utilisateurs</th>
                                        <th
                                            onClick={() => handleSort('is_public')}
                                            className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-text-tertiary cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-center">
                                                Statut
                                                <SortIcon field="is_public" />
                                            </div>
                                        </th>
                                        <th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-900 dark:text-text-tertiary">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {levels.map((level: any) => (
                                        <tr key={level.id} className="hover:bg-gray-50 dark:hover:bg-amber-900/10 transition-colors">
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400">
                                                    {level.rank}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-text-primary font-medium truncate">{level.name}</td>
                                            <td className="hidden sm:table-cell px-6 py-4 text-xs text-gray-600 dark:text-text-secondary">{level.courses_count || 0}</td>
                                            <td className="hidden lg:table-cell px-6 py-4 text-xs text-gray-600 dark:text-text-secondary">{level.users_count || 0}</td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                                                        level.is_public
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                                                    }`}
                                                >
                                                    {level.is_public ? 'Public' : 'Privé'}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(level)}
                                                        className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(level)}
                                                        disabled={isDeleting}
                                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
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
                    <div className="p-6 sm:p-8">
                        {/* Header with gradient accent */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center shadow-md">
                                {selectedLevel ? (
                                    <PencilIcon className="w-6 h-6 text-black" />
                                ) : (
                                    <PlusIcon className="w-6 h-6 text-black" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                                {selectedLevel ? 'Modifier le niveau' : 'Créer un nouveau niveau'}
                            </h2>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-text-primary mb-2">
                                    Nom du niveau *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-bg-secondary text-gray-900 dark:text-text-primary placeholder-gray-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all ${
                                        formErrors.name ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-700'
                                    }`}
                                    placeholder="ex: Débutant"
                                />
                                {formErrors.name && (
                                    <p className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                                        <ExclamationTriangleIcon className="w-4 h-4" />
                                        {formErrors.name}
                                    </p>
                                )}
                            </div>

                            {/* Rank */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-text-primary mb-2">
                                    Rang *
                                </label>
                                <input
                                    type="number"
                                    value={formData.rank}
                                    onChange={(e) => setFormData({ ...formData, rank: parseInt(e.target.value) || 0 })}
                                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-bg-secondary text-gray-900 dark:text-text-primary placeholder-gray-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all ${
                                        formErrors.rank ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-700'
                                    }`}
                                    placeholder="ex: 1"
                                    min="1"
                                />
                                {formErrors.rank && (
                                    <p className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                                        <ExclamationTriangleIcon className="w-4 h-4" />
                                        {formErrors.rank}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 dark:text-text-tertiary mt-2">
                                    Le rang détermine l'ordre d'affichage des niveaux
                                </p>
                            </div>

                            {/* Public/Private Toggle */}
                            <div className="bg-gray-50 dark:bg-bg-secondary rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_public"
                                        checked={formData.is_public}
                                        onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                        className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-700 text-amber-600 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-colors cursor-pointer"
                                    />
                                    <div className="flex-1">
                                        <label htmlFor="is_public" className="block text-sm font-semibold text-gray-700 dark:text-text-primary cursor-pointer">
                                            Rendre ce niveau public
                                        </label>
                                        <p className="text-xs text-gray-500 dark:text-text-tertiary mt-1">
                                            Les niveaux publics sont visibles par tous les utilisateurs
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsFormModalOpen(false)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-text-primary font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                >
                                    {isCreating || isUpdating ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            Chargement...
                                        </span>
                                    ) : (
                                        selectedLevel ? 'Mettre à jour' : 'Créer le niveau'
                                    )}
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
                    <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-md">
                                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                                Supprimer le niveau
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-900/30 mb-6">
                            <p className="text-gray-700 dark:text-text-secondary text-base">
                                Êtes-vous sûr de vouloir supprimer le niveau{' '}
                                <span className="font-semibold text-red-600 dark:text-red-400">"{selectedLevel?.name}"</span> ?
                            </p>
                            <p className="text-sm text-gray-600 dark:text-text-tertiary mt-3 flex items-start gap-2">
                                <ExclamationTriangleIcon className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <span>Cette action est irréversible et supprimera toutes les données associées.</span>
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-text-primary font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Suppression...
                                    </span>
                                ) : (
                                    'Supprimer définitivement'
                                )}
                            </button>
                        </div>
                    </div>
                </Modal2>
            </div>
        </div>
    );
};

export default Levels;
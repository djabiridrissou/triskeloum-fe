// src/pages/courses/Reels.tsx
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import SearchBar from '../../components/SearchBar';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Pagination from '../../components/Pagination';
import Modal2 from '../../components/Modal2';
import FileUploadZone from '../../components/FileUploadZone';
import { useGetAdminReelsQuery, useDeleteReelMutation, useToggleActiveReelMutation, useGetAdminLevelsQuery } from '../../services/api';
import { reelService } from '../../services/reels';

interface ReelFormData {
    title: string;
    description: string;
    duration: number;
    levelId: number;
    videoFile?: File;
    thumbnailFile?: File;
}

const Reels: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedReel, setSelectedReel] = useState<any | null>(null);
    const [formData, setFormData] = useState<ReelFormData>({
        title: '',
        description: '',
        duration: 0,
        levelId: 0,
    });
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
    const [selectedVideoTitle, setSelectedVideoTitle] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: reelsData, isLoading, refetch } = useGetAdminReelsQuery({
        page,
        limit: 5,
        search: debouncedSearch,
    });

    const { data: levelsData } = useGetAdminLevelsQuery({
        page: 1,
        limit: 100,
        search: '',
    });

    const [deleteReel, { isLoading: isDeleting }] = useDeleteReelMutation();
    const [toggleActive, { isLoading: isToggling }] = useToggleActiveReelMutation();

    // Get levels for form
    const levels = levelsData?.payload?.data || [];

    const reels = reelsData?.payload?.data || [];
    const totalPages = reelsData?.payload?.pagination?.totalPages || 1;

    const stats = {
        total: reelsData?.payload?.pagination?.total || reels?.length,
        active: reels?.filter((r: any) => r.isActive).length,
        inactive: reels?.filter((r: any) => !r.isActive).length,
    };

    const handleCreate = () => {
        setSelectedReel(null);
        setFormData({
            title: '',
            description: '',
            duration: 0,
            levelId: 0,
        });
        setIsFormModalOpen(true);
    };

    const handleEdit = (reel: any) => {
        setSelectedReel(reel);
        setFormData({
            title: reel.title,
            description: reel.description,
            duration: reel.duration,
            levelId: reel.level?.id,
        });
        setIsFormModalOpen(true);
    };

    const handleDelete = async (reelId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce reel ?')) {
            return;
        }
        try {
            await deleteReel(reelId).unwrap();
            toast.success('Reel supprimé');
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const handleToggleActive = async (reel: any) => {
        try {
            await toggleActive(reel.id).unwrap();
            toast.success(reel.isActive ? 'Reel désactivé' : 'Reel activé');
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Erreur');
        }
    };

    const handleViewVideo = (reel: any) => {
        if (reel.videoUrl) {
            setSelectedVideoUrl(reel.videoUrl);
            setSelectedVideoTitle(reel.title);
            setIsVideoModalOpen(true);
        } else {
            toast.error('Aucun fichier vidéo disponible');
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.duration || !formData.levelId) {
            toast.error('Veuillez remplir tous les champs requis');
            return;
        }

        if (!selectedReel && !formData.videoFile) {
            toast.error('Veuillez ajouter un fichier vidéo');
            return;
        }

        try {
            setIsUploading(true);

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('duration', formData.duration.toString());
            formDataToSend.append('levelId', formData.levelId.toString());

            if (formData.videoFile) {
                formDataToSend.append('video', formData.videoFile);
            }
            if (formData.thumbnailFile) {
                formDataToSend.append('thumbnail', formData.thumbnailFile);
            }

            if (selectedReel) {
                await reelService.updateReel(selectedReel.id, formDataToSend, setUploadProgress);
                toast.success('Reel modifié');
            } else {
                await reelService.createReel(formDataToSend, setUploadProgress);
                toast.success('Reel créé');
            }

            setIsFormModalOpen(false);
            setUploadProgress(0);
            refetch();
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error?.message || 'Erreur lors de la soumission');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-8xl mx-2 px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reels</h1>
                    <p className="text-gray-600 mt-1">Gérez tous vos reels vidéo</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nouveau reel
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🎬</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Actifs</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Inactifs</p>
                            <p className="text-3xl font-bold text-gray-600 mt-2">{stats.inactive}</p>
                        </div>
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">⏸️</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Rechercher un reel..."
                />
            </div>

            {/* Content */}
            {isLoading ? (
                <LoadingSkeleton />
            ) : reels.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🎬</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun reel</h3>
                    <p className="text-gray-600 mb-6">Commencez par créer votre premier reel</p>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Créer un reel
                    </button>
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Titre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Durée</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Niveau</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vues</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Likes</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reels.map((reel: any) => (
                                    <tr key={reel.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{reel.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{reel.duration}s</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{reel.level?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">👁️ {reel.viewsCount}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">❤️ {reel.likesCount}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(reel)}
                                                disabled={isToggling}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                                    reel.isActive
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                }`}
                                            >
                                                {reel.isActive ? 'Actif' : 'Inactif'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewVideo(reel)}
                                                    title="Visionner la vidéo"
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                >
                                                    <PlayIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(reel)}
                                                    title="Modifier"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(reel.id)}
                                                    disabled={isDeleting}
                                                    title="Supprimer"
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}

            {/* Form Modal */}
            <Modal2
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                title={selectedReel ? 'Modifier le reel' : 'Créer un nouveau reel'}
                size="lg"
            >
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Titre *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Titre du reel"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Description du reel"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Durée (secondes) *
                        </label>
                        <input
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Durée en secondes"
                            min="1"
                        />
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Niveau *
                        </label>
                        <select
                            value={formData.levelId}
                            onChange={(e) => setFormData({ ...formData, levelId: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Sélectionner un niveau</option>
                            {levels.map((level: any) => (
                                <option key={level.id} value={level.id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Video File */}
                    <FileUploadZone
                        type="video"
                        accept="video/*"
                        label="Fichier vidéo"
                        isRequired={!selectedReel}
                        selectedFile={formData.videoFile}
                        onChange={(file) => setFormData({ ...formData, videoFile: file })}
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    )}

                    {/* Thumbnail File */}
                    <FileUploadZone
                        type="image"
                        accept="image/*"
                        label="Thumbnail (image)"
                        isRequired={false}
                        selectedFile={formData.thumbnailFile}
                        onChange={(file) => setFormData({ ...formData, thumbnailFile: file })}
                    />

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsFormModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isUploading ? 'Traitement...' : selectedReel ? 'Modifier' : 'Créer'}
                        </button>
                    </div>
                </form>
            </Modal2>

            {/* Video Viewer Modal */}
            <Modal2
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                title={selectedVideoTitle || 'Vidéo'}
                size="xl"
            >
                <div className="space-y-4">
                    {/* Video Player */}
                    <div className="bg-black rounded-lg overflow-hidden">
                        <video
                            width="100%"
                            height="auto"
                            controls
                            controlsList="nodownload"
                            className="w-full"
                        >
                            <source src={selectedVideoUrl || ''} type="video/mp4" />
                            Votre navigateur ne supporte pas la balise vidéo.
                        </video>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() => setIsVideoModalOpen(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </Modal2>
        </div>
    );
};

export default Reels;
// src/pages/courses/Exercises.tsx
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, DocumentTextIcon, XMarkIcon, PlayIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import SearchBar from '../../components/SearchBar';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Pagination from '../../components/Pagination';
import Modal2 from '../../components/Modal2';
import RichTextEditor from '../../components/RichTextEditor';
import MarkdownViewer from '../../components/MarkdownViewer';
import { useGetAdminExercisesQuery, useDeleteExerciseMutation, useToggleActiveExerciseMutation, useGetAdminLevelsQuery } from '../../services/api';
import { exerciseService } from '../../services/exercises';
import { buildFileUrl } from '../../utils/urlUtils';

const EXERCISE_TYPES = [
    { value: 'PHYSICAL', label: 'Physique' },
    { value: 'MENTAL', label: 'Mental' },
    { value: 'BREATHING', label: 'Respiration' },
    { value: 'MEDITATION', label: 'Méditation' },
    { value: 'YOGA', label: 'Yoga' },
    { value: 'OTHER', label: 'Autre' }
];

interface ExerciseFormData {
    title: string;
    type: string;
    duration: number;
    description: string;
    levelId: number;
    mediaFile?: File;
    mediaType?: 'PDF' | 'VIDEO';
    coverFile?: File;
}

const Exercises: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
    const [formData, setFormData] = useState<ExerciseFormData>({
        title: '',
        type: '',
        duration: 0,
        description: '',
        levelId: 0,
        mediaType: 'PDF',
    });
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [mediaInModal, setMediaInModal] = useState<any | null>(null);
    const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [descriptionInModal, setDescriptionInModal] = useState<string>('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: exercisesData, isLoading, refetch } = useGetAdminExercisesQuery({
        page,
        limit: 5,
        search: debouncedSearch,
        type: typeFilter,
    });

    const { data: levelsData } = useGetAdminLevelsQuery({
        page: 1,
        limit: 100,
        search: '',
    });

    const [deleteExercise, { isLoading: isDeleting }] = useDeleteExerciseMutation();
    const [toggleActive, { isLoading: isToggling }] = useToggleActiveExerciseMutation();

    // Get levels for form
    const levels = levelsData?.payload?.data || [];

    const exercises = exercisesData?.payload?.data || [];
    const totalPages = exercisesData?.payload?.pagination?.totalPages || 1;

    const stats = {
        total: exercisesData?.payload?.pagination?.total || exercises?.length,
        active: exercises?.filter((e: any) => e.isActive).length,
        inactive: exercises?.filter((e: any) => !e.isActive).length,
    };

    const handleCreate = () => {
        setSelectedExercise(null);
        setFormData({
            title: '',
            type: '',
            duration: 0,
            description: '',
            levelId: 0,
            mediaType: 'PDF',
        });
        setIsFormModalOpen(true);
    };

    const handleEdit = (exercise: any) => {
        setSelectedExercise(exercise);
        setFormData({
            title: exercise.title,
            type: exercise.type,
            duration: exercise.duration,
            description: exercise.description,
            levelId: exercise.level?.id,
        });
        setIsFormModalOpen(true);
    };

    const handleDelete = async (exerciseId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) {
            return;
        }
        try {
            await deleteExercise(exerciseId).unwrap();
            toast.success('Exercice supprimé');
            setDeleteConfirmId(null);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const handleToggleActive = async (exercise: any) => {
        try {
            await toggleActive(exercise.id).unwrap();
            toast.success(exercise.isActive ? 'Exercice désactivé' : 'Exercice activé');
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Erreur');
        }
    };

    const handleViewMedia = (exercise: any) => {
        if (!exercise.mediaUrl) {
            toast.error('Aucun fichier disponible');
            return;
        }

        const fullUrl = buildFileUrl(exercise.mediaUrl);

        if (exercise.mediaType === 'PDF') {
            window.open(fullUrl, '_blank');
        } else {
            setMediaInModal({
                ...exercise,
                mediaUrl: fullUrl
            });
            setMediaModalOpen(true);
        }
    };

    const handleViewDescription = (exercise: any) => {
        if (exercise.description) {
            setDescriptionInModal(exercise.description);
            setDescriptionModalOpen(true);
        } else {
            toast.error('Aucune description disponible');
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.type || !formData.duration || !formData.levelId) {
            toast.error('Veuillez remplir tous les champs requis');
            return;
        }

        if (!selectedExercise && !formData.mediaFile) {
            toast.error('Veuillez ajouter un fichier (PDF ou VIDEO)');
            return;
        }

        try {
            setIsUploading(true);

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('duration', formData.duration.toString());
            formDataToSend.append('description', formData.description);
            formDataToSend.append('levelId', formData.levelId.toString());

            if (formData.mediaFile) {
                formDataToSend.append('media', formData.mediaFile);
            }
            if (formData.coverFile) {
                formDataToSend.append('cover', formData.coverFile);
            }

            if (selectedExercise) {
                await exerciseService.updateExercise(selectedExercise.id, formDataToSend, setUploadProgress);
                toast.success('Exercice modifié');
            } else {
                await exerciseService.createExercise(formDataToSend, setUploadProgress);
                toast.success('Exercice créé');
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
        <div className="min-w-8xl mx-2 px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Exercices</h1>
                    <p className="text-gray-600 mt-1">Gérez tous vos exercices</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nouvel exercice
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
                            <span className="text-2xl">🏋️</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Rechercher un exercice..."
                    />
                    <select
                        value={typeFilter}
                        onChange={(e) => {
                            setTypeFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tous les types</option>
                        {EXERCISE_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <LoadingSkeleton />
            ) : exercises.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🏋️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun exercice</h3>
                    <p className="text-gray-600 mb-6">Commencez par créer votre premier exercice</p>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Créer un exercice
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Durée</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Niveau</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exercises.map((exercise: any) => (
                                    <tr key={exercise.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{exercise.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {EXERCISE_TYPES.find(t => t.value === exercise.type)?.label || exercise.type}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{exercise.duration} min</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{exercise.level?.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                exercise.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {exercise.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewMedia(exercise)}
                                                    className="p-2 hover:bg-gray-100 rounded transition"
                                                    title={exercise.mediaType === 'VIDEO' ? 'Lire la vidéo' : 'Consulter le PDF'}
                                                >
                                                    {exercise.mediaType === 'VIDEO' ? (
                                                        <PlayIcon className="w-5 h-5 text-blue-600" />
                                                    ) : (
                                                        <DocumentTextIcon className="w-5 h-5 text-purple-600" />
                                                    )}
                                                </button>
                                                {exercise.description && (
                                                    <button
                                                        onClick={() => handleViewDescription(exercise)}
                                                        className="p-2 hover:bg-gray-100 rounded transition"
                                                        title="Voir la description"
                                                    >
                                                        <InformationCircleIcon className="w-5 h-5 text-green-600" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleToggleActive(exercise)}
                                                    disabled={isToggling}
                                                    className="p-2 hover:bg-gray-100 rounded transition"
                                                    title={exercise.isActive ? 'Désactiver' : 'Activer'}
                                                >
                                                    {exercise.isActive ? (
                                                        <EyeIcon className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <EyeIcon className="w-5 h-5 text-gray-400 opacity-50" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(exercise)}
                                                    className="p-2 hover:bg-gray-100 rounded transition"
                                                >
                                                    <PencilIcon className="w-5 h-5 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(exercise.id)}
                                                    disabled={isDeleting}
                                                    className="p-2 hover:bg-gray-100 rounded transition"
                                                >
                                                    <TrashIcon className="w-5 h-5 text-red-600" />
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

            {/* Description Modal */}
            <Modal2 isOpen={descriptionModalOpen} onClose={() => setDescriptionModalOpen(false)}>
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">📝 Description</h2>
                        <button
                            onClick={() => setDescriptionModalOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded transition"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                    <MarkdownViewer content={descriptionInModal} />
                </div>
            </Modal2>

            {/* Media Player Modal */}
            <Modal2 isOpen={mediaModalOpen} onClose={() => setMediaModalOpen(false)}>
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            {mediaInModal?.mediaType === 'VIDEO' ? '🎬 Vidéo' : '📄 PDF'}
                        </h2>
                        <button
                            onClick={() => setMediaModalOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded transition"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {mediaInModal?.mediaType === 'VIDEO' ? (
                        <div className="bg-black rounded-lg overflow-hidden">
                            <video
                                controls
                                className="w-full"
                                style={{ maxHeight: '500px' }}
                            >
                                <source src={mediaInModal?.mediaUrl} type="video/mp4" />
                                Votre navigateur ne supporte pas la lecture vidéo.
                            </video>
                        </div>
                    ) : (
                        <div className="border rounded-lg overflow-hidden">
                            <iframe
                                src={mediaInModal?.mediaUrl}
                                className="w-full"
                                style={{ height: '600px' }}
                                title="PDF Viewer"
                            />
                        </div>
                    )}

                    <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                        <span>{mediaInModal?.title}</span>
                        {mediaInModal?.mediaType === 'VIDEO' && mediaInModal?.duration && (
                            <span>Durée: {mediaInModal.duration} min</span>
                        )}
                    </div>
                </div>
            </Modal2>

            {/* Form Modal */}
            <Modal2 isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)}>
                <div className="bg-white rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        {selectedExercise ? 'Modifier l\'exercice' : 'Créer un nouvel exercice'}
                    </h2>
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        {/* Titre */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Titre *</label>
                            <input
                                type="text"
                                placeholder="Entrez le titre de l'exercice"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Type et Durée - Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="">Sélectionner</option>
                                    {EXERCISE_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Durée */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Durée (min) *</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Ex: 30"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Niveau */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau *</label>
                            <select
                                value={formData.levelId}
                                onChange={(e) => setFormData({ ...formData, levelId: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none cursor-pointer"
                                required
                            >
                                <option value="0">Sélectionner un niveau</option>
                                {levels.map((level: any) => (
                                    <option key={level.id} value={level.id}>{level.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description - Rich Text Editor */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <RichTextEditor
                                value={formData.description}
                                onChange={(value) => setFormData({ ...formData, description: value })}
                                placeholder="Décrivez cet exercice en détail..."
                            />
                        </div>

                        {/* Media Type Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Type de contenu *</label>
                            <div className="flex gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="mediaType"
                                        value="PDF"
                                        checked={formData.mediaType === 'PDF'}
                                        onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as 'PDF' | 'VIDEO' })}
                                        className="mr-2 w-4 h-4"
                                    />
                                    <span className="text-gray-700">📄 PDF</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="mediaType"
                                        value="VIDEO"
                                        checked={formData.mediaType === 'VIDEO'}
                                        onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as 'PDF' | 'VIDEO' })}
                                        className="mr-2 w-4 h-4"
                                    />
                                    <span className="text-gray-700">🎬 VIDÉO</span>
                                </label>
                            </div>
                        </div>

                        {/* Media File Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fichier {formData.mediaType} {!selectedExercise && <span className="text-red-500">*</span>}
                            </label>
                            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="text-center">
                                    <div className="text-2xl mb-2">{formData.mediaType === 'PDF' ? '📄' : '🎬'}</div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {formData.mediaFile ? formData.mediaFile.name : `Cliquez ou glissez le ${formData.mediaType}`}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.mediaType === 'PDF' ? 'PDF jusqu\'à 10MB' : 'VIDEO (MP4, MOV, WEBM) jusqu\'à 100MB'}
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept={formData.mediaType === 'PDF' ? '.pdf' : 'video/*'}
                                    onChange={(e) => setFormData({ ...formData, mediaFile: e.target.files?.[0] })}
                                    className="hidden"
                                    required={!selectedExercise}
                                />
                            </label>
                            {selectedExercise && !formData.mediaFile && (
                                <p className="text-xs text-gray-500 mt-2">Fichier actuel: {selectedExercise.mediaUrl}</p>
                            )}
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Image de couverture</label>
                            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="text-center">
                                    <div className="text-2xl mb-2">🖼️</div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {formData.coverFile ? formData.coverFile.name : 'Cliquez ou glissez l\'image'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, WEBP jusqu'à 5MB</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, coverFile: e.target.files?.[0] })}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Upload Progress */}
                        {isUploading && (
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-blue-900">Envoi en cours...</p>
                                    <span className="text-sm font-semibold text-blue-600">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => setIsFormModalOpen(false)}
                                disabled={isUploading}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        {uploadProgress}%
                                    </>
                                ) : (
                                    selectedExercise ? '✏️ Modifier' : '➕ Créer'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal2>
        </div>
    );
};

export default Exercises;
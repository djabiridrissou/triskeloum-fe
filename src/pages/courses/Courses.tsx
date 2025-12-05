// src/pages/admin/Courses.tsx
import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Pagination from '../../components/Pagination';
import { Course } from '../../utils/typeDef';
import AdminCourseCard from '../../components/AdminCourseCard';
import { useGetAllCoursesQuery, useDeleteCourseMutation, useTogglePublishCourseMutation, useGetCourseDetailsQuery, useCreateCourseMutation, useCreateSectionMutation, useUpdateCourseMutation, useGetAllLevelsQuery } from '../../services/api';
import { courseService } from '../../services/courses';
import Modal2 from '../../components/Modal2';
import CourseDetails from './CourseDetails';
import CourseFormModal from '../../components/CourseFormModal';

const Courses: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [levelFilter, setLevelFilter] = useState<string>('');
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedCourseForEdit, setSelectedCourseForEdit] = useState<Course | undefined>(undefined);
    const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
    const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
    const [createSection, { isLoading: isCreatingSection }] = useCreateSectionMutation();

    const navigate = useNavigate();

    const { data: levelsData } = useGetAllLevelsQuery();
    const levels = Array.isArray(levelsData?.payload?.data) ? levelsData.payload.data : [];

    const { data: courseDetails, isLoading: isLoadingDetails } = useGetCourseDetailsQuery(
        selectedCourseId || -1,
        { skip: !selectedCourseId }
    );

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: coursesData, isLoading, refetch } = useGetAllCoursesQuery({
        page,
        limit: 6,
        search: debouncedSearch,
        status: statusFilter,
        level: levelFilter,
    });

    const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
    const [togglePublish, { isLoading: isToggling }] = useTogglePublishCourseMutation();

    const handleCreate = () => {
        setSelectedCourseForEdit(undefined);
        setIsFormModalOpen(true);
    };

    const handleEdit = (course: Course) => {
        setSelectedCourseForEdit(course);
        setIsFormModalOpen(true);
    };

    const handleDelete = async (course: Course) => {
        if (!window.confirm(`Voulez-vous vraiment supprimer "${course.title}" ?`)) {
            return;
        }

        try {
            await deleteCourse(course.id).unwrap();
            toast.success('Cours supprimé avec succès');
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const handleCardClick = (courseId: number) => {
        setSelectedCourseId(courseId);
        setIsDetailModalOpen(true);
    };

    const handleViewDetails = (courseId: number) => {
        // Navigation vers la page de détails séparée
        navigate(`/admin/courses/${courseId}`);
    };

    const handleTogglePublish = async (course: Course) => {
        try {
            await togglePublish(course.id).unwrap();
            toast.success(
                course.published ? 'Cours dépublié avec succès' : 'Cours publié avec succès'
            );
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Erreur lors du changement de statut');
        }
    };

    const handleCloseModal = () => {
        setIsDetailModalOpen(false);
        setSelectedCourseId(null);
    };

    // Gestion des actions dans le modal de détails
    const handleDetailEdit = (course: Course) => {
        handleEdit(course);
        handleCloseModal();
    };

    const handleDetailDelete = async (course: Course) => {
        await handleDelete(course);
        handleCloseModal();
    };

    const handleDetailTogglePublish = async (course: Course) => {
        await handleTogglePublish(course);
        // Ne pas fermer le modal pour permettre à l'utilisateur de voir le changement
    };

    const handleFormSubmit = async (formData: FormData) => {
        try {
            if (selectedCourseForEdit) {
                // Mise à jour du cours existant
                await courseService.updateCourse(selectedCourseForEdit.id, formData);
                toast.success('Cours mis à jour avec succès');
            } else {
                // Créer un nouveau cours
                const result = await courseService.createCourse(formData);

                // Créer les sections s'il y en a
                const sectionsData = formData.get('sections');
                if (sectionsData) {
                    const sections = JSON.parse(sectionsData as string);

                    // Créer chaque section
                    for (const section of sections) {
                        await courseService.createSection(result.payload.id, {
                            title: section.title,
                            order: section.order,
                            content: section.content
                        });
                    }
                }

                toast.success('Cours créé avec succès');
            }

            setIsFormModalOpen(false);
            refetch();
        } catch (error: any) {
            console.error('Erreur lors de la soumission du formulaire:', error);
            toast.error(error?.response?.data?.message || error?.message || 'Une erreur est survenue');
        }
    };
    const courses = coursesData?.payload?.courses || [];
    const totalPages = coursesData?.payload?.pagination?.totalPages || 1;
    const stats = {
        total: coursesData?.payload?.pagination?.total || courses?.length,
        published: courses?.filter((c: any) => c.published).length,
        draft: courses?.filter((c: any) => !c.published).length,
    };

    return (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 overflow-auto">
            <div className="max-w-8xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cours</h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">Gérez tous vos cours</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nouveau cours
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📚</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Publiés</p>
                                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
                                    {stats.published}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Brouillons</p>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-600 mt-2">
                                    {stats.draft}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📝</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Rechercher un cours..."
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="published">Publiés</option>
                            <option value="draft">Brouillons</option>
                        </select>

                        <select
                            value={levelFilter}
                            onChange={(e) => {
                                setLevelFilter(e.target.value);
                                setPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="">Tous les niveaux</option>
                            {levels.map((level: any) => (
                                <option key={level.id} value={level.id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <LoadingSkeleton />
                ) : courses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📚</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {debouncedSearch ? 'Aucun cours trouvé' : 'Aucun cours'}
                        </h3>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base">
                            {debouncedSearch
                                ? 'Essayez de modifier vos filtres de recherche'
                                : 'Commencez par créer votre premier cours'}
                        </p>
                        {!debouncedSearch && (
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Créer un cours
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {courses.map((course: any) => (
                                <div
                                    key={course.id}
                                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                                    onClick={() => handleCardClick(course.id)}
                                >
                                    <AdminCourseCard
                                        course={course}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onTogglePublish={handleTogglePublish}
                                        onViewDetails={() => handleViewDetails(course.id)}
                                    />
                                </div>
                            ))}
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

                {/* Modal de détails */}
                <Modal2
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseModal}
                    size="xl"
                >
                    {courseDetails?.payload && (
                        <CourseDetails
                            course={courseDetails.payload}
                            isLoading={isLoadingDetails}
                            onEdit={handleDetailEdit}
                            onDelete={handleDetailDelete}
                            onTogglePublish={handleDetailTogglePublish}
                        />
                    )}
                </Modal2>

                <CourseFormModal
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    initialData={selectedCourseForEdit}
                    onSubmit={handleFormSubmit}
                    isSubmitting={isCreating || isUpdating || isCreatingSection}
                    title={selectedCourseForEdit ? 'Modifier le cours' : 'Créer un nouveau cours'}
                />
            </div>
        </div>
    );
};

export default Courses;
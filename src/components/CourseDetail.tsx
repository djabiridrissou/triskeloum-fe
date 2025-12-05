// src/pages/admin/CourseDetail.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import CourseDetails from '../pages/courses/CourseDetails';
import { useGetCourseDetailsQuery, useDeleteCourseMutation, useTogglePublishCourseMutation } from '../services/api';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const courseId = parseInt(id || '-1');

  const { data, isLoading, error } = useGetCourseDetailsQuery(courseId);
  const [deleteCourse] = useDeleteCourseMutation();
  const [togglePublish] = useTogglePublishCourseMutation();

  const handleEdit = (course: any) => {
    toast('Fonctionnalité d\'édition en cours de développement', { icon: '🚧' });
  };

  const handleDelete = async (course: any) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer "${course.title}" ?`)) {
      return;
    }

    try {
      await deleteCourse(course.id).unwrap();
      toast.success('Cours supprimé avec succès');
      navigate('/admin/courses');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleTogglePublish = async (course: any) => {
    try {
      await togglePublish(course.id).unwrap();
      toast.success(
        course.published ? 'Cours dépublié avec succès' : 'Cours publié avec succès'
      );
    } catch (error: any) {
      toast.error(error?.data?.message || 'Erreur lors du changement de statut');
    }
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cours non trouvé
          </h2>
          <button
            onClick={() => navigate('/admin/courses/list')}
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Retour aux cours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center px-4 py-2 mb-6 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Retour
      </button>

      <CourseDetails
        course={data?.payload}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
      />
    </div>
  );
};

export default CourseDetail;
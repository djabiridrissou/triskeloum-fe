// src/components/course/CourseActions.tsx
import React from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  EyeSlashIcon,
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';
import { Course } from '../utils/typeDef';

interface CourseActionsProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onTogglePublish?: (course: Course) => void;
  onDuplicate?: (course: Course) => void;
}

const CourseActions: React.FC<CourseActionsProps> = ({
  course,
  onEdit,
  onDelete,
  onTogglePublish,
  onDuplicate
}) => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Statut de publication */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className={`w-2 h-2 rounded-full ${
              course.published ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span>
              {course.published ? 'Publié' : 'Brouillon'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Dupliquer */}
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(course)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
              Dupliquer
            </button>
          )}

          {/* Publier/Dépublier */}
          {onTogglePublish && (
            <button
              onClick={() => onTogglePublish(course)}
              className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                course.published
                  ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                  : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
              }`}
            >
              {course.published ? (
                <>
                  <EyeSlashIcon className="w-4 h-4 mr-2" />
                  Dépublier
                </>
              ) : (
                <>
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Publier
                </>
              )}
            </button>
          )}

          {/* Éditer */}
          {onEdit && (
            <button
              onClick={() => onEdit(course)}
              className="inline-flex items-center px-3 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Éditer
            </button>
          )}

          {/* Supprimer */}
          {onDelete && (
            <button
              onClick={() => onDelete(course)}
              className="inline-flex items-center px-3 py-2 border border-red-300 text-red-700 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseActions;
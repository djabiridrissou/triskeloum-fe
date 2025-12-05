// src/components/admin/courses/AdminCourseCard.tsx
import React from 'react';
import {
    PencilIcon,
    TrashIcon,
    AcademicCapIcon,
    ClockIcon,
    EyeIcon,
    EyeSlashIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';
import { Course } from '../utils/typeDef';
import { getImageUrl } from '../utils/imageUtils';

interface AdminCourseCardProps {
    course: Course;
    onEdit: (course: Course) => void;
    onDelete: (course: Course) => void;
    onTogglePublish: (course: Course) => void;
    onViewDetails?: (courseId: number) => void;
}

const AdminCourseCard: React.FC<AdminCourseCardProps> = ({
    course,
    onEdit,
    onDelete,
    onTogglePublish,
    onViewDetails
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
            {/* Image - Plus compact */}
            <div className="relative h-32 bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden">
                {course.cover ? (
                    <img
                        src={getImageUrl(course.cover)}
                        alt={course.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                        <AcademicCapIcon className="w-12 h-12 text-white opacity-40" />
                    </div>
                )}

                {/* Status Badge - compact */}
                <div className="absolute top-2 left-2 z-20">
                    {course.published ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-600 text-white rounded text-xs font-medium">
                            <EyeIcon className="w-3 h-3" />
                            Publié
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-gray-500 text-white rounded text-xs font-medium">
                            <EyeSlashIcon className="w-3 h-3" />
                            Brouillon
                        </span>
                    )}
                </div>

                {/* Level Badge */}
                <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-0.5 rounded text-xs font-medium text-gray-700">
                    {course.levels?.[0]?.name || 'N/A'}
                </div>
            </div>

            {/* Content - Compact */}
            <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                    {course.title}
                </h3>

                <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                    {course.legend || '—'}
                </p>

                {/* Meta Info - Une seule ligne */}
                <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-0.5">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {course.est_time_min}m
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                        <BookOpenIcon className="w-3.5 h-3.5" />
                        {course.sections?.length || 0}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 truncate">{course.category.title}</span>
                </div>

                {/* Actions - Compact */}
                <div className="flex gap-1.5">
                    <button
                        onClick={() => onTogglePublish(course)}
                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                            course.published
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                        title={course.published ? 'Dépublier' : 'Publier'}
                    >
                        {course.published ? (
                            <EyeSlashIcon className="w-3.5 h-3.5" />
                        ) : (
                            <EyeIcon className="w-3.5 h-3.5" />
                        )}
                    </button>
                    <button
                        onClick={() => onEdit(course)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                        title="Éditer"
                    >
                        <PencilIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => onDelete(course)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                        title="Supprimer"
                    >
                        <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCourseCard;
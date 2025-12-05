// src/components/admin/TopCoursesTable.tsx
import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { TopCourse } from '../utils/typeDef';

interface TopCoursesTableProps {
    courses: TopCourse[];
}

const TopCoursesTable: React.FC<TopCoursesTableProps> = ({ courses }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Cours les plus populaires</h3>
            </div>
            <div className="divide-y divide-gray-200">
                {courses.map((course, index) => (
                    <div key={course.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-lg font-bold text-blue-600">
                                            #{index + 1}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {course.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {course.enrollments} inscription{course.enrollments > 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <StarIcon className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm font-semibold text-gray-900">
                                    {course.rating}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopCoursesTable;
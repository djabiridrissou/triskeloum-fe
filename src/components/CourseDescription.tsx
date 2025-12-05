// src/components/course/CourseDescription.tsx
import React from 'react';

interface CourseDescriptionProps {
  legend: string;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ legend }) => {
  if (!legend) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
      <span className="text-sm font-semibold text-gray-900 mb-4">
        À propos de ce cours
      </span>
      <p className="text-gray-700 text-xs leading-relaxed">
        {legend}
      </p>
    </div>
  );
};

export default CourseDescription;
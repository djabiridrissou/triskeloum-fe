// src/components/course/CourseDetailsSkeleton.tsx
import React from 'react';

const CourseDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Header skeleton */}
      <div className="h-64 bg-gray-300 relative" />
      
      {/* Actions skeleton */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-24" />
          <div className="flex space-x-3">
            <div className="h-8 bg-gray-300 rounded w-24" />
            <div className="h-8 bg-gray-300 rounded w-24" />
            <div className="h-8 bg-gray-300 rounded w-24" />
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-6 bg-gray-300 rounded w-6 mx-auto mb-2" />
              <div className="h-4 bg-gray-300 rounded w-16 mx-auto mb-1" />
              <div className="h-3 bg-gray-300 rounded w-12 mx-auto" />
            </div>
          ))}
        </div>

        {/* Description skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-32" />
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-4/5" />
        </div>

        {/* Sections skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded w-48" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32" />
                    <div className="h-3 bg-gray-300 rounded w-24" />
                  </div>
                </div>
                <div className="w-5 h-5 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsSkeleton;
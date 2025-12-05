// src/components/CourseFormModal.tsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CourseForm from './CourseForm';
import { Course } from '../utils/typeDef';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Course;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
  title: string;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isSubmitting,
  title
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay with blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full transform transition-all animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <CourseForm
              initialData={initialData}
              onSubmit={onSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFormModal;
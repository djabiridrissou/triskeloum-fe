// src/components/course/CourseDetails.tsx
import React from 'react';
import { Course } from '../../utils/typeDef';
import CourseActions from '../../components/CourseActions';
import CourseDescription from '../../components/CourseDescription';
import CourseDetailsSkeleton from '../../components/CourseDetailsSkeleton';
import CourseHeader from '../../components/CourseHeader';
import CourseSections from '../../components/CourseSections';
import CourseStats from '../../components/CourseStats';


interface CourseDetailsProps {
  course: Course;
  isLoading?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onTogglePublish?: (course: Course) => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({
  course,
  isLoading = false,
  onEdit,
  onDelete,
  onTogglePublish
}) => {
  if (isLoading) {
    return <CourseDetailsSkeleton />;
  }

  console.log(course);

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-bg-tertiary rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Header avec image de couverture et infos principales */}
      <CourseHeader course={course} />

      {/* Actions rapides */}
      <CourseActions
        course={course}
        onEdit={onEdit}
        onDelete={onDelete}
        onTogglePublish={onTogglePublish}
      />

      <div className="p-8 space-y-8">
        {/* Statistiques et métriques */}
        <CourseStats course={course} />

        {/* Description et légende */}
        <CourseDescription legend={course.legend} />

        <CourseSections sections={course.sections || []} />
      </div>
    </div>
  );
};

export default CourseDetails;
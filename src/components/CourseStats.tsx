// src/components/course/CourseStats.tsx
import React from 'react';
import { Course } from '../utils/typeDef';


interface CourseStatsProps {
  course: Course;
}

const CourseStats: React.FC<CourseStatsProps> = ({ course }) => {
  const totalParts = course.sections?.reduce(
    (total, section) => total + (section.content?.parts?.length || 0), 
    0
  ) || 0;

  const stats = [
    {
      label: 'Sections',
      value: course.sections?.length || 0,
      icon: '📑',
      color: 'blue'
    },
    {
      label: 'Parties',
      value: totalParts,
      icon: '📝',
      color: 'green'
    },
    {
      label: 'Durée estimée',
      value: `${course.est_time_min} min`,
      icon: '⏱️',
      color: 'purple'
    },
    {
      label: 'Niveau',
      value: course.levels?.[0]?.name || 'Non défini',
      icon: '🎯',
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`border rounded-lg p-1 text-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}
        >
          <div className="text-xl mb-2">{stat.icon}</div>
          <div className="text-xl font-bold mb-1">{stat.value}</div>
          <div className="text-xs font-medium opacity-75">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default CourseStats;
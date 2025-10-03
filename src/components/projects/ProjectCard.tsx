
// components/projects/ProjectCard.tsx
import React from 'react';

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string;
  stats: {
    totalDocuments: number;
    totalChunks: number;
    lastActivity?: string;
  };
  createdAt: string;
  onDoubleClick: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  stats,
  createdAt,
  onDoubleClick
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  return (
    <div
      onDoubleClick={() => onDoubleClick(id)}
      className="group bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <span className="text-2xl">📁</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            {description && (
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Documents</p>
          <p className="text-xl font-semibold text-gray-900">
            {stats.totalDocuments}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Chunks</p>
          <p className="text-xl font-semibold text-gray-900">
            {stats.totalChunks.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
        <span>Created {formatDate(createdAt)}</span>
        {stats.lastActivity && (
          <span>Active {getTimeAgo(stats.lastActivity)}</span>
        )}
      </div>

      {/* Hint */}
      <div className="mt-3 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Double-click to open chat
      </div>
    </div>
  );
};
interface ProjectCardProps {
    id: string;
    name: string;
    description?: string;
    stats: {
      totalDocuments: number;
      indexed: number;
      failed: number;
      totalChunks: number;
    };
    onNavigate: (id: string) => void;
  }
  
  export const ProjectCard: React.FC<ProjectCardProps> = ({
    id,
    name,
    description,
    stats,
    onNavigate
  }) => {
    const percentage = stats.totalDocuments > 0 
      ? Math.round((stats.indexed / stats.totalDocuments) * 100) 
      : 0;
  
    return (
      <div 
        onClick={() => onNavigate(id)}
        className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
            {description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
            )}
          </div>
        </div>
  
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{stats.totalDocuments} documents</span>
            <span className="text-gray-400">{stats.totalChunks} chunks</span>
          </div>
  
          <div className="flex gap-2">
            {stats.indexed > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {stats.indexed} indexed
              </span>
            )}
            {stats.failed > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {stats.failed} failed
              </span>
            )}
          </div>
  
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  };
interface ActivityItemProps {
    type: 'document_indexed' | 'document_failed' | 'voice_search' | 'text_search';
    message: string;
    projectName?: string;
    timestamp: string;
    error?: string;
  }
  
  export const ActivityItem: React.FC<ActivityItemProps> = ({
    type,
    message,
    projectName,
    timestamp,
    error
  }) => {
    const getIcon = () => {
      switch (type) {
        case 'document_indexed':
          return <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">✓</div>;
        case 'document_failed':
          return <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">✕</div>;
        case 'voice_search':
          return <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">🎤</div>;
        case 'text_search':
          return <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">🔍</div>;
      }
    };
  
    const formatTime = (timestamp: string) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
  
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    };
  
    return (
      <div className="flex items-start gap-4 pb-4 last:pb-0">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{message}</p>
          {projectName && (
            <p className="text-sm text-gray-500 mt-1">Project: {projectName}</p>
          )}
          {error && (
            <p className="text-xs text-red-600 mt-1 truncate">Error: {error}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">{formatTime(timestamp)}</p>
        </div>
      </div>
    );
  };
  
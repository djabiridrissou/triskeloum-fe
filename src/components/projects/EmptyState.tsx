interface EmptyStateProps {
    onCreateProject: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateProject }) => {
    return (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📁</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No projects yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                Create your first project to start organizing and searching your documents
            </p>
            <button
                onClick={onCreateProject}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
                Create Project
            </button>
        </div>
    );
};
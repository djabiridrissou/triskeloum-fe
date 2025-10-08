import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProjectDetailsQuery } from '../../services/api';
import ProjectFiles from './ProjectFiles';
import ProjectChat from './ProjectChat';

const ProjectDetails = () => {
const projectId = useParams().projectId;
console.log("project id ", projectId)
    const { data: response, isLoading, isError } = useGetProjectDetailsQuery({projectId}!);
    const [activeTab, setActiveTab] = useState('files');
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-950">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-400 font-light">Loading project...</span>
                </div>
            </div>
        );
    }
    
    if (isError || !response?.success) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-950">
                <div className="text-center">
                    <div className="text-red-400 text-sm mb-2">⚠ Error loading project</div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }
    
    const project = response.data;
    
    return (
        <div className="min-h-screen text-gray-100">
            {/* Header */}
            <div className="border-b border-gray-800/50 bg-white backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-2">
                    {/* Project Title & Status */}
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <h1 className="text-xl font-semibold text-black tracking-tight mb-1">
                                {project.name}
                            </h1>
                            {project.description && (
                                <p className="text-xs text-black font-light max-w-2xl">
                                    {project.description}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                                project.status === 'active' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                            }`}>
                                {project.status}
                            </span>
                        </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-2">
                        <div className="bg-gray-800/20 rounded-lg px-3 py-2 border border-gray-800/50">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-medium">
                                Documents
                            </div>
                            <div className="text-lg font-semibold text-black">
                                {project.stats.totalDocuments}
                            </div>
                        </div>
                        
                        <div className="bg-gray-800/20 rounded-lg px-3 py-2 border border-gray-800/50">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-medium">
                                Chunks Indexed
                            </div>
                            <div className="text-lg font-semibold text-black">
                                {project.stats.totalChunks.toLocaleString()}
                            </div>
                        </div>
                        
                        <div className="bg-gray-800/20 rounded-lg px-3 py-2 border border-gray-800/50">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-medium">
                                Last Activity
                            </div>
                            <div className="text-xs font-medium text-black">
                                {new Date(project.stats.lastActivity).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                        
                        <div className="bg-gray-800/20 rounded-lg px-3 py-2 border border-gray-800/50">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-medium">
                                File Types
                            </div>
                            <div className="text-[10px] font-medium text-black mt-1.5">
                                {project.settings.allowedFileTypes.join(', ')}
                            </div>
                        </div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex gap-1 border-b border-gray-800/30">
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`px-4 py-2 text-xs font-medium tracking-wide transition-all relative ${
                                activeTab === 'files'
                                    ? 'text-blue-400'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            FILES
                            {activeTab === 'files' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                            )}
                        </button>
                        
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`px-4 py-2 text-xs font-medium tracking-wide transition-all relative ${
                                activeTab === 'chat'
                                    ? 'text-blue-400'
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            CHAT
                            {activeTab === 'chat' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {activeTab === 'files' && (
                  <ProjectFiles />
                )}
                {activeTab === 'chat' && (
                    <ProjectChat />
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDashboardDataQuery } from '../services/api';
import { StatCard } from '../components/dashboard/StatCard';
import { ActivityItem } from '../components/dashboard/ActivityItem';
import { ProjectCard } from '../components/dashboard/ProjectCard';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDashboardDataQuery({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const { overview, recentProjects, recentActivity, needsAttention, topProjects } = data.data;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Projects"
          value={overview.totalProjects}
          icon={<span className="text-2xl">📁</span>}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          label="Documents"
          value={overview.totalDocuments}
          icon={<span className="text-2xl">📄</span>}
          bgColor="bg-green-50"
          iconColor="text-green-600"
          trend={{
            value: overview.documentsLast7Days,
            isPositive: overview.documentsLast7Days > 0
          }}
        />
        <StatCard
          label="Indexed"
          value={overview.indexedDocuments}
          icon={<span className="text-2xl">✓</span>}
          bgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Failed"
          value={overview.failedDocuments}
          icon={<span className="text-2xl">⚠</span>}
          bgColor="bg-red-50"
          iconColor="text-red-600"
        />
      </div>

      {/* Needs Attention Alert */}
      {needsAttention.failed > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-900">
                {needsAttention.failed} documents need attention
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Some documents failed to process. Review and retry them.
              </p>
              <button 
                onClick={() => navigate('/documents?status=failed')}
                className="mt-3 text-sm font-medium text-amber-900 hover:text-amber-800"
              >
                View failed documents →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/projects/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          + New Project
        </button>
        <button 
          onClick={() => navigate('/upload')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Upload Documents
        </button>
        <button 
          onClick={() => navigate('/search')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Projects Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Active Projects</h2>
            <button 
              onClick={() => navigate('/projects')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </button>
          </div>
          
          {topProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topProjects.map((project: any) => (
                <ProjectCard
                  key={project.projectId}
                  id={project.projectId}
                  name={project.projectName}
                  stats={{
                    totalDocuments: project.totalDocuments,
                    indexed: project.indexed,
                    failed: project.failed,
                    totalChunks: project.totalChunks
                  }}
                  onNavigate={(id) => navigate(`/projects/${id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No projects yet</p>
              <button 
                onClick={() => navigate('/projects/new')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Create your first project
              </button>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.slice(0, 10).map((activity: any, index: any) => (
                  <ActivityItem
                    key={index}
                    type={activity.type}
                    message={activity.message}
                    projectName={activity.projectName}
                    timestamp={activity.timestamp}
                    error={activity.error}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                No recent activity
              </p>
            )}
          </div>
        </div>

      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Chunks Indexed</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {overview.totalChunks.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Avg Processing Time</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {Math.round(overview.avgProcessingTime / 1000)}s
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Success Rate</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {overview.totalDocuments > 0 
              ? Math.round((overview.indexedDocuments / overview.totalDocuments) * 100) 
              : 0}%
          </p>
        </div>
      </div>

    </div>
  );
};

export default Home;
// pages/NewProject.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewProjectMutation } from '../../services/api';

const NewProject: React.FC = () => {
    const navigate = useNavigate();
    const [newProject, { isLoading, isSuccess, isError, error }] = useNewProjectMutation();

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [errors, setErrors] = useState({
        name: ''
    });

    useEffect(() => {
        if (isSuccess) {
            navigate('/projects');
        }
    }, [isSuccess, navigate]);

    const validateForm = (): boolean => {
        const newErrors = { name: '' };
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
            isValid = false;
        } else if (formData.name.length < 3) {
            newErrors.name = 'Project name must be at least 3 characters';
            isValid = false;
        } else if (formData.name.length > 100) {
            newErrors.name = 'Project name must be less than 100 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await newProject({
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                settings: {
                    allowedFileTypes: ['.pdf', '.docx', '.pptx', '.txt', '.md', '.html'],
                    maxFileSize: 52428800, // 50MB
                    autoIndex: true
                }
            }).unwrap();
        } catch (err) {
            console.error('Failed to create project:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors.name && name === 'name') {
            setErrors({ name: '' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">

            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/projects')}
                    className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
                >
                    ← Back to projects
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Organize your documents by creating a dedicated project
                </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Project Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Project Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Recruitment Q4 2024"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            {formData.name.length}/100 characters
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of this project..."
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            disabled={isLoading}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {formData.description.length}/500 characters
                        </p>
                    </div>

                    {/* Settings Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <span className="text-lg">ℹ️</span>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900">Default Settings</p>
                                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                                    <li>• Supported files: PDF, DOCX, PPTX, TXT, MD, HTML</li>
                                    <li>• Max file size: 50MB</li>
                                    <li>• Auto-indexing: Enabled</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {isError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-lg">⚠️</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-900">Failed to create project</p>
                                    <p className="text-sm text-red-700 mt-1">
                                        {(error as any)?.data?.message || 'An error occurred. Please try again.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                'Create Project'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/projects')}
                            disabled={isLoading}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>

            {/* Preview Card */}
            {formData.name && (
                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📁</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {formData.name}
                                </h3>
                                {formData.description && (
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {formData.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Documents</p>
                                <p className="font-semibold text-gray-900">0</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Chunks</p>
                                <p className="font-semibold text-gray-900">0</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default NewProject;
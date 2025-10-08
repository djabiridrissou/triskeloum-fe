import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetDocumentsQuery, useUploadDocumentsMutation } from '../../services/api';
import FileViewerModal from '../../components/FileViewerModal';
import { uploadService } from '../../services/axios';
import Swal from 'sweetalert2';

const ProjectFiles = () => {
    const { projectId } = useParams();
    const { data: response, isLoading, refetch } = useGetDocumentsQuery({ projectId }, { skip: !projectId });
    const [uploadDocuments, { isLoading: isUploading }] = useUploadDocumentsMutation({});

    const [selectedFile, setSelectedFile] = useState(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Icônes par type de fichier - SVG originaux restaurés
    const getFileIcon = (fileType: any) => {
        const icons: any = {
            pdf: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6M9.5 15.5a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 3 0v3a1.5 1.5 0 0 1-1.5 1.5zm5.5-1.5v-2a1 1 0 0 1 2 0v2"/>
                </svg>
            ),
            xlsx: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6M10 12l-2 3 2 3m4-6l2 3-2 3"/>
                </svg>
            ),
            xls: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6M10 12l-2 3 2 3m4-6l2 3-2 3"/>
                </svg>
            ),
            csv: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/>
                </svg>
            ),
            docx: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6M16 13H8m8 4H8"/>
                </svg>
            ),
            png: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
            ),
            jpg: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
            ),
            json: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6M10 14l-1 1 1 1m4-2l1 1-1 1"/>
                </svg>
            ),
            default: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <path d="M14 2v6h6"/>
                </svg>
            )
        };
        return icons[fileType] || icons.default;
    };

    // Couleurs par type
    const getFileColor = (fileType: any) => {
        const colors: any = {
            pdf: 'text-red-400 border-red-500/20',
            xlsx: 'text-green-400 border-green-500/20',
            xls: 'text-green-400 border-green-500/20',
            csv: 'text-yellow-400 border-yellow-500/20',
            docx: 'text-blue-400 border-blue-500/20',
            png: 'text-purple-400 border-purple-500/20',
            jpg: 'text-purple-400 border-purple-500/20',
            json: 'text-cyan-400 border-cyan-500/20',
            default: 'text-gray-400 border-gray-500/20'
        };
        return colors[fileType] || colors.default;
    };

    const formatFileSize = (fileSize: any) => {
        if (typeof fileSize === 'string') {
            const match = fileSize.match(/^([\d.]+)\s*(\w+)$/);
            if (match) return `${parseFloat(match[1]).toFixed(2)} ${match[2]}`;
            return fileSize;
        }
        if (fileSize === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(fileSize) / Math.log(k));
        return `${(fileSize / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    };

    const formatDate = (dateString: any) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-400">Loading documents...</span>
                </div>
            </div>
        );
    }

    const documents = response?.data?.documents || [];

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        if (files.length + selectedFiles.length > 10) {
            Swal.fire('Maximum 10 files allowed');
            return;
        }

        const allowedTypes = ['.pdf', '.docx', '.xlsx', '.xls', '.csv', '.png', '.jpg', '.jpeg', '.json'];
        const invalidFiles = files.filter(file => {
            const ext = '.' + file.name.split('.').pop()?.toLowerCase();
            return !allowedTypes.includes(ext);
        });

        if (invalidFiles.length > 0) {
            Swal.fire(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}`);
            return;
        }

        setSelectedFiles([...selectedFiles, ...files]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        try {
            setUploadProgress(0);
            
            await uploadService.uploadDocuments(
                projectId!,
                selectedFiles,
                (progress: number) => setUploadProgress(progress)
            );
            
            setSelectedFiles([]);
            setShowUploadModal(false);
            setUploadProgress(0);
            refetch();
            
            Swal.fire('Documents uploaded successfully!');
        } catch (error: any) {
            console.error('Upload error:', error);
            Swal.fire('Error uploading documents', error?.response?.data?.error || 'Please try again.', 'error');
            setUploadProgress(0);
        }
    };

    const getFileTypeIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        return getFileIcon(ext || 'default');
    };

    const getFileTypeColor = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        return getFileColor(ext || 'default');
    };

    return (
        <>
            <div className="space-y-4">
                {/* Header avec toggle view */}
                <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                        {documents.length} document{documents.length > 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Upload Button */}
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Documents
                        </button>

                        {/* View Toggle */}
                        <div className="flex gap-1 bg-gray-800/30 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 rounded text-[10px] font-medium transition-all ${
                                    viewMode === 'grid' ? 'bg-gray-700 text-gray-100' : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                GRID
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1.5 rounded text-[10px] font-medium transition-all ${
                                    viewMode === 'list' ? 'bg-gray-700 text-gray-100' : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                LIST
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                {documents.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-gray-500 text-sm mb-2">No documents found</div>
                        <button 
                            onClick={() => setShowUploadModal(true)}
                            className="text-xs text-blue-400 hover:text-blue-300"
                        >
                            Upload your first document
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-10 gap-3">
                        {documents.map((doc: any) => (
                            <button
                                key={doc.id}
                                onClick={() => setSelectedFile(doc)}
                                className={`group relative hover:bg-gray-800/40 ${getFileColor(doc.fileType)} rounded-lg p-4 transition-all hover:scale-105 cursor-pointer`}
                            >
                                {/* Status badge */}
                                {doc.status === 'processing' && (
                                    <div className="absolute top-2 right-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    </div>
                                )}
                                
                                {/* Icon */}
                                <div className="flex justify-center mb-3">
                                    {getFileIcon(doc.fileType)}
                                </div>
                                
                                {/* File name */}
                                <div className="text-[10px] font-medium text-black truncate mb-1" title={doc.fileName}>
                                    {doc.fileName}
                                </div>
                                
                                {/* File size */}
                                <div className="text-[9px] text-gray-500">
                                    {formatFileSize(doc.fileSize)}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1">
                        {documents.map((doc: any) => (
                            <button
                                key={doc.id}
                                onClick={() => setSelectedFile(doc)}
                                className="w-full flex items-center gap-4 bg-gray-800/20 hover:bg-gray-800/40 border border-gray-800/50 hover:border-gray-700/50 rounded-lg p-3 transition-all text-left"
                            >
                                {/* Icon */}
                                <div className={`flex-shrink-0 ${getFileColor(doc.fileType).split(' ')[0]}`}>
                                    {getFileIcon(doc.fileType)}
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-gray-200 truncate">
                                        {doc.fileName}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-0.5">
                                        {formatFileSize(doc.fileSize)} · {formatDate(doc.createdAt)}
                                    </div>
                                </div>
                                
                                {/* Status */}
                                <div className="flex-shrink-0">
                                    {doc.status === 'indexed' ? (
                                        <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                            INDEXED
                                        </span>
                                    ) : (
                                        <span className="text-[9px] text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
                                            PROCESSING
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div 
                    className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => !isUploading && setShowUploadModal(false)}
                >
                    <div 
                        className="bg-gray-300 border border-gray-800 rounded-xl w-full max-w-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                            <div>
                                <h3 className="text-sm font-semibold text-black">Upload Documents</h3>
                                <p className="text-[10px] text-gray-500 mt-1">
                                    Select up to 10 files (PDF, DOCX, XLSX, XLS, CSV, PNG, JPG, JSON)
                                </p>
                            </div>
                            <button
                                onClick={() => !isUploading && setShowUploadModal(false)}
                                disabled={isUploading}
                                className="text-gray-400 hover:text-gray-100 transition-colors disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Drop Zone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-lg p-8 text-center cursor-pointer transition-colors"
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <div>
                                        <div className="text-sm text-gray-300 mb-1">
                                            Click to upload or drag and drop
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Max 10 files, 50MB each
                                        </div>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".pdf,.docx,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.json"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            {/* Selected Files List */}
                            {selectedFiles.length > 0 && (
                                <div className="space-y-2 max-h-64 overflow-auto">
                                    <div className="text-xs text-gray-400 mb-2">
                                        Selected Files ({selectedFiles.length}/10)
                                    </div>
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 bg-gray-800/30 border border-gray-800 rounded-lg p-3"
                                        >
                                            <div className={`flex-shrink-0 ${getFileTypeColor(file.name).split(' ')[0]}`}>
                                                {getFileTypeIcon(file.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-medium text-gray-200 truncate">
                                                    {file.name}
                                                </div>
                                                <div className="text-[10px] text-gray-500">
                                                    {(file.size / 1024).toFixed(2)} KB
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(index)}
                                                disabled={isUploading}
                                                className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-black">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                disabled={isUploading}
                                className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-black cursor-pointer transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={selectedFiles.length === 0 || isUploading}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-black disabled:text-gray-400 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Upload {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de visualisation */}
            {selectedFile && (
                <FileViewerModal
                    file={selectedFile}
                    projectId={projectId}
                    onClose={() => setSelectedFile(null)}
                />
            )}
        </>
    );
};

export default ProjectFiles;
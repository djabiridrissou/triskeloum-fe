import { div } from '@tensorflow/tfjs';
import { useState, useEffect } from 'react';
import { useGetFileDataQuery, useGetFilePreviewQuery } from '../services/api';


const FileViewerModal = ({ file, projectId, onClose }: any) => {
    const { fileType, fileName, id: documentId } = file;

    // Pour CSV/Excel - fetch data
    const shouldFetchData = ['csv', 'xlsx', 'xls'].includes(fileType);
    const { data: fileData, isLoading: isLoadingData } = useGetFileDataQuery(
        { projectId, documentId },
        { skip: !shouldFetchData }
    );

    // Pour JSON/DOCX - fetch preview
    const shouldFetchPreview = ['json', 'docx'].includes(fileType);
    const { data: previewData, isLoading: isLoadingPreview } = useGetFilePreviewQuery(
        { projectId, documentId },
        { skip: !shouldFetchPreview }
    );

    const renderFileContent = () => {
        // Images
        if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileType)) {
            return (
                <div className="flex items-center justify-center h-full bg-gray-900/50">
                    <img
                        src={`/api/rag/projects/${projectId}/documents/${documentId}/preview`}
                        alt={fileName}
                        className="max-w-full max-h-full object-contain"
                        onError={(e: any) => {
                            e.target.src = '';
                            e.target.alt = 'Failed to load image';
                        }}
                    />
                </div>
            );
        }

       // PDF
// PDF - Alternative avec object tag
if (fileType === 'pdf') {
    const pdfUrl = `${import.meta.env.VITE_BASE_URL}/rag/projects/${projectId}/documents/${documentId}/preview`;
    
    return (
        <div className="w-full h-full bg-gray-800">
            <object
                data={pdfUrl}
                type="application/pdf"
                className="w-full h-full"
            >
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                    <p>PDF cannot be displayed in modal</p>
                    
                      <a  href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg"
                    >
                        Open in New Tab
                    </a>
                </div>
            </object>
        </div>
    );
}

        // CSV / Excel preview
        if (['csv', 'xlsx', 'xls'].includes(fileType)) {
            if (isLoadingData) {
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-gray-400">Loading {fileType.toUpperCase()}...</span>
                        </div>
                    </div>
                );
            }

            if (!fileData?.success || !fileData?.data) {
                return (
                    <div className="flex items-center justify-center h-full text-red-400 text-sm">
                        Failed to load spreadsheet data
                    </div>
                );
            }

            const { rows, headers, totalRows } = fileData.data;

            return (
                <div className="h-full flex flex-col">
                    {/* Stats header */}
                    <div className="px-6 py-3 bg-gray-800/30 border-b border-gray-800 flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                            Showing {rows.length} of {totalRows} rows
                        </div>
                        <a
                            href={`/api/rag/projects/${projectId}/documents/${documentId}/download`}
                            download
                            className="text-xs text-blue-400 hover:text-blue-300"
                        >
                            Download Full File
                        </a>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-800/50 sticky top-0">
                                <tr>
                                    {headers.map((header: string, idx: number) => (
                                        <th
                                            key={idx}
                                            className="px-4 py-2 text-left font-medium text-gray-300 border-b border-gray-700"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row: any, rowIdx: number) => (
                                    <tr
                                        key={rowIdx}
                                        className="hover:bg-gray-800/30 border-b border-gray-800/50"
                                    >
                                        {headers.map((header: string, colIdx: number) => (
                                            <td
                                                key={colIdx}
                                                className="px-4 py-2 text-gray-400"
                                            >
                                                {row[header] !== null && row[header] !== undefined
                                                    ? String(row[header])
                                                    : '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        // JSON
        if (fileType === 'json') {
            if (isLoadingPreview) {
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-gray-400">Loading JSON...</span>
                        </div>
                    </div>
                );
            }

            return (
                <div className="h-full overflow-auto p-6">
                    <pre className="text-xs text-gray-300 font-mono bg-gray-950 p-4 rounded border border-gray-800">
                        {JSON.stringify(previewData?.data, null, 2)}
                    </pre>
                </div>
            );
        }

        // DOCX
        if (fileType === 'docx') {
            if (isLoadingPreview) {
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-gray-400">Loading document...</span>
                        </div>
                    </div>
                );
            }

            return (
                <div className="h-full overflow-auto p-6">
                    <div className="prose prose-invert prose-sm max-w-none">
                        <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                            {previewData?.data?.text || 'No content available'}
                        </div>
                    </div>
                </div>
            );
        }

        // Default
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-4">
                <div>Preview not available for .{fileType} files</div>
                <a
                    href={`/api/rag/projects/${projectId}/documents/${documentId}/download`}
                    download
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                >
                    Download File
                </a>
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" // Remis en noir
            onClick={onClose}
        >
            <div
                className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col" // Remis en gray-900
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className={`${fileType === 'pdf' ? 'text-red-400' :
                                ['xlsx', 'xls', 'csv'].includes(fileType) ? 'text-green-400' :
                                    ['png', 'jpg', 'jpeg'].includes(fileType) ? 'text-purple-400' :
                                        'text-gray-400'
                            }`}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-100">{fileName}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">
                                {fileType.toUpperCase()} · {new Date(file.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-100 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {renderFileContent()}
                </div>
            </div>
        </div>
    );
};

export default FileViewerModal;
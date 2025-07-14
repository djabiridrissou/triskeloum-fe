import { useState, useCallback } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

interface FileUploadProps {
    acceptedFiles?: string;
    multiple?: boolean;
    maxFiles?: number;
    onChange: (files: File[]) => void;
    error?: boolean;
}

const FileUpload = ({ acceptedFiles = "*", multiple = false, maxFiles = 1, onChange, error = false }: FileUploadProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).slice(0, maxFiles - files.length);
            const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
            setFiles(updatedFiles);
            onChange(updatedFiles);
        }
    }, [files, maxFiles, multiple, onChange]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).slice(0, maxFiles - files.length);
            const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
            setFiles(updatedFiles);
            onChange(updatedFiles);
        }
    }, [files, maxFiles, multiple, onChange]);

    const removeFile = useCallback((index: number) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
        onChange(updatedFiles);
    }, [files, onChange]);

    return (
        <div className="space-y-2">
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition ${isDragging ? 'border-blue-500 bg-blue-50' : error ? 'border-red-500' : 'border-gray-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center space-y-2">
                    <FiUpload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                        Glissez-déposez vos fichiers ici, ou cliquez pour sélectionner
                    </p>
                    <p className="text-xs text-gray-500">
                        {multiple ? `Jusqu'à ${maxFiles} fichiers` : '1 fichier maximum'}
                    </p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept={acceptedFiles}
                    multiple={multiple}
                    onChange={handleChange}
                />
                <label
                    htmlFor="file-upload"
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                    Sélectionner des fichiers
                </label>
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                            <div className="flex items-center space-x-2">
                                <FiImage className="text-gray-400" />
                                <span className="text-sm text-gray-600 truncate max-w-xs">{file.name}</span>
                                <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FiX />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
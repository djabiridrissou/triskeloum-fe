import React, { useRef, useState } from 'react';
import { Upload, X, Play, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadZoneProps {
    accept: string;
    onChange: (file: File | undefined) => void;
    selectedFile?: File;
    preview?: string;
    label: string;
    isRequired?: boolean;
    type: 'video' | 'image';
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
    accept,
    onChange,
    selectedFile,
    preview,
    label,
    isRequired = false,
    type,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewData, setPreviewData] = useState<string | null>(preview || null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file: File) => {
        onChange(file);
        
        if (type === 'video') {
            const url = URL.createObjectURL(file);
            setPreviewData(url);
        } else if (type === 'image') {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewData(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        onChange(undefined);
        setPreviewData(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>

            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                animate={{
                    backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'rgba(249, 250, 251, 1)',
                    borderColor: isDragging ? 'rgb(59, 130, 246)' : 'rgb(229, 231, 235)',
                }}
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => !selectedFile && !previewData && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleInputChange}
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {selectedFile || previewData ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="space-y-4"
                        >
                            {type === 'video' ? (
                                <div className="relative rounded-lg overflow-hidden bg-black">
                                    <video
                                        src={previewData || undefined}
                                        className="w-full h-40 object-cover"
                                        controls
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition">
                                        <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100" />
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={previewData || undefined}
                                    alt="preview"
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                            )}

                            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    {type === 'video' ? (
                                        <Play className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    ) : (
                                        <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    )}
                                    <span className="text-sm text-gray-700 truncate">
                                        {selectedFile?.name || 'Fichier prévisualisé'}
                                    </span>
                                </div>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove();
                                    }}
                                    className="ml-2 p-1 hover:bg-blue-200 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <X className="w-5 h-5 text-blue-600" />
                                </motion.button>
                            </div>

                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    inputRef.current?.click();
                                }}
                                className="w-full py-2 px-4 text-sm text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Remplacer le fichier
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center text-center"
                        >
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mb-4"
                            >
                                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                            </motion.div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                Glissez-déposez votre fichier
                            </p>
                            <p className="text-xs text-gray-500">
                                ou cliquez pour parcourir
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default FileUploadZone;

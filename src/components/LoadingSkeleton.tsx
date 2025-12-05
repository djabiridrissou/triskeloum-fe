// src/components/admin/LoadingSkeleton.tsx
import React from 'react';

export const KPICardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    );
};

export const TableSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ChartSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
        </div>
    );
};

const LoadingSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-6">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                        <div className="flex gap-2">
                            <div className="h-10 bg-gray-200 rounded flex-1" />
                            <div className="h-10 bg-gray-200 rounded flex-1" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
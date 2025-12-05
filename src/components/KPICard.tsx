// src/components/admin/KPICard.tsx
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
};

const KPICard: React.FC<KPICardProps> = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    trend,
    color = 'blue' 
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <div className="flex items-center mt-2">
                            {trend.isPositive ? (
                                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.value}%
                            </span>
                            <span className="text-sm text-gray-500 ml-1">vs dernier mois</span>
                        </div>
                    )}
                </div>
                <div className={`${colorClasses[color]} p-4 rounded-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default KPICard;
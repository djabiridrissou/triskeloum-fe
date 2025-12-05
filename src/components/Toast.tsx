import { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastProps {
    messages: ToastMessage[];
    onDismiss: (id: string) => void;
}

export default function Toast({ messages, onDismiss }: ToastProps) {
    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
            case 'error':
                return <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />;
            case 'warning':
                return <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />;
            case 'info':
            default:
                return <InformationCircleIcon className="w-6 h-6 text-blue-600" />;
        }
    };

    const getColors = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-900';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-900';
            case 'warning':
                return 'bg-amber-50 border-amber-200 text-amber-900';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200 text-blue-900';
        }
    };

    const getBgColor = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-green-100';
            case 'error':
                return 'bg-red-100';
            case 'warning':
                return 'bg-amber-100';
            case 'info':
            default:
                return 'bg-blue-100';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
            {messages.map(msg => (
                <ToastItem
                    key={msg.id}
                    message={msg}
                    icon={getIcon(msg.type)}
                    colors={getColors(msg.type)}
                    bgColor={getBgColor(msg.type)}
                    onDismiss={() => onDismiss(msg.id)}
                />
            ))}
        </div>
    );
}

interface ToastItemProps {
    message: ToastMessage;
    icon: React.ReactNode;
    colors: string;
    bgColor: string;
    onDismiss: () => void;
}

function ToastItem({ message, icon, colors, bgColor, onDismiss }: ToastItemProps) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, message.duration || 4000);
        return () => clearTimeout(timer);
    }, [message.duration, onDismiss]);

    return (
        <div className={`${colors} border rounded-lg shadow-lg p-4 flex gap-4 items-start animate-in fade-in slide-in-from-right-full duration-300`}>
            <div className={`${bgColor} rounded-full p-1 flex-shrink-0`}>
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="font-semibold">{message.title}</h3>
                {message.message && <p className="text-sm opacity-90 mt-1">{message.message}</p>}
            </div>
            <button
                onClick={onDismiss}
                className="flex-shrink-0 hover:opacity-75 transition-opacity"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
    );
}
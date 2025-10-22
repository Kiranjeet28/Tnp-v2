// components/ErrorAlert.tsx - Display error messages from URL params
"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, X } from 'lucide-react';

export function ErrorAlert() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const errorParam = searchParams.get('error');
        const messageParam = searchParams.get('message');

        if (errorParam) {
            setShow(true);
            setError(errorParam);
            setMessage(messageParam || getDefaultMessage(errorParam));

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    const getDefaultMessage = (errorType: string): string => {
        switch (errorType) {
            case 'unauthorized':
                return 'You do not have permission to access this page.';
            case 'authentication_required':
                return 'Please login to access this page.';
            case 'invalid_token':
                return 'Your session has expired. Please login again.';
            default:
                return 'An error occurred.';
        }
    };

    const handleClose = () => {
        setShow(false);
        // Remove error params from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('error');
        url.searchParams.delete('message');
        router.replace(url.pathname + url.search);
    };

    if (!show) return null;

    return (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
                <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-red-800 mb-1">
                            {error === 'unauthorized' ? 'Access Denied' : 'Authentication Error'}
                        </h3>
                        <p className="text-sm text-red-700">{message}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

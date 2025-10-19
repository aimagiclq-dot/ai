import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const StripeRedirectOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-[100] animate-fade-in">
            <div className="text-center p-8">
                <svg className="w-16 h-16 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5v21m-8.25-6.75h16.5M3 9.75h1.5v4.5H3v-4.5Zm16.5 0h1.5v4.5h-1.5v-4.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.75h6v4.5H9v-4.5Z" />
                </svg>
                <h2 className="text-3xl font-bold text-brand-secondary">Connecting to our secure portal...</h2>
                <p className="mt-2 text-gray-600">Please wait while we redirect you. This may take a moment.</p>
                <div className="mt-6 flex justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        </div>
    );
};

export default StripeRedirectOverlay;
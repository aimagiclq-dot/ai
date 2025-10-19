import React from 'react';
import Confetti from './Confetti';

interface UpgradeSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpgradeSuccessModal: React.FC<UpgradeSuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 p-8 text-center animate-scale-in overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <Confetti />
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                    <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-brand-secondary">
                    Upgrade Successful!
                </h2>
                <p className="mt-3 text-gray-600">
                    Welcome to the Pro plan! You now have unlimited generations and access to all premium features.
                </p>
                <div className="mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full text-white font-bold py-3 px-4 rounded-lg bg-brand-primary hover:opacity-90 transition-opacity"
                    >
                        Start Creating
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeSuccessModal;
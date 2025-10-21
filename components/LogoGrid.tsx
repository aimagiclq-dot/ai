import React, { useState } from 'react';
import { Variation, User } from '../types';
import ImageDisplay from './ImageDisplay';
import { SparklesIcon, EditIcon, HistoryIcon, DownloadIcon, MagicWandIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import ImagePreviewModal from './ImagePreviewModal';

interface LogoGridProps {
    variations: Variation[];
    onEdit: (item: Variation) => void;
    onRegenerateAll: () => void;
    onStartOver: () => void;
    onGenerateSimilar: (variation: Variation) => void;
    onBackToForm: () => void;
    isLoading?: boolean;
    user: User | null;
    onRemoveBackground: (index: number) => void;
    removingBgStates: { [key: number]: boolean };
}

const LogoGrid: React.FC<LogoGridProps> = ({ 
    variations, 
    onEdit, 
    onRegenerateAll, 
    onStartOver, 
    onGenerateSimilar,
    onBackToForm,
    isLoading = false, 
    user,
    onRemoveBackground,
    removingBgStates,
}) => {
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const totalVariations = 4;
    const placeholdersCount = isLoading ? Math.max(0, totalVariations - variations.length) : 0;

    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `logogen_logo_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-fade-in-down">
            <div className="text-center mb-10">
                 <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-secondary tracking-tighter">
                    {isLoading ? 'Generating Concepts...' : 'Choose Your Favorite Concept'}
                </h1>
                <p className="mt-3 max-w-xl mx-auto text-lg text-gray-600">
                    {isLoading ? 'Our AI is working hard. New logos will appear here as they are created.' : 'Select a logo to edit, download, or generate similar ideas.'}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {variations.map((item, index) => {
                    const isRemovingBg = removingBgStates[index];
                    return (
                    <div key={index} className="space-y-3 flex flex-col">
                       <div 
                         className="relative bg-transparent rounded-2xl flex-grow cursor-pointer group checkerboard"
                         onClick={() => setPreviewImageUrl(item.imageUrl)}
                         role="button"
                         aria-label="Preview logo"
                       >
                         <div className="transition-transform duration-300 group-hover:scale-105">
                           <ImageDisplay imageUrl={item.imageUrl} />
                         </div>
                       </div>
                        <button 
                            onClick={() => onEdit(item)}
                            className="w-full bg-brand-primary text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            <EditIcon className="w-5 h-5" />
                            Edit & Refine
                        </button>
                        <div className="grid grid-cols-3 gap-2">
                             <button 
                                onClick={() => onGenerateSimilar(item)}
                                className="w-full bg-gray-100 text-gray-800 font-semibold py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-xs"
                            >
                                <SparklesIcon className="w-4 h-4" />
                                Similar
                            </button>
                             <button 
                                onClick={() => handleDownload(item.imageUrl)}
                                className="w-full bg-gray-100 text-gray-800 font-semibold py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-xs"
                            >
                                <DownloadIcon className="w-4 h-4" />
                                Download
                            </button>
                             <button 
                                onClick={() => onRemoveBackground(index)}
                                disabled={isRemovingBg}
                                className="w-full bg-gray-100 text-gray-800 font-semibold py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-xs disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isRemovingBg ? <LoadingSpinner size="sm" /> : <MagicWandIcon className="w-4 h-4" />}
                                {isRemovingBg ? 'Removing...' : 'Remove BG'}
                            </button>
                        </div>
                    </div>
                )})}
                {Array.from({ length: placeholdersCount }).map((_, index) => (
                    <div key={`placeholder-${index}`} className="space-y-4 flex flex-col">
                        <div className="bg-gray-50 rounded-2xl p-2 shadow-sm flex-grow flex items-center justify-center aspect-square">
                            <LoadingSpinner size="lg" />
                        </div>
                        <div className="w-full bg-gray-200 h-[52px] rounded-lg"></div>
                        <div className="grid grid-cols-3 gap-2">
                             <div className="w-full bg-gray-200 h-[42px] rounded-lg"></div>
                             <div className="w-full bg-gray-200 h-[42px] rounded-lg"></div>
                             <div className="w-full bg-gray-200 h-[42px] rounded-lg"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
                 <button 
                    onClick={onBackToForm}
                    disabled={isLoading}
                    className="w-full sm:w-auto text-gray-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <EditIcon className="w-5 h-5" />
                    Back to Form
                </button>
                <button 
                    onClick={onRegenerateAll}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-white text-brand-secondary font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-brand-secondary"
                >
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? 'Generating...' : 'Generate New'}
                </button>
                 <button 
                    onClick={onStartOver}
                    disabled={isLoading}
                    className="w-full sm:w-auto text-gray-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <HistoryIcon className="w-5 h-5 transform scale-x-[-1]" />
                    Start Over
                </button>
            </div>
            
            {previewImageUrl && (
                <ImagePreviewModal 
                    imageUrl={previewImageUrl} 
                    onClose={() => setPreviewImageUrl(null)} 
                />
            )}
        </div>
    );
};

export default LogoGrid;
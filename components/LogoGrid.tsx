import React, { useState } from 'react';
import { Variation, User } from '../types';
import ImageDisplay from './ImageDisplay';
import { SparklesIcon, EditIcon, HistoryIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import ImagePreviewModal from './ImagePreviewModal';
import Watermark from './Watermark';

interface LogoGridProps {
    variations: Variation[];
    onEdit: (item: Variation) => void;
    onRegenerateAll: () => void;
    onStartOver: () => void;
    isLoading?: boolean;
    user: User | null;
}

const LogoGrid: React.FC<LogoGridProps> = ({ variations, onEdit, onRegenerateAll, onStartOver, isLoading = false, user }) => {
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const totalVariations = 4;
    const placeholdersCount = isLoading ? Math.max(0, totalVariations - variations.length) : 0;

    const showWatermark = user?.plan === 'free';

    return (
        <div className="animate-fade-in-down">
            <div className="text-center mb-10">
                 <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-secondary tracking-tighter">
                    {isLoading ? 'Generating Concepts...' : 'Choose Your Favorite Concept'}
                </h1>
                <p className="mt-3 max-w-xl mx-auto text-lg text-gray-600">
                    {isLoading ? 'Our AI is working hard. New logos will appear here as they are created.' : 'Select a logo to manually edit text, refine colors, and export. Or, generate a new batch of ideas.'}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {variations.map((item, index) => (
                    <div key={index} className="space-y-4 flex flex-col">
                       <div 
                         className="relative bg-gray-50 rounded-2xl p-2 shadow-sm flex-grow cursor-pointer hover:shadow-md transition-shadow"
                         onClick={() => setPreviewImageUrl(item.imageUrl)}
                         role="button"
                         aria-label="Preview logo"
                       >
                         <ImageDisplay imageUrl={item.imageUrl} />
                         {showWatermark && <Watermark />}
                       </div>
                        <button 
                            onClick={() => onEdit(item)}
                            className="w-full bg-brand-primary text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            <EditIcon className="w-5 h-5" />
                            Edit & Refine
                        </button>
                    </div>
                ))}
                {Array.from({ length: placeholdersCount }).map((_, index) => (
                    <div key={`placeholder-${index}`} className="space-y-4 flex flex-col">
                        <div className="bg-gray-50 rounded-2xl p-2 shadow-sm flex-grow flex items-center justify-center aspect-square">
                            <LoadingSpinner size="lg" />
                        </div>
                        <div className="w-full bg-gray-200 text-gray-500 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
                            <EditIcon className="w-5 h-5" />
                            Generating...
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                    onClick={onRegenerateAll}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-white text-brand-secondary font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-brand-secondary"
                >
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? 'Generating...' : 'Generate New Variations'}
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

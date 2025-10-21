import React from 'react';
import { LogoAsset, User } from '../../types';
import ImageDisplay from '../ImageDisplay';
import { EditIcon, DownloadIcon } from '../icons';

interface HistoryGalleryProps {
    logoHistory: LogoAsset[];
    onEditLogo: (logo: LogoAsset) => void;
    user: User | null;
}

const HistoryGallery: React.FC<HistoryGalleryProps> = ({ logoHistory, onEditLogo, user }) => {
    
    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `logogen_logo_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (logoHistory.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                <h3 className="text-xl font-bold text-brand-secondary">No Logos Yet</h3>
                <p className="text-gray-600 mt-2">Start generating logos and they will appear here!</p>
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-secondary mb-6">Your Logo History</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {logoHistory.map(asset => (
                    <div key={asset.id} className="group relative space-y-3 flex flex-col">
                        <div className="relative bg-transparent rounded-2xl flex-grow">
                            <ImageDisplay imageUrl={asset.imageUrl} />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onEditLogo(asset)}
                                className="w-full bg-brand-primary text-white font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                <EditIcon className="w-5 h-5" />
                                Edit
                            </button>
                             <button
                                onClick={() => handleDownload(asset.imageUrl)}
                                className="w-full bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                            >
                                <DownloadIcon className="w-5 h-5" />
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryGallery;

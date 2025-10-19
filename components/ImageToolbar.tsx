import React from 'react';
import { MagicWandIcon, VectorizeIcon, CropIcon } from './icons';
import Tooltip from './Tooltip';

interface ImageToolbarProps {
    onRemoveBg: () => void;
    onCrop: () => void;
    onVectorize: () => void;
    isProcessing: boolean;
}

const ImageToolbar: React.FC<ImageToolbarProps> = ({ onRemoveBg, onCrop, onVectorize, isProcessing }) => {
    return (
        <div 
            className="image-toolbar absolute bottom-full left-1/2 -translate-x-1/2 mb-2 h-[40px] bg-white rounded-lg shadow-md flex items-center px-2 gap-1 animate-fade-in-down z-20"
            onClick={(e) => e.stopPropagation()}
        >
            <Tooltip content="Remove Background">
                <button 
                    onClick={onRemoveBg} 
                    disabled={isProcessing}
                    className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <MagicWandIcon className="w-5 h-5"/>
                </button>
            </Tooltip>
            <Tooltip content="Magic Crop">
                <button 
                    onClick={onCrop}
                    disabled={isProcessing}
                    className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <CropIcon className="w-5 h-5"/>
                </button>
            </Tooltip>
            <Tooltip content="Vectorize Image">
                <button 
                    onClick={onVectorize}
                    disabled={isProcessing}
                    className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <VectorizeIcon className="w-5 h-5"/>
                </button>
            </Tooltip>
        </div>
    );
};

export default ImageToolbar;
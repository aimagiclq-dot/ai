import React from 'react';

interface ImagePlaceholderProps {
    label: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ label }) => {
    return (
        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center p-2">
            <span className="text-xs font-semibold text-gray-500 text-center">{label}</span>
        </div>
    );
};

export default ImagePlaceholder;

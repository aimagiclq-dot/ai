import React from 'react';
import ImageUploader from '../ImageUploader';

interface UploadsPanelProps {
    onAddImage: (src: string) => void;
}

const UploadsPanel: React.FC<UploadsPanelProps> = ({ onAddImage }) => {
    return (
        <div>
            <p className="text-sm text-gray-600 mb-4">
                Upload your own images to add them as new layers to your design.
            </p>
            <ImageUploader onUpload={onAddImage} />
        </div>
    );
};

export default UploadsPanel;

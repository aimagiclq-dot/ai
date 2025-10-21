import React from 'react';

interface ImageDisplayProps {
  imageUrl: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl }) => {
  return (
    <div className="w-full h-full bg-transparent rounded-2xl flex items-center justify-center aspect-square">
      <img 
        src={imageUrl} 
        alt="Generated Logo" 
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export default ImageDisplay;

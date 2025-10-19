import React from 'react';

interface ImagePreviewModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative max-w-[95vw] max-h-[95vh] p-2 animate-scale-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
      >
        <img 
          src={imageUrl} 
          alt="Logo Full Preview" 
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
        aria-label="Close image preview"
      >
        &times;
      </button>
    </div>
  );
};

export default ImagePreviewModal;
import React from 'react';
import { FontStyle } from '../types';

interface FontPreviewProps {
    font: FontStyle;
    logoName: string;
    isSelected: boolean;
    onSelect: () => void;
}

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z"
      clipRule="evenodd"
    />
  </svg>
);


const FontPreview: React.FC<FontPreviewProps> = ({ font, logoName, isSelected, onSelect }) => {
    return (
        <div
            onClick={onSelect}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex flex-col justify-center items-center h-40 group hover:scale-105 ${
                isSelected 
                ? 'border-brand-primary bg-brand-lavender/30' 
                : 'bg-white border-gray-200 hover:border-brand-primary'
            }`}
        >
            <p className={`text-3xl text-center truncate w-full px-2 ${font.className}`} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {logoName}
            </p>
            <p className="absolute bottom-2 left-3 text-xs font-semibold text-gray-500 group-hover:text-brand-primary transition-colors">{font.name}</p>
            {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center shadow">
                    <CheckIcon className="w-4 h-4" />
                </div>
            )}
        </div>
    );
};

export default FontPreview;
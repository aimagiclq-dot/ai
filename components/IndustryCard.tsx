import React from 'react';
import { Industry } from '../types';

interface IndustryCardProps {
  industry: Industry;
  isSelected: boolean;
  onSelect: () => void;
}

const IndustryCard: React.FC<IndustryCardProps> = ({ industry, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-brand-primary/10 border-brand-primary text-brand-primary ring-2 ring-brand-primary/50'
          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-100'
      }`}
    >
      <industry.icon className="w-8 h-8" />
      <span className="text-xs font-semibold">{industry.name}</span>
    </button>
  );
};

export default IndustryCard;
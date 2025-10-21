import React from 'react';
import { ColorPalette } from '../types';

interface PaletteSwatchProps {
  palette: ColorPalette;
  isSelected: boolean;
  onSelect: () => void;
}

const ColorSwatch: React.FC<PaletteSwatchProps> = ({ palette, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-lg flex flex-col items-start gap-3 cursor-pointer border-2 transition-all ${
        isSelected ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="w-full h-16 rounded-md overflow-hidden flex shadow-inner">
        {palette.colors.map(color => (
            <div key={color.hex} className="flex-1 h-full transition-all" style={{ backgroundColor: color.hex }} />
        ))}
      </div>
      <div>
        <h4 className="font-bold text-brand-secondary">{palette.name}</h4>
        <p className="text-sm text-gray-600">{palette.description}</p>
      </div>
    </div>
  );
};

export default ColorSwatch;

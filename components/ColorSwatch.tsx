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
      className={`p-4 rounded-lg flex flex-col items-start gap-3 cursor-pointer border-2 transition-all ${
        isSelected ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-2">
        {palette.colors.map(color => (
          <div key={color.hex} className="w-6 h-6 rounded-full border border-gray-300 shadow-inner" style={{ backgroundColor: color.hex }} />
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
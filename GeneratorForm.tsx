import React, { useState } from 'react';
import { ColorPalette, FontStyle, Industry } from '../types';
import { industries, colorPalettes, fontStyles } from './data';
import IndustryCard from './IndustryCard';
import ColorSwatch from './ColorSwatch';
import FontPreview from './FontPreview';
import LoadingSpinner from './LoadingSpinner';

interface GeneratorFormProps {
  logoName: string;
  setLogoName: (name: string) => void;
  slogan: string;
  setSlogan: (slogan: string) => void;
  selectedIndustry: Industry | null;
  setSelectedIndustry: (industry: Industry | null) => void;
  selectedColors: ColorPalette[];
  setSelectedColors: React.Dispatch<React.SetStateAction<ColorPalette[]>>;
  selectedFonts: FontStyle[];
  setSelectedFonts: React.Dispatch<React.SetStateAction<FontStyle[]>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({
  logoName,
  setLogoName,
  slogan,
  setSlogan,
  selectedIndustry,
  setSelectedIndustry,
  selectedColors,
  setSelectedColors,
  selectedFonts,
  setSelectedFonts,
  onGenerate,
  isLoading,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleColorSelect = (palette: ColorPalette) => {
    setSelectedColors((prev) =>
      prev.some((p) => p.name === palette.name)
        ? prev.filter((p) => p.name !== palette.name)
        : [...prev, palette]
    );
  };

  const handleFontSelect = (font: FontStyle) => {
    setSelectedFonts((prev) =>
      prev.some((f) => f.name === font.name)
        ? prev.filter((f) => f.name !== font.name)
        : [...prev, font]
    );
  };
  
  const handleGenerateClick = () => {
    if (!logoName.trim()) {
      setError('Please enter a logo name to continue.');
      return;
    }
    setError(null);
    onGenerate();
  };


  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-soft p-6 sm:p-10 text-left">
      <div className="space-y-12">
        {/* Step 1: Logo Name */}
        <div>
          <h3 className="font-bold text-2xl text-brand-secondary mb-2">Step 1: Logo Name</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="logoName" className="font-semibold text-gray-700 block mb-2">Enter your logo name</label>
              <input
                type="text"
                id="logoName"
                value={logoName}
                onChange={(e) => {
                  setLogoName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Your Brand Name"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 transition-all ${error ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/50'}`}
              />
               {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>
            <div>
              <label htmlFor="slogan" className="font-semibold text-gray-700 block mb-2">Slogan (optional)</label>
              <input
                type="text"
                id="slogan"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Your Slogan"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Industry */}
        <div>
          <h3 className="font-bold text-2xl text-brand-secondary mb-2">Step 2: Please Select an Industry</h3>
          <p className="text-gray-600 mb-6">This will help us find logo types and styles that fit your brand.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {industries.map((industry) => (
              <IndustryCard
                key={industry.name}
                industry={industry}
                isSelected={selectedIndustry?.name === industry.name}
                onSelect={() => setSelectedIndustry(industry)}
              />
            ))}
          </div>
        </div>

        {/* Step 3: Color Scheme */}
        <div>
          <h3 className="font-bold text-2xl text-brand-secondary mb-2">Step 3: Select Color Schemes That Match Your Brand</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colorPalettes.map((palette) => (
              <ColorSwatch
                key={palette.name}
                palette={palette}
                isSelected={selectedColors.some(p => p.name === palette.name)}
                onSelect={() => handleColorSelect(palette)}
              />
            ))}
          </div>
        </div>

        {/* Step 4: Font Style */}
        <div>
          <h3 className="font-bold text-2xl text-brand-secondary mb-2">Step 4: Select Font Styles You Like</h3>
           <div className="relative w-full">
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
                    {fontStyles.map((font) => (
                        <FontPreview 
                            key={font.name} 
                            font={font} 
                            logoName={logoName || 'Brand Name'}
                            isSelected={selectedFonts.some(f => f.name === font.name)}
                            onSelect={() => handleFontSelect(font)}
                        />
                    ))}
                </div>
           </div>
        </div>

        {/* Generate Button */}
        <div className="text-center pt-6">
          <button
            onClick={handleGenerateClick}
            disabled={!logoName.trim() || isLoading}
            className="text-white font-bold text-lg px-12 py-4 rounded-full bg-gradient-to-r from-brand-primary to-brand-light hover:shadow-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none flex items-center justify-center mx-auto"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Generating...
              </>
            ) : (
             'Generate Logo'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratorForm;

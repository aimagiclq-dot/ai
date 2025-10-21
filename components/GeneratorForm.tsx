import React, { useState } from 'react';
import { BrandColor, FontStyle, Industry, ColorPalette, LogoGenerationParams } from '../types';
import { industries, brandColors, fontStyles, colorPalettes, logoStyles } from './data';
import IndustryCard from './IndustryCard';
import FontPreview from './FontPreview';
import LoadingSpinner from './LoadingSpinner';
import ImageUploader from './ImageUploader';
import Tooltip from './Tooltip';
import ColorSwatch from './ColorSwatch';
import { TrashIcon } from './icons';

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z"
      clipRule="evenodd"
    />
  </svg>
);


interface GeneratorFormProps {
  logoName: string;
  setLogoName: (name: string) => void;
  slogan: string;
  setSlogan: (slogan: string) => void;
  selectedIndustry: Industry | null;
  setSelectedIndustry: (industry: Industry | null) => void;
  customIndustry: string;
  setCustomIndustry: (industry: string) => void;
  selectedColors: BrandColor[];
  setSelectedColors: React.Dispatch<React.SetStateAction<BrandColor[]>>;
  selectedFonts: FontStyle[];
  setSelectedFonts: React.Dispatch<React.SetStateAction<FontStyle[]>>;
  referenceImage: string;
  setReferenceImage: (image: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  logoStyle: string;
  setLogoStyle: (style: string) => void;
  layout: LogoGenerationParams['layout'];
  setLayout: (layout: LogoGenerationParams['layout']) => void;
  iconDescription: string;
  setIconDescription: (desc: string) => void;
}

const ProgressBar: React.FC<{currentStep: number, totalSteps: number}> = ({ currentStep, totalSteps }) => {
    const percentage = (currentStep / totalSteps) * 100;
    return (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div className="bg-brand-primary h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

const GeneratorForm: React.FC<GeneratorFormProps> = (props) => {
  const {
    logoName, setLogoName, slogan, setSlogan,
    selectedIndustry, setSelectedIndustry, customIndustry, setCustomIndustry,
    selectedColors, setSelectedColors, selectedFonts, setSelectedFonts,
    referenceImage, setReferenceImage,
    onGenerate, isLoading,
    logoStyle, setLogoStyle,
    layout, setLayout,
    iconDescription, setIconDescription,
  } = props;
    
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState('#6336E4');
  const [fontFilter, setFontFilter] = useState('All');

  const totalSteps = 7;

  const fontStyleTags = ['All', 'Serif', 'Sans-Serif', 'Display', 'Handwriting', 'Modern', 'Elegant', 'Bold', 'Minimalist', 'Fun', 'Classic', 'Futuristic'];

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
  const getBrightness = (hex: string): number => {
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const handleColorSelect = (color: BrandColor) => {
    setSelectedColors((prev) =>
      prev.some((c) => c.hex === color.hex)
        ? prev.filter((c) => c.hex !== color.hex)
        : [...prev, color]
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
      setStep(1); // Go back to the first step to fix error
      return;
    }
    setError(null);
    onGenerate();
  };

  const isPaletteSelected = (palette: ColorPalette) => {
    if (palette.colors.length !== selectedColors.length) return false;
    const selectedHexes = new Set(selectedColors.map(c => c.hex));
    return palette.colors.every(c => selectedHexes.has(c.hex));
  };

  const handlePaletteSelect = (palette: ColorPalette) => {
      setSelectedColors(palette.colors);
  };

  const addCustomColor = () => {
      const newColor = { name: customColor, hex: customColor };
      if (!selectedColors.some(c => c.hex === newColor.hex)) {
          setSelectedColors(prev => [...prev, newColor]);
      }
  };

  const removeSelectedColor = (colorToRemove: BrandColor) => {
      setSelectedColors(prev => prev.filter(c => c.hex !== colorToRemove.hex));
  };

  const filteredFonts = fontFilter === 'All'
      ? fontStyles
      : fontStyles.filter(font => font.tags.includes(fontFilter));
      
  const stepTitles: { [key: number]: string } = {
    1: 'What is your brand\'s name?',
    2: 'Describe your icon & layout (Optional)',
    3: 'Choose a logo style (Optional)',
    4: 'Please Select an Industry (Optional)',
    5: 'Select Your Brand Colors (Optional)',
    6: 'Select Font Styles You Like (Optional)',
    7: 'Have a reference? (Optional)',
  };
  
  const layoutOptions: { id: NonNullable<LogoGenerationParams['layout']>; label: string; }[] = [
    { id: 'icon-top', label: 'Icon on Top' },
    { id: 'icon-left', label: 'Icon on Left' },
    { id: 'icon-right', label: 'Icon on Right' },
  ];

  const compositionOptions: { id: NonNullable<LogoGenerationParams['layout']>; label: string; }[] = [
      { id: 'icon-top', label: 'Icon + Text' },
      { id: 'icon-only', label: 'Icon Only' },
      { id: 'text-only', label: 'Text Only' },
  ];


  return (
    <div className="max-w-5xl mx-auto mt-12">
        <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-10 text-left">
            <ProgressBar currentStep={step} totalSteps={totalSteps} />
            <h3 className="font-bold text-2xl text-brand-secondary mb-6">{stepTitles[step]}</h3>

            <div className="space-y-12">
                {/* Step 1: Logo Name */}
                {step === 1 && (
                <div className="animate-fade-in-down">
                  <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                      <label htmlFor="logoName" className="font-semibold text-gray-700 block mb-2">Enter your logo name</label>
                      <div className={`p-[2px] rounded-lg bg-gradient-to-r transition-all focus-within:ring-4 ${
                          error
                          ? 'from-red-400 to-pink-400 focus-within:ring-red-500/30'
                          : 'from-[#00c4cc] to-[#7d2ae8] focus-within:ring-[#7d2ae8]/30'
                      }`}>
                          <input
                          type="text"
                          id="logoName"
                          value={logoName}
                          onChange={(e) => {
                              setLogoName(e.target.value);
                              if (error) setError(null);
                          }}
                          placeholder="Your Brand Name"
                          className="w-full px-4 py-3 rounded-[6px] border-0 bg-gray-50 focus:bg-white focus:outline-none text-gray-900 placeholder:text-gray-400"
                          />
                      </div>
                      {error && <p className="text-red-600 text-sm font-semibold mt-2 animate-fade-in-down">{error}</p>}
                      </div>
                      <div>
                      <label htmlFor="slogan" className="font-semibold text-gray-700 block mb-2">Slogan (optional)</label>
                      <div className="p-[2px] rounded-lg bg-gradient-to-r from-[#00c4cc] to-[#7d2ae8] transition-all focus-within:ring-4 focus-within:ring-[#7d2ae8]/30">
                          <input
                          type="text"
                          id="slogan"
                          value={slogan}
                          onChange={(e) => setSlogan(e.target.value)}
                          placeholder="Your Slogan"
                          className="w-full px-4 py-3 rounded-[6px] border-0 bg-gray-50 focus:bg-white focus:outline-none text-gray-900 placeholder:text-gray-400"
                          />
                      </div>
                      </div>
                  </div>
                </div>
                )}
                
                {/* Step 2: Icon & Layout */}
                {step === 2 && (
                    <div className="animate-fade-in-down">
                        <label htmlFor="iconDescription" className="font-semibold text-gray-700 block mb-2">Describe your desired icon</label>
                        <div className="p-[2px] rounded-lg bg-gradient-to-r from-[#00c4cc] to-[#7d2ae8] transition-all focus-within:ring-4 focus-within:ring-[#7d2ae8]/30">
                            <input
                                type="text"
                                id="iconDescription"
                                value={iconDescription}
                                onChange={(e) => setIconDescription(e.target.value)}
                                placeholder="e.g., a majestic lion's head, an abstract geometric wave"
                                className="w-full px-4 py-3 rounded-[6px] border-0 bg-gray-50 focus:bg-white focus:outline-none text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                        
                        <div className="mt-6">
                            <label className="font-semibold text-gray-700 block mb-2">Composition</label>
                            <div className="flex flex-wrap gap-2">
                                {compositionOptions.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setLayout(opt.id)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                                            layout === opt.id || (layout !== 'icon-only' && layout !== 'text-only' && opt.id === 'icon-top')
                                            ? 'bg-brand-primary text-white shadow'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {layout !== 'icon-only' && layout !== 'text-only' && (
                            <div className="mt-6 animate-fade-in">
                                <label className="font-semibold text-gray-700 block mb-2">Icon Position</label>
                                <div className="flex flex-wrap gap-2">
                                    {layoutOptions.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setLayout(opt.id)}
                                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                                                layout === opt.id
                                                ? 'bg-brand-primary text-white shadow'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Step 3: Style */}
                {step === 3 && (
                     <div className="animate-fade-in-down">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {logoStyles.map((style) => (
                                <IndustryCard
                                    key={style.name}
                                    industry={style}
                                    isSelected={logoStyle === style.name}
                                    onSelect={() => setLogoStyle(style.name)}
                                />
                            ))}
                        </div>
                     </div>
                )}

                {/* Step 4: Industry */}
                {step === 4 && (
                <div className="animate-fade-in-down">
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
                  {selectedIndustry?.name === 'Others' && (
                    <div className="mt-6 animate-fade-in-down">
                        <label htmlFor="customIndustry" className="font-semibold text-gray-700 block mb-2">Industry not listed? (optional)</label>
                        <div className="p-[2px] rounded-lg bg-gradient-to-r from-[#00c4cc] to-[#7d2ae8] transition-all focus-within:ring-4 focus-within:ring-[#7d2ae8]/30">
                            <input
                                type="text"
                                id="customIndustry"
                                value={customIndustry}
                                onChange={(e) => setCustomIndustry(e.target.value)}
                                placeholder="e.g., Sustainable Fashion"
                                className="w-full px-4 py-3 rounded-[6px] border-0 bg-gray-50 focus:bg-white focus:outline-none text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                  )}
                </div>
                )}
                
                {/* Step 5: Color Scheme */}
                {step === 5 && (
                <div className="animate-fade-in-down">
                  {selectedColors.length > 0 && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3">Your Palette:</h4>
                          <div className="flex flex-wrap gap-3">
                              {selectedColors.map(color => (
                                  <Tooltip key={color.hex} content={color.name}>
                                    <div className="relative group">
                                        <div className="w-10 h-10 rounded-full border border-gray-300" style={{ backgroundColor: color.hex }}></div>
                                        <button onClick={() => removeSelectedColor(color)} className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-xl font-bold" aria-label={`Remove ${color.name}`}>
                                            &times;
                                        </button>
                                    </div>
                                  </Tooltip>
                              ))}
                          </div>
                      </div>
                  )}

                  <div className="mb-8">
                    <h4 className="font-semibold text-lg text-gray-700 mb-4">Start with a Palette</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {colorPalettes.map((palette) => (
                            <ColorSwatch
                                key={palette.name}
                                palette={palette}
                                isSelected={isPaletteSelected(palette)}
                                onSelect={() => handlePaletteSelect(palette)}
                            />
                        ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-semibold text-lg text-gray-700 mb-4">Or Pick Individual Colors</h4>
                    <div className="flex flex-wrap gap-3">
                      {brandColors.map((color) => {
                        const isSelected = selectedColors.some(c => c.hex === color.hex);
                        const iconColor = getBrightness(color.hex) > 150 ? 'text-black' : 'text-white';
                        return (
                          <Tooltip key={color.hex} content={color.name}>
                            <button
                              onClick={() => handleColorSelect(color)}
                              className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center
                                ${isSelected ? 'ring-2 ring-offset-2 ring-brand-primary' : ''}
                                ${color.hex === '#FFFFFF' ? 'border-gray-300' : 'border-transparent'}`}
                              style={{ backgroundColor: color.hex }}
                              aria-label={`Select color ${color.name}`}
                            >
                              {isSelected && <CheckIcon className={`w-5 h-5 ${iconColor}`} />}
                            </button>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg text-gray-700 mb-4">Add a Custom Color</h4>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="color"
                                value={customColor}
                                onChange={(e) => setCustomColor(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label="Custom color picker"
                            />
                            <div className="w-12 h-12 rounded-full border-2 border-gray-300 pointer-events-none" style={{ backgroundColor: customColor }}></div>
                        </div>
                        <button
                            onClick={addCustomColor}
                            className="px-5 py-2.5 font-semibold bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Add Color
                        </button>
                    </div>
                  </div>
                </div>
                )}

                {/* Step 6: Font Style */}
                {step === 6 && (
                <div className="animate-fade-in-down">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {fontStyleTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setFontFilter(tag)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                          fontFilter === tag
                            ? 'bg-brand-primary text-white shadow'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredFonts.map((font) => (
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
                )}

                {/* Step 7: Reference Image */}
                {step === 7 && (
                  <div className="animate-fade-in-down">
                    <p className="text-gray-600 mb-6">Upload a logo you like, and our AI will generate new ideas with a similar style, color, or composition.</p>
                    {referenceImage ? (
                        <div className="relative w-48 h-48 mx-auto border rounded-lg p-2">
                            <img src={referenceImage} alt="Reference" className="w-full h-full object-contain" />
                            <button 
                                onClick={() => setReferenceImage('')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                            >
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ) : (
                        <ImageUploader onUpload={setReferenceImage} />
                    )}
                  </div>
                )}


                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-200">
                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className="font-bold text-gray-600 px-6 py-3 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>

                    {step < totalSteps ? (
                        <div className="flex items-center gap-4">
                             <button
                                onClick={nextStep}
                                className="font-bold text-gray-600 px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                Skip
                            </button>
                            <button
                                onClick={nextStep}
                                className="text-white font-bold px-8 py-3 rounded-full bg-brand-primary hover:opacity-90 transition-opacity"
                            >
                                Next
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleGenerateClick}
                            disabled={!logoName.trim() || isLoading}
                            className="text-white font-bold text-lg px-12 py-4 rounded-full bg-gradient-to-r from-brand-primary to-brand-light hover:shadow-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none flex items-center justify-center"
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
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default GeneratorForm;

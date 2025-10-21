import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import GeneratorForm from './components/GeneratorForm';
import ThirdPartyEditor from './components/ThirdPartyEditor';
import LogoGrid from './components/LogoGrid';
import PricingPage from './components/PricingPage';
import HowItWorksPage from './components/HowItWorksPage';
import FaqPage from './components/FaqPage';
import DashboardPage from './components/dashboard/DashboardPage';
import { generateLogo, removeImageBackground } from './services/geminiService';
import { BrandColor, FontStyle, Industry, Variation, LogoGenerationParams, User, LogoAsset } from './types';
import { LoadingRobotIcon } from './components/icons';

type Page = 'home' | 'pricing' | 'how-it-works' | 'faq' | 'dashboard';
type GenerationStatus = 'idle' | 'generating' | 'results' | 'editing';

const App: React.FC = () => {
  const [logoName, setLogoName] = useState('Aura');
  const [slogan, setSlogan] = useState('Your daily wellness');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [customIndustry, setCustomIndustry] = useState('');
  const [selectedColors, setSelectedColors] = useState<BrandColor[]>([]);
  const [selectedFonts, setSelectedFonts] = useState<FontStyle[]>([]);
  const [referenceImage, setReferenceImage] = useState<string>('');
  const [logoStyle, setLogoStyle] = useState<string>('');
  const [layout, setLayout] = useState<LogoGenerationParams['layout']>('icon-top');
  const [iconDescription, setIconDescription] = useState<string>('');


  const [apiError, setApiError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  
  const [logoVariations, setLogoVariations] = useState<Variation[]>([]);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState<{ [key: number]: boolean }>({});
  
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // User and Auth State - Mocked for open access
  const [user, setUser] = useState<User | null>({
      name: 'Guest',
      email: 'guest@logogen.com',
      plan: 'pro', // Pro plan to unlock all features
      generationsUsed: 0,
      generationLimit: Infinity,
  });
  const [logoHistory, setLogoHistory] = useState<LogoAsset[]>([]);

  const runGenerationProcess = useCallback(async (baseParams: LogoGenerationParams) => {
    setGenerationStatus('generating');
    setApiError(null);
    setLogoVariations([]);

    try {
      const variationPrompts = [
        {...baseParams, prompt: "A minimal and abstract icon."},
        {...baseParams, prompt: "A detailed and illustrative icon."},
        {...baseParams, prompt: "A modern, geometric wordmark."},
        {...baseParams, prompt: "A classic and elegant emblem."}
      ];
      
      const generatedVariations: Variation[] = [];
      const newLogoAssets: LogoAsset[] = [];

      for (const p of variationPrompts) {
        const imageUrl = await generateLogo(p);
        
        const newVariation = { prompt: p, imageUrl };
        generatedVariations.push(newVariation);

        // Add to user's permanent history
        const newAsset: LogoAsset = {
            id: `asset-${Date.now()}-${Math.random()}`,
            imageUrl,
            prompt: p,
            createdAt: new Date(),
        };
        newLogoAssets.push(newAsset);
        setLogoVariations([...generatedVariations]);
      }

      setLogoHistory(prev => [...newLogoAssets, ...prev]);
      setGenerationStatus('results');

    } catch (error) {
       console.error('Logo generation failed:', error);
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred. Please try again.';
       setApiError(`Sorry, we couldn't generate your logos. ${errorMessage}`);
       setGenerationStatus('idle');
    }
  }, []); // State setters are stable

  const handleInitialGenerate = useCallback(async () => {
    const industryForPrompt = selectedIndustry?.name === 'Others' && customIndustry.trim() 
      ? { ...selectedIndustry, name: customIndustry.trim() } 
      : selectedIndustry;
      
    const colorsForPrompt = selectedColors.map(c => ({ name: c.name }));

    const params: LogoGenerationParams = { 
        name: logoName, 
        slogan, 
        industry: industryForPrompt, 
        colors: colorsForPrompt, 
        fonts: selectedFonts, 
        referenceImage,
        style: logoStyle,
        layout,
        iconDescription,
    };
    
    await runGenerationProcess(params);

  }, [logoName, slogan, selectedIndustry, customIndustry, selectedColors, selectedFonts, referenceImage, logoStyle, layout, iconDescription, runGenerationProcess]);

  const handleGenerateSimilar = useCallback(async (baseVariation: Variation) => {
    const params: LogoGenerationParams = {
        ...baseVariation.prompt,
        referenceImage: baseVariation.imageUrl, // Use the selected image as reference
    };
    await runGenerationProcess(params);
  }, [runGenerationProcess]);

  const handleRemoveBackground = useCallback(async (index: number) => {
    setIsRemovingBg(prev => ({ ...prev, [index]: true }));
    try {
        const originalUrl = logoVariations[index].imageUrl;
        const transparentUrl = await removeImageBackground(originalUrl);

        setLogoVariations(prev => {
            const newVariations = [...prev];
            newVariations[index] = { ...newVariations[index], imageUrl: transparentUrl };
            return newVariations;
        });
    } catch (error) {
        console.error('Failed to remove background:', error);
        setApiError('Sorry, we couldn\'t remove the background. Please try again.');
    } finally {
        setIsRemovingBg(prev => ({ ...prev, [index]: false }));
    }
  }, [logoVariations]);

  const handleBackToForm = () => {
      setGenerationStatus('idle');
  };

  const handleSelectForEditing = (item: Variation | LogoAsset) => {
    setEditingImageUrl(item.imageUrl);
    setGenerationStatus('editing');
    setCurrentPage('home');
  };

  const handleBackToResults = () => {
    setEditingImageUrl(null);
    if (logoVariations.length > 0) {
        setGenerationStatus('results');
    } else {
        handleStartOver();
    }
  };
  
  const handleStartOver = () => {
    setLogoName('Aura');
    setSlogan('Your daily wellness');
    setSelectedIndustry(null);
    setCustomIndustry('');
    setSelectedColors([]);
    setSelectedFonts([]);
    setReferenceImage('');
    setLogoStyle('');
    setLayout('icon-top');
    setIconDescription('');
    setApiError(null);
    setEditingImageUrl(null);
    setLogoVariations([]);
    setGenerationStatus('idle');
    setCurrentPage('home');
  };
  
  const handleNavigate = (page: Page) => {
      if (page === 'home' && (generationStatus !== 'idle' || currentPage !== 'home')) {
          handleStartOver();
      } else {
          setCurrentPage(page);
      }
  };

  const renderContent = () => {
    switch (currentPage) {
        case 'home':
            if (generationStatus === 'generating' && logoVariations.length === 0) {
                return (
                    <div className="flex flex-col items-center justify-center pt-16 sm:pt-24 animate-fade-in-down">
                        <LoadingRobotIcon className="w-24 h-24 sm:w-32 sm:h-32 text-brand-primary" />
                        <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-brand-secondary">Crafting your masterpiece...</h2>
                        <p className="text-gray-600 text-base sm:text-lg mt-2">Our AI is generating four unique concepts for you.</p>
                    </div>
                );
            }
            if (generationStatus === 'results' || (generationStatus === 'generating' && logoVariations.length > 0)) {
              return (
                <LogoGrid 
                  variations={logoVariations}
                  onEdit={handleSelectForEditing}
                  onRegenerateAll={handleInitialGenerate}
                  onGenerateSimilar={handleGenerateSimilar}
                  onBackToForm={handleBackToForm}
                  onStartOver={handleStartOver}
                  isLoading={generationStatus === 'generating'}
                  user={user}
                  onRemoveBackground={handleRemoveBackground}
                  removingBgStates={isRemovingBg}
                />
              );
            }
            return (
              <>
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-secondary tracking-tighter">
                        Create Your Perfect Logo Instantly
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Powered by advanced AI and designed for your unique brand.
                    </p>
                    <GeneratorForm
                        logoName={logoName}
                        setLogoName={setLogoName}
                        slogan={slogan}
                        setSlogan={setSlogan}
                        selectedIndustry={selectedIndustry}
                        setSelectedIndustry={setSelectedIndustry}
                        customIndustry={customIndustry}
                        setCustomIndustry={setCustomIndustry}
                        selectedColors={selectedColors}
                        setSelectedColors={setSelectedColors}
                        selectedFonts={selectedFonts}
                        setSelectedFonts={setSelectedFonts}
                        referenceImage={referenceImage}
                        setReferenceImage={setReferenceImage}
                        onGenerate={handleInitialGenerate}
                        isLoading={generationStatus === 'generating'}
                        logoStyle={logoStyle}
                        setLogoStyle={setLogoStyle}
                        layout={layout}
                        setLayout={setLayout}
                        iconDescription={iconDescription}
                        setIconDescription={setIconDescription}
                    />
                    {apiError && (
                        <p className="mt-4 text-red-600 font-semibold">{apiError}</p>
                    )}
                </div>
                <div className="mt-12 text-center">
                  <p className="text-sm font-semibold text-gray-500 bg-gray-100 inline-block px-4 py-2 rounded-full">
                    Powered by Gemini
                  </p>
                </div>
              </>
            );
        case 'pricing':
            return <PricingPage />;
        case 'how-it-works':
            return <HowItWorksPage onGetStarted={() => setCurrentPage('home')} />;
        case 'faq':
            return <FaqPage />;
        case 'dashboard':
            if (!user) {
                useEffect(() => { setCurrentPage('home'); }, []);
                return null;
            }
            return <DashboardPage user={user} setUser={setUser} logoHistory={logoHistory} onEditLogo={handleSelectForEditing} onUpgradePlan={() => {}} onManageSubscription={() => {}} />;
        default:
            return null;
    }
  };
  
  if (currentPage === 'home' && generationStatus === 'editing' && editingImageUrl) {
    return (
        <ThirdPartyEditor
            imageUrl={editingImageUrl}
            onBack={handleBackToResults}
        />
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-lavender/30 to-white -z-10" />
      <div className="relative z-10">
        <Header 
          onNavigate={handleNavigate}
        />
        <main className={`container mx-auto px-4 transition-all duration-300 ${
          (currentPage === 'home' && (generationStatus === 'results' || (generationStatus === 'generating' && logoVariations.length > 0))) 
          ? 'py-4' 
          : 'py-12 sm:py-20'
        }`}>
          {renderContent()}
        </main>
      </div>

    </div>
  );
};

export default App;
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import GeneratorForm from './components/GeneratorForm';
import LogoEditor from './components/LogoEditor';
import LogoGrid from './components/LogoGrid';
import PricingPage from './components/PricingPage';
import HowItWorksPage from './components/HowItWorksPage';
import FaqPage from './components/FaqPage';
import AuthModal from './components/AuthModal';
import DashboardPage from './components/dashboard/DashboardPage';
import StripeRedirectOverlay from './components/StripeRedirectOverlay';
import UpgradeSuccessModal from './components/UpgradeSuccessModal';
import { generateLogo } from './services/geminiService';
import { createCheckoutSession, createCustomerPortalSession } from './services/stripeService';
import { BrandColor, FontStyle, Industry, HistoryItem, Variation, LogoGenerationParams, ImageElement, User, LogoAsset } from './types';
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

  const [apiError, setApiError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  
  const [logoVariations, setLogoVariations] = useState<Variation[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // User and Auth State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [logoHistory, setLogoHistory] = useState<LogoAsset[]>([]);

  // Stripe State
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState(false);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);


  const handleInitialGenerate = useCallback(async () => {
    // 1. Check authentication
    if (!isAuthenticated || !user) {
        openSignupModal();
        return;
    }
    
    // 2. Check plan limits
    if (user.plan === 'free' && user.generationsUsed >= user.generationLimit) {
        setApiError(`You've reached your generation limit of ${user.generationLimit}. Please upgrade for unlimited generations.`);
        setCurrentPage('pricing');
        return;
    }

    const industryForPrompt = selectedIndustry?.name === 'Others' && customIndustry.trim() 
      ? { ...selectedIndustry, name: customIndustry.trim() } 
      : selectedIndustry;
      
    const colorsForPrompt = selectedColors.map(c => ({ name: c.name }));

    const params: LogoGenerationParams = { name: logoName, slogan, industry: industryForPrompt, colors: colorsForPrompt, fonts: selectedFonts };
    setGenerationStatus('generating');
    setApiError(null);
    setLogoVariations([]);

    try {
      const variationPrompts = [
        {...params, prompt: "A minimal and abstract icon."},
        {...params, prompt: "A detailed and illustrative icon."},
        {...params, prompt: "A modern, geometric wordmark."},
        {...params, prompt: "A classic and elegant emblem."}
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
      setUser(currentUser => currentUser ? { ...currentUser, generationsUsed: currentUser.generationsUsed + variationPrompts.length } : null);
      
      setGenerationStatus('results');

    } catch (error) {
       console.error('Logo generation failed:', error);
       setApiError('Sorry, we couldn\'t generate your logos. Please try again.');
       setGenerationStatus('idle');
    }
  }, [logoName, slogan, selectedIndustry, customIndustry, selectedColors, selectedFonts, isAuthenticated, user]);

  const handleSelectForEditing = (item: Variation | LogoAsset) => {
    const imageLayer: ImageElement = {
        id: `image-${Date.now()}`,
        type: 'image',
        src: item.imageUrl,
        x: 10, y: 10, width: 80, height: 80,
        zIndex: 0,
    };
    const fullHistoryItem: HistoryItem = {
      prompt: item.prompt,
      layers: [imageLayer],
      background: { type: 'color', value: '#FFFFFF' },
    };
    setHistory([fullHistoryItem]);
    setHistoryIndex(0);
    setGenerationStatus('editing');
    setCurrentPage('home');
  };

  const handleImageUpload = (imageUrl: string) => {
    if (!isAuthenticated) {
        openSignupModal();
        return;
    }
     const imageLayer: ImageElement = {
        id: `image-${Date.now()}`,
        type: 'image',
        src: imageUrl,
        x: 10, y: 10, width: 80, height: 80,
        zIndex: 0,
    };
    const uploadItem: HistoryItem = {
      prompt: { name: 'Uploaded Logo', slogan: '', colors: [], fonts: [], industry: null },
      layers: [imageLayer],
      background: { type: 'color', value: '#FFFFFF' },
    };
    setHistory([uploadItem]);
    setHistoryIndex(0);
    setGenerationStatus('editing');
  };

  const handleBackToResults = () => {
    if (logoVariations.length > 0) {
        setGenerationStatus('results');
    } else {
        handleStartOver();
    }
    setHistory([]);
    setHistoryIndex(-1);
  };
  
  const handleStartOver = () => {
    setLogoName('Aura');
    setSlogan('Your daily wellness');
    setSelectedIndustry(null);
    setCustomIndustry('');
    setSelectedColors([]);
    setSelectedFonts([]);
    setApiError(null);
    setHistory([]);
    setHistoryIndex(-1);
    setLogoVariations([]);
    setGenerationStatus('idle');
    setCurrentPage('home');
  };

  const handleUndo = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex - 1);
  };

  const addHistoryItem = (item: HistoryItem) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(item);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const currentHistoryItem = history[historyIndex];

  // Auth Handlers
  const handleLoginSuccess = () => {
      setIsAuthenticated(true);
      // MOCK USER DATA
      setUser({
          name: 'Alex',
          email: 'alex@example.com',
          plan: 'free',
          generationsUsed: 0,
          generationLimit: 10,
          stripeCustomerId: 'cus_mock_12345',
      });
      setIsLoginModalOpen(false);
      setIsSignupModalOpen(false);
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setUser(null);
      setCurrentPage('home');
  };

  const openLoginModal = () => {
      setIsSignupModalOpen(false);
      setIsLoginModalOpen(true);
  };

  const openSignupModal = () => {
      setIsLoginModalOpen(false);
      setIsSignupModalOpen(true);
  };
  
  const handleNavigate = (page: Page) => {
      if (page === 'home' && (generationStatus !== 'idle' || currentPage !== 'home')) {
          handleStartOver();
      } else {
          setCurrentPage(page);
      }
  };

  // Stripe Handlers
  const handleUpgradeToPro = async () => {
    if (!user) { openSignupModal(); return; }
    
    setIsRedirectingToStripe(true);
    try {
        await createCheckoutSession('pro_monthly'); // Mock API call
        // Simulate redirect and successful payment callback
        await new Promise(resolve => setTimeout(resolve, 2500));

        setUser(currentUser => currentUser ? {
            ...currentUser,
            plan: 'pro',
            generationLimit: Infinity,
            generationsUsed: 0,
        } : null);
        
        setShowUpgradeSuccess(true);
        setCurrentPage('dashboard');
    } catch (error) {
        console.error("Stripe checkout simulation failed", error);
        setApiError("Could not connect to checkout. Please try again later.");
    } finally {
        setIsRedirectingToStripe(false);
    }
  };

  const handleManageSubscription = async () => {
      if (!user?.stripeCustomerId) return;
      setIsRedirectingToStripe(true);
      try {
          const { url } = await createCustomerPortalSession(user.stripeCustomerId);
          // In a real app, this would be: window.location.href = url;
          // For the mock, we simulate by opening a blank tab.
          window.open(url, '_blank');
      } catch (error) {
          console.error("Stripe portal simulation failed", error);
          setApiError("Could not open subscription management. Please try again.");
      } finally {
          setIsRedirectingToStripe(false);
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
                  onStartOver={handleStartOver}
                  isLoading={generationStatus === 'generating'}
                  user={user}
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
                        onGenerate={handleInitialGenerate}
                        isLoading={generationStatus === 'generating'}
                        onImageUpload={handleImageUpload}
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
            return <PricingPage onUpgrade={handleUpgradeToPro} isProcessing={isRedirectingToStripe} />;
        case 'how-it-works':
            return <HowItWorksPage onGetStarted={() => setCurrentPage('home')} />;
        case 'faq':
            return <FaqPage />;
        case 'dashboard':
            if (!user) {
                useEffect(() => { setCurrentPage('home'); openLoginModal(); }, []);
                return null;
            }
            return <DashboardPage user={user} setUser={setUser} logoHistory={logoHistory} onEditLogo={handleSelectForEditing} onUpgradePlan={handleUpgradeToPro} onManageSubscription={handleManageSubscription} />;
        default:
            return null;
    }
  };
  
  if (currentPage === 'home' && generationStatus === 'editing' && currentHistoryItem) {
    return (
        <LogoEditor
            key={historyIndex}
            historyItem={currentHistoryItem}
            onStartOver={handleBackToResults}
            onUndo={handleUndo}
            canUndo={historyIndex > 0}
            onRedo={handleRedo}
            canRedo={historyIndex < history.length - 1}
            onHistoryChange={addHistoryItem}
            user={user}
        />
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-lavender/30 to-white -z-10" />
      <div className="relative z-10">
        <Header 
          onNavigate={handleNavigate}
          isAuthenticated={isAuthenticated}
          onLoginClick={openLoginModal}
          onSignupClick={openSignupModal}
          onLogoutClick={handleLogout}
        />
        <main className={`container mx-auto px-4 transition-all duration-300 ${
          (currentPage === 'home' && (generationStatus === 'results' || (generationStatus === 'generating' && logoVariations.length > 0))) 
          ? 'py-4' 
          : 'py-12 sm:py-20'
        }`}>
          {renderContent()}
        </main>
      </div>

      <AuthModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        mode="login"
        onSwitchMode={openSignupModal}
        onSuccess={handleLoginSuccess}
      />
      <AuthModal 
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        mode="signup"
        onSwitchMode={openLoginModal}
        onSuccess={handleLoginSuccess}
      />

      {isRedirectingToStripe && <StripeRedirectOverlay />}
      <UpgradeSuccessModal 
        isOpen={showUpgradeSuccess}
        onClose={() => setShowUpgradeSuccess(false)}
      />
    </div>
  );
};

export default App;
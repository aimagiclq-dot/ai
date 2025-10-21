import React from 'react';

const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0Z" fill="url(#paint0_linear_1_2)"/>
    <path d="M12 10L20 16L12 22V10Z" fill="white"/>
    <defs>
      <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8A2BE2"/>
        <stop offset="1" stopColor="#6336E4"/>
      </linearGradient>
    </defs>
  </svg>
);

interface HeaderProps {
    onNavigate: (page: 'home' | 'pricing' | 'how-it-works' | 'faq' | 'dashboard') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3">
          <LogoIcon />
          <span className="font-bold text-xl text-brand-secondary">LogoGen</span>
        </button>
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => onNavigate('how-it-works')} className="text-gray-600 hover:text-brand-primary font-medium transition-colors">How It Works</button>
          <button onClick={() => onNavigate('pricing')} className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Pricing</button>
          <button onClick={() => onNavigate('faq')} className="text-gray-600 hover:text-brand-primary font-medium transition-colors">FAQ</button>
          <div className="w-px h-6 bg-gray-200"></div>
          <button onClick={() => onNavigate('dashboard')} className="bg-brand-primary text-white font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
              My Account
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
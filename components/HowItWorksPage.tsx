import React from 'react';
import { SparklesIcon, EditIcon, DownloadIcon } from './icons';

interface HowItWorksPageProps {
    onGetStarted: () => void;
}

const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onGetStarted }) => {
    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-secondary tracking-tighter">
                    Your Dream Logo in 3 Simple Steps
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    Our AI-powered platform makes logo design intuitive, fast, and fun. Here's how to get started.
                </p>
            </div>

            <div className="mt-20 grid md:grid-cols-3 gap-12 text-center">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-20 h-20 bg-brand-lavender rounded-full mb-6">
                        <SparklesIcon className="w-10 h-10 text-brand-primary"/>
                    </div>
                    <h3 className="text-2xl font-bold text-brand-secondary mb-2">1. Input & Generate</h3>
                    <p className="text-gray-600">
                        Tell our AI about your brand—your name, industry, preferred colors, and font styles. Then, watch as it instantly generates a variety of unique logo concepts for you.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-20 h-20 bg-brand-lavender rounded-full mb-6">
                        <EditIcon className="w-10 h-10 text-brand-primary"/>
                    </div>
                    <h3 className="text-2xl font-bold text-brand-secondary mb-2">2. Customize & Refine</h3>
                    <p className="text-gray-600">
                        Choose your favorite concept and dive into our powerful editor. Tweak every detail—change colors, adjust fonts, add shapes, or remove the background until it's perfect.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-20 h-20 bg-brand-lavender rounded-full mb-6">
                        <DownloadIcon className="w-10 h-10 text-brand-primary"/>
                    </div>
                    <h3 className="text-2xl font-bold text-brand-secondary mb-2">3. Download & Launch</h3>
                    <p className="text-gray-600">
                        Export your final design in high-resolution formats, including PNG and vector SVG, ready for websites, business cards, and merchandise. Your brand is officially ready for takeoff!
                    </p>
                </div>
            </div>

            <div className="mt-20 text-center">
                 <button
                    onClick={onGetStarted}
                    className="text-white font-bold text-lg px-12 py-4 rounded-full bg-gradient-to-r from-brand-primary to-brand-light hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                >
                    Get Started Now
                </button>
            </div>
        </div>
    );
};

export default HowItWorksPage;

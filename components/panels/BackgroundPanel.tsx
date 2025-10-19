import React, { useState } from 'react';
import { Background, HistoryItem, Layer, ImageElement } from '../../types';
import { generateAiBackground } from '../../services/geminiService';
import ImageUploader from '../ImageUploader';
import { MagicIcon } from '../icons';
import Tooltip from '../Tooltip';

interface BackgroundPanelProps {
    background: Background;
    onBackgroundChange: (bg: Background) => void;
    onTransparentToggle: () => void;
    layers: Layer[];
    onHistoryChange: (item: HistoryItem) => void;
    historyItem: HistoryItem;
    isProcessing: boolean;
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    setProcessingLabel: React.Dispatch<React.SetStateAction<string>>;
}

const BackgroundPanel: React.FC<BackgroundPanelProps> = ({ 
    background, onBackgroundChange, onTransparentToggle, layers, onHistoryChange, historyItem,
    isProcessing, setIsProcessing, setProcessingLabel
}) => {
    const [bgPrompt, setBgPrompt] = useState('');
    const isTransparent = background.type === 'transparent';

    const handleProcessStart = (label: string) => {
        setProcessingLabel(label);
        setIsProcessing(true);
    };
    const handleProcessEnd = () => setIsProcessing(false);

    const handleGenerateAiBackground = async () => {
        if (!bgPrompt.trim() || isProcessing) return;
        handleProcessStart('Generating background...');
        try {
            const newImage = await generateAiBackground(layers, bgPrompt);
            const newImageLayer: ImageElement = {
                id: `image-${Date.now()}`, type: 'image', src: newImage,
                x: 0, y: 0, width: 100, height: 100, zIndex: 0,
            };
            onHistoryChange({ 
                prompt: {...historyItem.prompt, prompt: `Logo with AI background: ${bgPrompt}`},
                layers: [newImageLayer], 
                background: { type: 'color', value: '#FFFFFF'},
            });
        } catch (error) {
            console.error("AI background generation failed", error);
        } finally {
            handleProcessEnd();
        }
    };

    const handleBgUpload = (base64Url: string) => {
        onBackgroundChange({ type: 'image', value: base64Url });
    };

    const handleBgColorChange = (color: string) => {
        onBackgroundChange({ type: 'color', value: color });
    };

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
                <Tooltip content="Remove Logo Background (make transparent)">
                    <div className="flex items-center justify-between">
                        <label htmlFor="bg-toggle" className="font-bold text-gray-800 cursor-pointer">
                            Remove Background
                        </label>
                        <button
                            id="bg-toggle"
                            role="switch"
                            aria-checked={isTransparent}
                            onClick={onTransparentToggle}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
                                isTransparent ? 'bg-brand-primary' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                    isTransparent ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </Tooltip>
            </div>
            
            <div className={`space-y-6 pt-4 transition-opacity duration-300 ${isTransparent ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <div>
                    <label className="font-bold text-gray-800 mb-2 block">Solid Color</label>
                    <div className="relative h-10 w-full rounded border border-gray-300">
                        <input 
                            type="color" 
                            value={background.type === 'color' ? background.value : '#FFFFFF'} 
                            onChange={e => handleBgColorChange(e.target.value)} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div 
                            className="w-full h-full pointer-events-none"
                            style={{ backgroundColor: background.type === 'color' ? background.value : '#FFFFFF' }}
                        ></div>
                    </div>
                </div>
            
                <div>
                    <h3 className="font-bold text-gray-800 mb-2">Upload Image</h3>
                    <ImageUploader onUpload={handleBgUpload} />
                </div>

                <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><MagicIcon className="w-5 h-5"/> Generate with AI</h3>
                    <textarea
                        value={bgPrompt}
                        onChange={e => setBgPrompt(e.target.value)}
                        placeholder="e.g., a dark wood texture"
                        className="w-full h-20 p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                    <button
                        onClick={handleGenerateAiBackground}
                        disabled={!bgPrompt.trim() || isProcessing}
                        className="w-full mt-2 bg-brand-primary text-white font-semibold py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        Generate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BackgroundPanel;
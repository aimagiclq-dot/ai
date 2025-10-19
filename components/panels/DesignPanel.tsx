import React, { useState } from 'react';
import { HistoryItem, Layer, ImageElement, User } from '../../types';
import { removeBackground, vectorizeLogo, upscaleLogo, refineLogo, generateMockup, getCompositedImage } from '../../services/geminiService';
import { uploadToCanvaAndCreateDesign } from '../../services/canvaService';
import { 
    DownloadIcon, SparklesIcon, MockupIcon,
    CardIcon, TshirtIcon, WebsiteIcon, CanvaIcon
} from '../icons';
import Tooltip from '../Tooltip';

interface DesignPanelProps {
    layers: Layer[];
    historyItem: HistoryItem;
    onHistoryChange: (item: HistoryItem) => void;
    isProcessing: boolean;
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    setProcessingLabel: React.Dispatch<React.SetStateAction<string>>;
    setMockupImage: React.Dispatch<React.SetStateAction<string | null>>;
    user: User | null;
}

const DesignPanel: React.FC<DesignPanelProps> = ({
    layers, historyItem, onHistoryChange, 
    isProcessing, setIsProcessing, setProcessingLabel, setMockupImage,
    user
}) => {
    const [refinePrompt, setRefinePrompt] = useState('');
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [isCanvaConnected, setIsCanvaConnected] = useState(false);
    
    const isFreePlan = user?.plan === 'free';

    const handleProcessStart = (label: string) => {
        setProcessingLabel(label);
        setIsProcessing(true);
    }
    const handleProcessEnd = () => setIsProcessing(false);

    const handleRefine = async () => {
        if (!refinePrompt.trim() || isProcessing) return;
        handleProcessStart('Applying effect...');
        try {
            const refinedImageUrl = await refineLogo(layers, historyItem.background, refinePrompt);
            const newImageLayer: ImageElement = {
                id: `image-${Date.now()}`, type: 'image', src: refinedImageUrl,
                x: 0, y: 0, width: 100, height: 100, zIndex: 0,
            };
            onHistoryChange({ 
                prompt: { ...historyItem.prompt, prompt: refinePrompt },
                layers: [newImageLayer],
                background: { type: 'color', value: '#FFFFFF' }
            });
        } catch (error) { console.error("Refine failed", error); } 
        finally { handleProcessEnd(); }
    };

    const handleMockup = async (prompt: string, type: string) => {
        if(isProcessing) return;
        setMockupImage(null);
        handleProcessStart(`Generating ${type} mockup...`);
        try {
            const mockupUrl = await generateMockup(layers, prompt);
            setMockupImage(mockupUrl);
        } catch(error) { console.error(`Mockup (${type}) failed`, error); } 
        finally { handleProcessEnd(); }
    };

    const downloadFile = (data: string, format: 'png' | 'svg') => {
        const link = document.createElement('a');
        const fileName = `${historyItem.prompt.name.replace(/\s+/g, '_').toLowerCase()}_logo.${format}`;
        if (format === 'svg') {
            const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
            link.href = URL.createObjectURL(blob);
        } else { link.href = data; }
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (format === 'svg') URL.revokeObjectURL(link.href);
    };

    const handleExport = async (action: 'png' | 'transparent' | 'svg' | 'upscale') => {
        if (isProcessing) return;
        setDownloadError(null);
        handleProcessStart('Exporting...');
        try {
            if (action === 'png') {
                const finalImage = await getCompositedImage(layers, historyItem.background);
                downloadFile(finalImage, 'png');
            } else if (action === 'transparent') {
                const transparentUrl = await removeBackground(layers);
                downloadFile(transparentUrl, 'png');
            } else if (action === 'svg') {
                const svgCode = await vectorizeLogo(layers, historyItem.background);
                downloadFile(svgCode, 'svg');
            } else if (action === 'upscale') {
                const upscaledUrl = await upscaleLogo(layers, historyItem.background);
                const newImageLayer: ImageElement = {
                    id: `image-${Date.now()}`, type: 'image', src: upscaledUrl,
                    x: 0, y: 0, width: 100, height: 100, zIndex: 0,
                };
                 onHistoryChange({ 
                    prompt: { ...historyItem.prompt, prompt: "Upscaled to HD" },
                    layers: [newImageLayer],
                    background: { type: 'color', value: '#FFFFFF' },
                 });
            }
        } catch(error) {
            console.error(`Export failed for ${action}`, error);
            setDownloadError('An error occurred during export.');
        } finally {
            handleProcessEnd();
        }
    };

    const handleCanvaAction = async () => {
        if (isProcessing) return;
        if (!isCanvaConnected) {
            handleProcessStart('Connecting to Canva...');
            setTimeout(() => { setIsCanvaConnected(true); handleProcessEnd(); }, 1500);
            return;
        }
        handleProcessStart('Preparing for Canva...');
        try {
            const transparentLogoUrl = await removeBackground(layers);
            handleProcessStart('Sending to Canva...');
            const designUrl = await uploadToCanvaAndCreateDesign(transparentLogoUrl);
            window.open(designUrl, '_blank');
        } catch (error) {
            console.error('Failed to send to Canva:', error);
            setDownloadError('Could not send to Canva.');
        } finally {
            handleProcessEnd();
        }
    };


    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><SparklesIcon className="w-5 h-5"/> AI Quick Edit</h3>
                <textarea
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    placeholder="e.g., Make it look like a 3D chrome emblem"
                    className="w-full h-20 p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                />
                <button
                    onClick={handleRefine}
                    disabled={!refinePrompt.trim() || isProcessing}
                    className="w-full mt-2 bg-brand-primary text-white font-semibold py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    Apply
                </button>
            </div>

            <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><MockupIcon className="w-5 h-5"/> Mockups</h3>
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleMockup('a business card', 'card')} className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"><CardIcon className="w-8 h-8 text-gray-700"/> <span className="text-xs font-semibold">Card</span></button>
                    <button onClick={() => handleMockup('a black t-shirt', 'tshirt')} className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"><TshirtIcon className="w-8 h-8 text-gray-700"/> <span className="text-xs font-semibold">T-Shirt</span></button>
                    <button onClick={() => handleMockup('a modern website header', 'website')} className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"><WebsiteIcon className="w-8 h-8 text-gray-700"/> <span className="text-xs font-semibold">Website</span></button>
                </div>
            </div>

            <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><DownloadIcon className="w-5 h-5"/> Export</h3>
                <div className="space-y-2">
                    {downloadError && <p className="text-red-600 text-xs font-semibold text-center">{downloadError}</p>}
                    <button onClick={() => handleExport('png')} disabled={isProcessing} className="w-full font-semibold px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-left flex justify-between items-center disabled:opacity-50"><span>PNG (with BG)</span><DownloadIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleExport('transparent')} disabled={isProcessing} className="w-full font-semibold px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-left flex justify-between items-center disabled:opacity-50"><span>PNG (Transparent)</span><DownloadIcon className="w-5 h-5"/></button>
                    
                    <Tooltip content={isFreePlan ? 'Upgrade to Pro for SVG export' : 'Download as a scalable vector file'}>
                        <button 
                            onClick={() => handleExport('svg')} 
                            disabled={isProcessing || isFreePlan} 
                            className="w-full font-semibold px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-left flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>SVG (Vector)</span>
                            <DownloadIcon className="w-5 h-5"/>
                        </button>
                    </Tooltip>
                    
                    <button onClick={() => handleExport('upscale')} disabled={isProcessing} className="w-full font-semibold px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-left flex justify-between items-center disabled:opacity-50"><span>Upscale to HD</span><SparklesIcon className="w-5 h-5"/></button>
                    
                    <div className="!mt-4 pt-4 border-t border-gray-200">
                        <button onClick={handleCanvaAction} disabled={isProcessing} className="w-full font-semibold px-4 py-2.5 rounded-lg bg-[#00C4CC] text-white hover:opacity-90 text-left flex justify-between items-center disabled:opacity-50">
                            <span>{isCanvaConnected ? 'Send to Canva' : 'Connect to Canva'}</span>
                            <CanvaIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignPanel;

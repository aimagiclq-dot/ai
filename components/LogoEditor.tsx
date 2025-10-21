import React, { useState, useEffect, useRef } from 'react';
import { HistoryItem, Layer, TextElement, ShapeElement, ShapeType, Background, ImageElement, User } from '../types';
import { vectorizeImageToLayers, autoCropImage } from '../services/geminiService';
import { removeBackgroundWithApi } from '../services/removeBgService';

import EditorSidebar from './EditorSidebar';
import EditorPanel from './EditorPanel';
import TopToolbar from './TopToolbar';
import LoadingOverlay from './LoadingOverlay';
import DraggableText from './DraggableText';
import DraggableShape from './DraggableShape';
import DraggableImage from './DraggableImage';
import ImageDisplay from './ImageDisplay';

interface LogoEditorProps {
    historyItem: HistoryItem;
    onStartOver: () => void;
    onUndo: () => void;
    canUndo: boolean;
    onRedo: () => void;
    canRedo: boolean;
    onHistoryChange: (item: HistoryItem) => void;
    user: User | null;
}

export type ActivePanel = 'design' | 'text' | 'elements' | 'background' | 'uploads' | null;

const LogoEditor: React.FC<LogoEditorProps> = (props) => {
    const { historyItem, onHistoryChange, user } = props;
    
    const [layers, setLayers] = useState<Layer[]>(historyItem.layers);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    const [background, setBackground] = useState<Background>(historyItem.background);
    const [previousBackground, setPreviousBackground] = useState<Background>({ type: 'color', value: '#FFFFFF' });
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingLabel, setProcessingLabel] = useState('AI is thinking...');
    const [mockupImage, setMockupImage] = useState<string | null>(null);

    const [activePanel, setActivePanel] = useState<ActivePanel>('design');

    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMockupImage(null);
        setLayers(historyItem.layers);
        const currentBg = historyItem.background;
        setBackground(currentBg);
        // If the loaded background is not transparent, it becomes the new "restore" point.
        if (currentBg.type !== 'transparent') {
            setPreviousBackground(currentBg);
        }
    }, [historyItem]);
    
    const commitChangesToHistory = (newLayers: Layer[], newBackground: Background, newPromptText: string) => {
        onHistoryChange({
            prompt: { ...historyItem.prompt, prompt: newPromptText },
            layers: newLayers,
            background: newBackground,
        });
    };

    const handleBackgroundChange = (newBackground: Background) => {
        if (newBackground.type !== 'transparent') {
            setPreviousBackground(newBackground);
        }
        setBackground(newBackground);
    };

    const handleTransparentToggle = () => {
        if (background.type === 'transparent') {
            setBackground(previousBackground);
        } else {
            setPreviousBackground(background);
            setBackground({ type: 'transparent' });
        }
    };


    const selectedLayer = layers.find(l => l.id === selectedLayerId);

    const addLayer = (layer: Layer) => {
        const newLayers = [...layers, layer];
        setLayers(newLayers);
        setSelectedLayerId(layer.id);
    };

    const addTextLayer = (fontSize: number, text: string, fontWeight: 'normal' | 'bold') => {
        const newText: TextElement = {
            id: `text-${Date.now()}`,
            type: 'text',
            text,
            x: 25, y: 45, width: 50, height: 10,
            color: '#000000',
            fontSize,
            fontFamily: "'Inter', sans-serif",
            fontWeight,
            fontStyle: 'normal',
            textAlign: 'center',
            zIndex: layers.length + 1,
        };
        addLayer(newText);
    };

    const addShapeLayer = (shape: ShapeType) => {
        const newShape: ShapeElement = {
            id: `shape-${Date.now()}`,
            type: 'shape',
            shape,
            x: 35, y: 40, width: 30, height: 20,
            color: '#6336E4',
            zIndex: layers.length + 1,
        };
        addLayer(newShape);
    };

    const addImageLayer = (src: string) => {
        const newImage: ImageElement = {
            id: `image-${Date.now()}`,
            type: 'image',
            src,
            x: 25, y: 25, width: 50, height: 50,
            zIndex: layers.length + 1,
        };
        addLayer(newImage);
    };

    const updateLayer = (id: string, updates: Partial<Layer>) => {
        setLayers(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l)) as Layer[]);
    };

    const deleteLayer = (id: string) => {
        setLayers(prev => prev.filter(l => l.id !== id));
        if (selectedLayerId === id) setSelectedLayerId(null);
    };

    const moveLayer = (id: string, direction: 'front' | 'back') => {
        const currentZ = layers.find(l => l.id === id)?.zIndex;
        if (currentZ === undefined) return;

        let newZIndex: number;
        if (direction === 'front') {
            newZIndex = Math.max(...layers.map(l => l.zIndex)) + 1;
        } else {
            newZIndex = Math.min(...layers.map(l => l.zIndex)) - 1;
        }
        updateLayer(id, { zIndex: newZIndex });
    };

    const handleRemoveBg = async (layerId: string, imageSrc: string) => {
        setProcessingLabel('Removing background...');
        setIsProcessing(true);
        try {
            const transparentSrc = await removeBackgroundWithApi(imageSrc);
            // Auto-crop after removing background for a better result
            setProcessingLabel('Cropping result...');
            const croppedSrc = await autoCropImage(transparentSrc);
            const newLayers = layers.map(l => l.id === layerId ? {...l, src: croppedSrc} : l) as Layer[];
            commitChangesToHistory(newLayers, background, 'Removed background from an image');
        } catch (error) {
            console.error("Failed to remove background:", error);
            if (error instanceof Error) {
                alert(`Failed to remove background:\n${error.message}`);
            } else {
                alert('An unknown error occurred during background removal.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCrop = async (layerId: string, imageSrc: string) => {
        setProcessingLabel('Auto-cropping image...');
        setIsProcessing(true);
        try {
            const croppedSrc = await autoCropImage(imageSrc);
            const newLayers = layers.map(l => l.id === layerId ? { ...l, src: croppedSrc } : l) as Layer[];
            commitChangesToHistory(newLayers, background, 'Cropped logo to content');
        } catch (error) {
            console.error("Failed to crop image:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleVectorize = async (layerId: string, imageSrc: string) => {
        setProcessingLabel('Vectorizing logo...');
        setIsProcessing(true);
        try {
            const newVectorLayers = await vectorizeImageToLayers(imageSrc);
            const otherLayers = layers.filter(l => l.id !== layerId);
            const combinedLayers = [...otherLayers, ...newVectorLayers];
            setSelectedLayerId(null); // Deselect the old image layer
            commitChangesToHistory(combinedLayers, background, 'Vectorized logo');
        } catch (error) {
            console.error("Failed to vectorize logo:", error);
        } finally {
            setIsProcessing(false);
        }
    };


    const canvasStyles: React.CSSProperties = {};
    if (background.type === 'color') {
        canvasStyles.backgroundColor = background.value;
    } else if (background.type === 'image') {
        canvasStyles.backgroundImage = `url(${background.value})`;
        canvasStyles.backgroundSize = 'cover';
        canvasStyles.backgroundPosition = 'center';
    }
    
    const isGeneratingMockup = isProcessing && processingLabel.includes('mockup');

    return (
        <div className="w-full h-screen bg-gray-100 flex flex-col animate-fade-in-down">
            <header className="bg-white h-[60px] flex-shrink-0 border-b border-gray-200 flex items-center justify-between px-4 z-20">
                <button onClick={props.onStartOver} className="font-semibold text-brand-primary hover:underline">&larr; Back to Results</button>
                <div className="flex-grow text-center">
                    <span className="font-semibold text-gray-700 truncate">{historyItem.prompt.name}</span>
                </div>
                 <div className="w-40 flex justify-end">
                    {/* Placeholder for future actions like Share or Download */}
                 </div>
            </header>
            
            <div className="flex flex-grow overflow-hidden">
                <EditorSidebar activePanel={activePanel} setActivePanel={setActivePanel} />
                
                {activePanel && (
                    <EditorPanel
                        activePanel={activePanel}
                        setActivePanel={setActivePanel}
                        layers={layers}
                        background={background}
                        onBackgroundChange={handleBackgroundChange}
                        onTransparentToggle={handleTransparentToggle}
                        onAddText={addTextLayer}
                        onAddShape={addShapeLayer}
                        onAddImage={addImageLayer}
                        onHistoryChange={onHistoryChange}
                        historyItem={historyItem}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                        setProcessingLabel={setProcessingLabel}
                        setMockupImage={setMockupImage}
                        user={user}
                    />
                )}

                <main className="flex-grow flex flex-col items-center justify-center p-8 overflow-auto">
                   <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        {selectedLayer && selectedLayer.type !== 'image' && (
                            <TopToolbar
                                selectedLayer={selectedLayer}
                                onUpdateLayer={updateLayer}
                                onDeleteLayer={deleteLayer}
                                onMoveLayer={moveLayer}
                            />
                        )}

                        <div ref={canvasRef} className="relative w-full max-w-[800px] aspect-square bg-white shadow-md rounded-lg flex items-center justify-center transition-colors overflow-hidden" style={canvasStyles} onClick={() => setSelectedLayerId(null)}>
                            {background.type === 'transparent' && <div className="absolute inset-0 checkerboard z-0"></div>}
                            <div className="relative w-full h-full">
                                {[...layers].sort((a,b) => a.zIndex - b.zIndex).map(layer => {
                                    if (layer.type === 'text') {
                                        return <DraggableText key={layer.id} element={layer} canvasRef={canvasRef} isSelected={layer.id === selectedLayerId} onSelect={() => setSelectedLayerId(layer.id)} onUpdate={(updates) => updateLayer(layer.id, updates)} />
                                    }
                                    if (layer.type === 'shape') {
                                        return <DraggableShape key={layer.id} element={layer} canvasRef={canvasRef} isSelected={layer.id === selectedLayerId} onSelect={() => setSelectedLayerId(layer.id)} onUpdate={(updates) => updateLayer(layer.id, updates)} />
                                    }
                                    if (layer.type === 'image') {
                                        return <DraggableImage 
                                            key={layer.id} 
                                            element={layer} 
                                            canvasRef={canvasRef} 
                                            isSelected={layer.id === selectedLayerId} 
                                            onSelect={() => setSelectedLayerId(layer.id)} 
                                            onUpdate={(updates) => updateLayer(layer.id, updates)}
                                            onRemoveBg={() => handleRemoveBg(layer.id, layer.src)}
                                            onCrop={() => handleCrop(layer.id, layer.src)}
                                            onVectorize={() => handleVectorize(layer.id, layer.src)}
                                            isProcessing={isProcessing}
                                            />
                                    }
                                    return null;
                                })}
                            </div>
                            {isProcessing && !isGeneratingMockup && <LoadingOverlay label={processingLabel}/>}
                        </div>
                        
                        { (mockupImage || isGeneratingMockup) && (
                            <div className="relative w-full max-w-[800px] aspect-square bg-white shadow-md rounded-lg flex items-center justify-center p-4 animate-fade-in">
                                {mockupImage && <ImageDisplay imageUrl={mockupImage} />}
                                {isGeneratingMockup && <LoadingOverlay label={processingLabel} />}
                            </div>
                        )}
                   </div>
                </main>
            </div>
        </div>
    );
};

export default LogoEditor;
import React from 'react';
import { ActivePanel } from './LogoEditor';
import { Background, HistoryItem, Layer, ShapeType, User } from '../types';

import DesignPanel from './panels/DesignPanel';
import TextPanel from './panels/TextPanel';
import ElementsPanel from './panels/ElementsPanel';
import BackgroundPanel from './panels/BackgroundPanel';
import UploadsPanel from './panels/UploadsPanel';

interface EditorPanelProps {
    activePanel: ActivePanel;
    setActivePanel: (panel: ActivePanel | null) => void;
    // Layer props
    layers: Layer[];
    onAddText: (fontSize: number, text: string, fontWeight: 'normal' | 'bold') => void;
    onAddShape: (shape: ShapeType) => void;
    onAddImage: (src: string) => void;
    // Background props
    background: Background;
    onBackgroundChange: (bg: Background) => void;
    onTransparentToggle: () => void;
    // AI & History props
    onHistoryChange: (item: HistoryItem) => void;
    historyItem: HistoryItem;
    isProcessing: boolean;
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    setProcessingLabel: React.Dispatch<React.SetStateAction<string>>;
    setMockupImage: React.Dispatch<React.SetStateAction<string | null>>;
    user: User | null;
}

const panelTitles: Record<NonNullable<ActivePanel>, string> = {
    design: 'Design & Export',
    elements: 'Elements',
    text: 'Text',
    background: 'Background',
    uploads: 'Uploads',
};

const EditorPanel: React.FC<EditorPanelProps> = (props) => {
    const { activePanel, setActivePanel } = props;

    if (!activePanel) return null;

    const renderPanelContent = () => {
        switch (activePanel) {
            case 'design': return <DesignPanel {...props} />;
            case 'text': return <TextPanel onAddText={props.onAddText} />;
            case 'elements': return <ElementsPanel onAddShape={props.onAddShape} />;
            case 'background': return <BackgroundPanel
                                        background={props.background}
                                        onBackgroundChange={props.onBackgroundChange}
                                        onTransparentToggle={props.onTransparentToggle}
                                        layers={props.layers}
                                        onHistoryChange={props.onHistoryChange}
                                        historyItem={props.historyItem}
                                        isProcessing={props.isProcessing}
                                        setIsProcessing={props.setIsProcessing}
                                        setProcessingLabel={props.setProcessingLabel}
                                      />;
            case 'uploads': return <UploadsPanel onAddImage={props.onAddImage} />;
            default: return null;
        }
    };

    return (
        <aside className="w-[320px] bg-white flex-shrink-0 border-r border-gray-200 flex flex-col animate-fade-in-down z-10">
            <div className="h-[60px] flex-shrink-0 flex items-center justify-between px-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-brand-secondary">{panelTitles[activePanel]}</h2>
                <button onClick={() => setActivePanel(null)} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
                {renderPanelContent()}
            </div>
        </aside>
    );
};

export default EditorPanel;

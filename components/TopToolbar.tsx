import React from 'react';
import { Layer, TextElement } from '../types';
import { fontStyles } from './data';
import { TrashIcon, TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from './icons';
import Tooltip from './Tooltip';


interface TopToolbarProps {
    selectedLayer: Layer;
    onUpdateLayer: (id: string, updates: Partial<Layer>) => void;
    onDeleteLayer: (id: string) => void;
    onMoveLayer: (id: string, direction: 'front' | 'back') => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({ selectedLayer, onUpdateLayer, onDeleteLayer, onMoveLayer }) => {
    
    const handleTextUpdate = (prop: keyof TextElement, value: any) => {
        onUpdateLayer(selectedLayer.id, { [prop]: value });
    };
    
    const toggleStyle = (style: 'bold' | 'italic') => {
        if (selectedLayer?.type !== 'text') return;
        const prop = style === 'bold' ? 'fontWeight' : 'fontStyle';
        const currentValue = selectedLayer[prop];
        const newValue = currentValue === 'normal' ? (style === 'bold' ? 'bold' : 'italic') : 'normal';
        handleTextUpdate(prop, newValue);
    };

    const isText = selectedLayer.type === 'text';
    const isShape = selectedLayer.type === 'shape';

    return (
        <div className="h-[50px] bg-white rounded-lg shadow-md mb-4 flex items-center px-3 gap-2 animate-fade-in-down">
            {/* Text-specific controls */}
            {isText && (
                <>
                    <select value={selectedLayer.fontFamily} onChange={e => handleTextUpdate('fontFamily', e.target.value)} className="text-sm px-2 py-1 rounded-md border-gray-300 shadow-sm focus:ring-brand-primary focus:border-brand-primary">
                        {fontStyles.map(f => <option key={f.name} value={f.family}>{f.name}</option>)}
                    </select>

                    <input type="number" value={selectedLayer.fontSize} onChange={e => handleTextUpdate('fontSize', parseInt(e.target.value) || 12)} className="w-20 text-sm px-2 py-1 rounded-md border-gray-300 shadow-sm focus:ring-brand-primary focus:border-brand-primary"/>
                    
                    <div className="relative w-8 h-8">
                        <input type="color" value={selectedLayer.color} onChange={e => handleTextUpdate('color', e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="w-full h-full rounded border border-gray-300 pointer-events-none" style={{ backgroundColor: selectedLayer.color }}></div>
                    </div>

                    <div className="flex items-center gap-1 rounded-md bg-gray-100 p-0.5">
                        <button onClick={() => toggleStyle('bold')} className={`px-2 py-1 rounded ${selectedLayer.fontWeight === 'bold' ? 'bg-white shadow' : ''}`}><strong>B</strong></button>
                        <button onClick={() => toggleStyle('italic')} className={`px-2 py-1 rounded ${selectedLayer.fontStyle === 'italic' ? 'bg-white shadow' : ''}`}><em>I</em></button>
                    </div>

                    <div className="flex items-center gap-1 rounded-md bg-gray-100 p-0.5">
                        <button onClick={() => handleTextUpdate('textAlign', 'left')} className={`p-1.5 rounded ${selectedLayer.textAlign === 'left' ? 'bg-white shadow' : ''}`}><TextAlignLeftIcon className="w-5 h-5"/></button>
                        <button onClick={() => handleTextUpdate('textAlign', 'center')} className={`p-1.5 rounded ${selectedLayer.textAlign === 'center' ? 'bg-white shadow' : ''}`}><TextAlignCenterIcon className="w-5 h-5"/></button>
                        <button onClick={() => handleTextUpdate('textAlign', 'right')} className={`p-1.5 rounded ${selectedLayer.textAlign === 'right' ? 'bg-white shadow' : ''}`}><TextAlignRightIcon className="w-5 h-5"/></button>
                    </div>
                </>
            )}

            {/* Shape-specific controls */}
            {isShape && (
                <>
                    <label className="text-sm font-semibold">Color:</label>
                    <div className="relative w-8 h-8">
                        <input type="color" value={selectedLayer.color} onChange={e => onUpdateLayer(selectedLayer.id, { color: e.target.value })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="w-full h-full rounded border border-gray-300 pointer-events-none" style={{ backgroundColor: selectedLayer.color }}></div>
                    </div>
                </>
            )}
            
            <div className="flex-grow"></div>

            <Tooltip content="Delete Layer">
                <button onClick={() => onDeleteLayer(selectedLayer.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-md"><TrashIcon className="w-5 h-5"/></button>
            </Tooltip>
        </div>
    );
};

export default TopToolbar;
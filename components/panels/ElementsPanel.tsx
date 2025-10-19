import React from 'react';
import { ShapeType } from '../../types';
import { SquareIcon, CircleIcon } from '../icons';

interface ElementsPanelProps {
    onAddShape: (shape: ShapeType) => void;
}

const ElementsPanel: React.FC<ElementsPanelProps> = ({ onAddShape }) => {
    return (
        <div>
            <h3 className="font-bold text-gray-800 mb-2">Shapes</h3>
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => onAddShape('rectangle')} className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors aspect-square">
                    <SquareIcon className="w-10 h-10 text-gray-700"/>
                    <span className="text-xs font-semibold">Rectangle</span>
                </button>
                <button onClick={() => onAddShape('circle')} className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors aspect-square">
                    <CircleIcon className="w-10 h-10 text-gray-700"/>
                    <span className="text-xs font-semibold">Circle</span>
                </button>
            </div>
        </div>
    );
};

export default ElementsPanel;

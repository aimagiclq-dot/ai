import React from 'react';

interface TextPanelProps {
    onAddText: (fontSize: number, text: string, fontWeight: 'normal' | 'bold') => void;
}

const TextPanel: React.FC<TextPanelProps> = ({ onAddText }) => {
    return (
        <div className="space-y-4">
            <button
                onClick={() => onAddText(48, 'Heading', 'bold')}
                className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <span className="text-2xl font-bold">Add a heading</span>
            </button>
            <button
                onClick={() => onAddText(28, 'Subheading', 'bold')}
                className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <span className="text-xl font-semibold">Add a subheading</span>
            </button>
            <button
                onClick={() => onAddText(16, 'A little bit of body text', 'normal')}
                className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <span className="text-base">Add a little bit of body text</span>
            </button>
        </div>
    );
};

export default TextPanel;

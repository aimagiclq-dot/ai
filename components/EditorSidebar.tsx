import React from 'react';
import { ActivePanel } from './LogoEditor';
import { SparklesIcon, TextIcon, ShapesIcon, PaletteIcon, UploadIcon } from './icons';
import Tooltip from './Tooltip';

interface EditorSidebarProps {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
}

const sidebarItems = [
    { id: 'design', icon: SparklesIcon, label: 'Design' },
    { id: 'elements', icon: ShapesIcon, label: 'Elements' },
    { id: 'text', icon: TextIcon, label: 'Text' },
    { id: 'background', icon: PaletteIcon, label: 'Background' },
    { id: 'uploads', icon: UploadIcon, label: 'Uploads' },
] as const;


const EditorSidebar: React.FC<EditorSidebarProps> = ({ activePanel, setActivePanel }) => {

  const handlePanelToggle = (panelId: ActivePanel) => {
    if (activePanel === panelId) {
      setActivePanel(null); // Close panel if clicking the active one
    } else {
      setActivePanel(panelId);
    }
  };

  return (
    <nav className="w-[80px] bg-[#18191a] text-white flex-shrink-0 flex flex-col items-center py-4 z-10">
        <div className="flex flex-col items-center gap-2">
            {sidebarItems.map(item => (
                <Tooltip key={item.id} content={item.label}>
                    <button
                        onClick={() => handlePanelToggle(item.id)}
                        className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                            activePanel === item.id ? 'bg-[#3a3b3c]' : 'hover:bg-[#242526]'
                        }`}
                        aria-label={item.label}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs font-medium">{item.label}</span>
                    </button>
                </Tooltip>
            ))}
        </div>
    </nav>
  );
};

export default EditorSidebar;

import React, { useEffect, useRef } from 'react';
import { DownloadIcon } from './icons';

interface ThirdPartyEditorProps {
  imageUrl: string;
  onBack: () => void;
}

// Define a custom theme for the editor to match our app's style
const customTheme = {
  'common.bi.image': '', // Path to a BI image, can be empty
  'common.bisize.width': '0px',
  'common.bisize.height': '0px',
  'common.backgroundColor': '#f8f9fa',
  'header.backgroundImage': 'none',
  'header.backgroundColor': 'white',
  'header.border': '0px',
  'loadButton.backgroundColor': '#fff',
  'loadButton.border': '1px solid #ddd',
  'loadButton.color': '#222',
  'downloadButton.backgroundColor': '#6336E4',
  'downloadButton.border': '1px solid #6336E4',
  'downloadButton.color': '#fff',
  'menu.normalIcon.color': '#8a8a8a',
  'menu.activeIcon.color': '#555555',
  'menu.disabledIcon.color': '#434343',
  'menu.hoverIcon.color': '#e9e9e9',
  'submenu.normalIcon.color': '#8a8a8a',
  'submenu.activeIcon.color': '#555555',
};


const ThirdPartyEditor: React.FC<ThirdPartyEditorProps> = ({ imageUrl, onBack }) => {
  const editorRef = useRef<any>(null); // To hold the editor instance
  const containerRef = useRef<HTMLDivElement>(null); // To mount the editor

  useEffect(() => {
    // Dynamically check if the TUI library is loaded
    if (!(window as any).tui || !(window as any).tui.ImageEditor) {
      console.error("TUI Image Editor library not loaded!");
      return;
    }

    // Ensure the container is available
    if (!containerRef.current) return;

    // Destroy any existing editor instance before creating a new one
    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    // Initialize the TUI Image Editor
    const editorInstance = new (window as any).tui.ImageEditor(containerRef.current, {
      includeUI: {
        loadImage: {
          path: imageUrl,
          name: 'logo',
        },
        theme: customTheme,
        menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
        initMenu: 'filter',
        uiSize: {
          width: '100%',
          height: '100%',
        },
        menuBarPosition: 'bottom',
      },
      cssMaxWidth: 800,
      cssMaxHeight: 600,
      selectionStyle: {
        cornerStyle: 'circle',
        cornerSize: 10,
        cornerColor: '#6336E4',
        cornerStrokeColor: 'white',
        transparentCorners: false,
        lineWidth: 2,
        borderColor: '#6336E4'
      },
    });

    editorRef.current = editorInstance;

    // Cleanup on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [imageUrl]); // Rerun effect if imageUrl changes

  const handleDownload = () => {
    if (editorRef.current) {
      const dataURL = editorRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = `edited-logo-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col animate-fade-in">
        <header className="bg-white h-[60px] flex-shrink-0 border-b border-gray-200 flex items-center justify-between px-4 z-20">
            <button onClick={onBack} className="font-semibold text-brand-primary hover:underline">&larr; Back to Results</button>
            <div className="flex-grow text-center">
                <span className="font-semibold text-gray-700 truncate">Editing Logo</span>
            </div>
             <div className="w-40 flex justify-end">
                <button
                    onClick={handleDownload}
                    className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download
                </button>
             </div>
        </header>
        <main className="flex-grow flex items-center justify-center p-4">
             {/* This container is where the TUI Image Editor will be mounted */}
            <div ref={containerRef} className="w-full h-full" style={{minHeight: '80vh'}}></div>
        </main>
    </div>
  );
};

export default ThirdPartyEditor;

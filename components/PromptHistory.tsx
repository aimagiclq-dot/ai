import React from 'react';

interface PromptHistoryProps {
  history: string[];
  onClose: () => void;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ history, onClose }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl p-4 border animate-fade-in-down z-20">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg text-brand-secondary">History</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {history.slice().reverse().map((imageUrl, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <img src={imageUrl} alt={`Version ${history.length - index}`} className="w-12 h-12 rounded-md bg-gray-200 object-contain" />
            <span className="font-semibold text-gray-700">Version {history.length - index}</span>
          </div>
        ))}
         {history.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No history yet.</p>}
      </div>
    </div>
  );
};

export default PromptHistory;
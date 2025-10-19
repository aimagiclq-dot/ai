import React from 'react';
import { LoadingRobotIcon } from './icons';

interface LoadingOverlayProps {
  label?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ label = 'AI is thinking...' }) => {
  return (
    <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20">
      <LoadingRobotIcon className="w-24 h-24 text-brand-primary" />
      <h3 className="mt-4 text-xl font-bold text-brand-secondary">{label}</h3>
      <p className="text-gray-600">This may take a moment.</p>
    </div>
  );
};

export default LoadingOverlay;

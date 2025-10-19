import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-12 w-12',
  };

  const borderClasses = {
    sm: 'border-2',
    md: 'border-2',
    lg: 'border-4',
  }

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} ${borderClasses[size]} border-brand-primary border-t-transparent mr-2`}
      role="status"
    >
        <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;

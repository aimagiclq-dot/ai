import React from 'react';

const MockupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M8 21V3" />
        <path d="M16 3v18" />
        <path d="M3 8h18" />
        <path d="M3 16h18" />
    </svg>
);
export default MockupIcon;
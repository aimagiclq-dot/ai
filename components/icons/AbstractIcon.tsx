import React from 'react';

const AbstractIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 6c6 0 10 4 15 4s6-4 6-4" />
        <path d="M3 18c6 0 10-4 15-4s6 4 6 4" />
    </svg>
);
export default AbstractIcon;

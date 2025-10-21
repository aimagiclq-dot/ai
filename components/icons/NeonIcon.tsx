import React from 'react';

const NeonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 12h3M18 12h3M12 3v3M12 18v3" />
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);
export default NeonIcon;

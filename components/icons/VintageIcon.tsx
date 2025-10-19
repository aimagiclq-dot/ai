import React from 'react';

const VintageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l2 2" />
        <path d="M8.5 4.5l-1-1" />
        <path d="M16.5 4.5l1-1" />
    </svg>
);
export default VintageIcon;

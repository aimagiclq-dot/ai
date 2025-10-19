import React from 'react';

const ShapesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M22 12h-4" />
        <path d="M2 12h4" />
        <path d="M12 2v4" />
        <path d="M12 22v-4" />
    </svg>
);
export default ShapesIcon;
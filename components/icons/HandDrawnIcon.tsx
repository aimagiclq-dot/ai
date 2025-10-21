import React from 'react';

const HandDrawnIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 3l4 4L7 21l-4-4L17 3z" />
        <path d="M16 4l-1 1" />
    </svg>
);
export default HandDrawnIcon;

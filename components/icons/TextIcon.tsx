import React from 'react';

const TextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14 3v18" />
        <path d="M7 3h10" />
        <path d="M7 21h10" />
    </svg>
);
export default TextIcon;
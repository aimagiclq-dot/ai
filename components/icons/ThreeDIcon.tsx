import React from 'react';

const ThreeDIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m21 17.8-8-4.8-8 4.8"/>
        <path d="m21 8.2-8-4.8-8 4.8"/>
        <path d="M3 13v-5l8-4.8 8 4.8v5L13 18Z"/>
        <path d="m13 18 8-4.8"/>
    </svg>
);
export default ThreeDIcon;

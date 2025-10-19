import React from 'react';

const WebsiteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M2 8h20" />
        <path d="M5 5h2" />
        <path d="M9 5h2" />
    </svg>
);
export default WebsiteIcon;
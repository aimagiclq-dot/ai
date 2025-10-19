import React from 'react';

const GeometricIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <rect x="7" y="7" width="10" height="10" />
    </svg>
);
export default GeometricIcon;

import React from 'react';
const AutomotiveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 17h2v-5h-2v5zM5 17h2v-5H5v5z" />
    <path d="M12 17V6.5m0 0L8.5 10m3.5-3.5L15.5 10M12 6.5V3" />
    <path d="M17 17a2 2 0 1 0 4 0h-4zM3 17a2 2 0 1 0 4 0H3z" />
  </svg>
);
export default AutomotiveIcon;

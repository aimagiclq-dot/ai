import React from 'react';
const SportsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 0-10 10h20A10 10 0 0 0 12 2z" />
    <path d="M12 22a10 10 0 0 1-10-10h20a10 10 0 0 1-10 10z" />
  </svg>
);
export default SportsIcon;

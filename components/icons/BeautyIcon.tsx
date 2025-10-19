import React from 'react';
const BeautyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9z" />
    <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M12 15c-2.48 0-4.5 2.02-4.5 4.5" />
    <path d="M12 15c2.48 0 4.5 2.02 4.5 4.5" />
  </svg>
);
export default BeautyIcon;

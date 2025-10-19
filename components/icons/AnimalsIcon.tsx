import React from 'react';
const AnimalsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 14s-3.5-3-3.5-5a3.5 3.5 0 1 1 7 0c0 2-3.5 5-3.5 5z" />
    <path d="M12 3c-4.418 0-8 3.582-8 8a9.4 9.4 0 0 0 1.5 5L2 22l5.5-3.5A8.5 8.5 0 0 0 12 19c4.418 0 8-3.582 8-8s-3.582-8-8-8z" />
  </svg>
);
export default AnimalsIcon;

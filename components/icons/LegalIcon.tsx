import React from 'react';
const LegalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3v18M5 12h14" />
    <path d="M5 6l7 6 7-6" />
    <path d="M5 18l7-6 7 6" />
  </svg>
);
export default LegalIcon;

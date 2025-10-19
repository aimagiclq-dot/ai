import React from 'react';

const CheckerboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 3h18v18H3z" />
    <path d="M3 12h18M12 3v18" fill="#fff" />
  </svg>
);

export default CheckerboardIcon;
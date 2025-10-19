import React from 'react';
const RestaurantIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 3v18h18" />
    <path d="M7 14s-1.5 2.5-3 2.5-1.5-2.5-1.5-2.5" />
    <path d="M12 14s-1.5 2.5-3 2.5S7.5 14 7.5 14" />
    <path d="M17 14s-1.5 2.5-3 2.5-1.5-2.5-1.5-2.5" />
    <path d="M22 14s-1.5 2.5-3 2.5-1.5-2.5-1.5-2.5" />
  </svg>
);
export default RestaurantIcon;

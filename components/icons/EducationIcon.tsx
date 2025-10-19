import React from 'react';
const EducationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 10v6M2 10v6" />
    <path d="M12 2v20" />
    <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
    <path d="M4 6l8 4 8-4" />
  </svg>
);
export default EducationIcon;

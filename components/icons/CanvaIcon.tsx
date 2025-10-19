import React from 'react';

const CanvaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm4.23-7.222c-.38.214-.84.214-1.222 0l-3.008-1.68v3.36c0 .466-.38.843-.844.843s-.844-.377-.844-.844V8.54c0-.466.38-.844.844-.844s.844.378.844.844v3.36l3.008-1.68c.38-.214.84-.214 1.222 0 .38.213.633.604.633 1.026s-.252.813-.633 1.026z"
        />
    </svg>
);

export default CanvaIcon;

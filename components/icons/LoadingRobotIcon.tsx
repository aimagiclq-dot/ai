import React from 'react';

const LoadingRobotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <style>
        {`
            .eye { animation: blink 2s infinite; }
            @keyframes blink { 50% { opacity: 0; } }
            .arm { animation: wave 1.5s infinite alternate; transform-origin: 25px 55px; }
            @keyframes wave { to { transform: rotate(-20deg); } }
        `}
        </style>
        {/* Head */}
        <rect x="30" y="20" width="40" height="30" rx="5" fill="#DDD6F5"/>
        <rect x="35" y="18" width="5" height="10" fill="#8a63f5"/>
        {/* Eyes */}
        <circle cx="45" cy="35" r="4" fill="white" className="eye" />
        <circle cx="65" cy="35" r="4" fill="white" className="eye" />
        <circle cx="45" cy="35" r="2" fill="#3D1F68" className="eye" />
        <circle cx="65" cy="35" r="2" fill="#3D1F68" className="eye" />
        {/* Body */}
        <rect x="20" y="50" width="60" height="40" rx="5" fill="#6336E4"/>
        {/* Arms */}
        <rect x="10" y="55" width="10" height="25" rx="5" fill="#8a63f5" className="arm"/>
        <rect x="80" y="55" width="10" height="25" rx="5" fill="#8a63f5"/>
    </svg>
);

export default LoadingRobotIcon;

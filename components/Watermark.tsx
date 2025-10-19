import React from 'react';

const Watermark: React.FC = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-black/10 transform -rotate-12 select-none">
                LogoGen
            </span>
        </div>
    );
};

export default Watermark;

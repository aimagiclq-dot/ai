import React from 'react';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute w-2 h-4 rounded-sm animate-fall shadow-md" style={style}></div>
);

const Confetti: React.FC = () => {
  const confettiCount = 150; // Increased for a fuller effect
  const colors = ['#6336E4', '#00c4cc', '#7d2ae8', '#8a63f5', '#FFD700', '#FF69B4']; // Added more party colors

  const pieces = Array.from({ length: confettiCount }).map((_, i) => {
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${3 + Math.random() * 4}s`,
      animationDelay: `${Math.random() * 2}s`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      transform: `rotate(${Math.random() * 360}deg)`, 
      opacity: Math.random() * 0.75 + 0.25,
    };
    return <ConfettiPiece key={i} style={style} />;
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces}
    </div>
  );
};

export default Confetti;
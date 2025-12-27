'use client';

import { useState, useEffect } from 'react';

interface WorldTravelAnimationProps {
  onComplete: () => void;
}

export function WorldTravelAnimation({ onComplete }: WorldTravelAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show logo for 3 seconds, then fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-brand-blue1 via-brand-orange to-brand-yellow1 animate-fade-in">
      <div className="text-center animate-scale-in">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 drop-shadow-2xl animate-gentle-pulse">
          SoloSheThings
        </h1>
        <p className="text-2xl md:text-3xl text-white/90 drop-shadow-lg">
          Safe Travels for Solo Female Travelers
        </p>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { WorldTravelAnimation } from './world-travel-animation';

interface AnimationWrapperProps {
  children: React.ReactNode;
}

export function AnimationWrapper({ children }: AnimationWrapperProps) {
  const [showAnimation, setShowAnimation] = useState(true);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  if (showAnimation) {
    return <WorldTravelAnimation onComplete={handleAnimationComplete} />;
  }

  return <>{children}</>;
}


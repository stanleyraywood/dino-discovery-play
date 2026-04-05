import React, { useState, useEffect, useRef } from 'react';

interface Props {
  screen: string;
  children: React.ReactNode;
}

export const ScreenTransition: React.FC<Props> = ({ screen, children }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);
  const prevScreen = useRef(screen);

  useEffect(() => {
    if (screen !== prevScreen.current) {
      setTransitioning(true);
      // Fade out, then swap, then fade in
      const t = setTimeout(() => {
        setDisplayChildren(children);
        setTransitioning(false);
        prevScreen.current = screen;
      }, 200);
      return () => clearTimeout(t);
    } else {
      setDisplayChildren(children);
    }
  }, [screen, children]);

  return (
    <div
      className={`transition-all duration-200 ${
        transitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
      }`}
    >
      {displayChildren}
    </div>
  );
};

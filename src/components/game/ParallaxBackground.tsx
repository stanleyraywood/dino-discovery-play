import React, { useState, useEffect } from 'react';

interface Props {
  speed: number;
  elapsed: number;
}

// Background events that make the world feel alive
const useBackgroundEvents = (elapsed: number) => {
  const [events, setEvents] = useState<{ type: string; id: number }[]>([]);
  const lastEventRef = React.useRef(0);
  const eventIdRef = React.useRef(0);

  useEffect(() => {
    const interval = 10000 + Math.random() * 5000; // 10-15s
    if (elapsed - lastEventRef.current > interval) {
      lastEventRef.current = elapsed;
      const types = ['shootingstar', 'volcanopuff', 'herd'];
      const type = types[Math.floor(Math.random() * types.length)];
      const id = eventIdRef.current++;
      setEvents(prev => [...prev, { type, id }]);
      // Remove after animation
      setTimeout(() => setEvents(prev => prev.filter(e => e.id !== id)), 4000);
    }
  }, [elapsed]);

  return events;
};

export const ParallaxBackground: React.FC<Props> = ({ speed, elapsed }) => {
  const events = useBackgroundEvents(elapsed);

  // Animation duration inversely proportional to speed — faster speed = faster scroll
  const baseDuration = Math.max(2, 40 / Math.max(speed, 0.5));

  return (
    <>
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3B8BD4] via-[#6BAED6] to-[#8DC5E3]" />

      {/* Sun */}
      <div className="absolute top-[8%] right-[15%]">
        <div className="w-16 h-16 rounded-full bg-yellow-200 shadow-[0_0_40px_20px_rgba(255,255,150,0.3)]" />
      </div>

      {/* Far clouds — CSS animation, seamless loop */}
      <div className="absolute top-[5%] w-full h-[15%] overflow-hidden">
        <div className="parallax-scroll" style={{ animationDuration: `${baseDuration * 12}s` }}>
          <svg width="200%" height="80" viewBox="0 0 2000 80" className="opacity-40" preserveAspectRatio="none">
            <ellipse cx="100" cy="40" rx="70" ry="25" fill="white" />
            <ellipse cx="130" cy="35" rx="50" ry="20" fill="white" />
            <ellipse cx="400" cy="50" rx="60" ry="20" fill="white" />
            <ellipse cx="650" cy="35" rx="80" ry="28" fill="white" />
            <ellipse cx="900" cy="45" rx="65" ry="22" fill="white" />
            {/* Repeat for seamless loop */}
            <ellipse cx="1100" cy="40" rx="70" ry="25" fill="white" />
            <ellipse cx="1130" cy="35" rx="50" ry="20" fill="white" />
            <ellipse cx="1400" cy="50" rx="60" ry="20" fill="white" />
            <ellipse cx="1650" cy="35" rx="80" ry="28" fill="white" />
            <ellipse cx="1900" cy="45" rx="65" ry="22" fill="white" />
          </svg>
        </div>
      </div>

      {/* Near clouds */}
      <div className="absolute top-[14%] w-full h-[12%] overflow-hidden">
        <div className="parallax-scroll" style={{ animationDuration: `${baseDuration * 8}s` }}>
          <svg width="200%" height="60" viewBox="0 0 2000 60" className="opacity-50" preserveAspectRatio="none">
            <ellipse cx="150" cy="30" rx="90" ry="28" fill="white" />
            <ellipse cx="500" cy="35" rx="75" ry="25" fill="white" />
            <ellipse cx="850" cy="28" rx="85" ry="26" fill="white" />
            <ellipse cx="1150" cy="30" rx="90" ry="28" fill="white" />
            <ellipse cx="1500" cy="35" rx="75" ry="25" fill="white" />
            <ellipse cx="1850" cy="28" rx="85" ry="26" fill="white" />
          </svg>
        </div>
      </div>

      {/* Far mountains — very slow */}
      <div className="absolute bottom-[25%] w-full overflow-hidden">
        <div className="parallax-scroll" style={{ animationDuration: `${baseDuration * 15}s` }}>
          <svg width="200%" height="120" viewBox="0 0 2000 120" preserveAspectRatio="none" className="opacity-40">
            <path d="M0 120 L80 40 L160 80 L280 20 L400 60 L520 15 L640 50 L760 30 L880 70 L1000 40 L1080 80 L1200 20 L1320 60 L1440 15 L1560 50 L1680 30 L1800 70 L2000 40 L2000 120 Z" fill="#5A8A5A" />
          </svg>
        </div>
      </div>

      {/* Volcano — static, no jitter */}
      <div className="absolute bottom-[25%] right-[12%]">
        <svg width="100" height="85" viewBox="0 0 120 100">
          <path d="M20 100 L50 20 Q60 5 70 20 L100 100 Z" fill="#8B7355" />
          <path d="M52 22 Q60 10 68 22" fill="#FF6B35" opacity="0.7" />
          <ellipse cx="60" cy="8" rx="6" ry="4" fill="#FF4500" opacity="0.3" />
        </svg>
      </div>

      {/* Near mountains */}
      <div className="absolute bottom-[25%] w-full overflow-hidden">
        <div className="parallax-scroll" style={{ animationDuration: `${baseDuration * 10}s` }}>
          <svg width="200%" height="80" viewBox="0 0 2000 80" preserveAspectRatio="none" className="opacity-50">
            <path d="M0 80 L100 30 L200 50 L350 10 L500 40 L600 20 L750 55 L900 15 L1000 45 L1100 30 L1200 50 L1350 10 L1500 40 L1600 20 L1750 55 L1900 15 L2000 40 L2000 80 Z" fill="#6B9B5B" />
          </svg>
        </div>
      </div>

      {/* Trees */}
      <div className="absolute bottom-[23%] w-full overflow-hidden">
        <div className="parallax-scroll" style={{ animationDuration: `${baseDuration * 5}s` }}>
          <svg width="200%" height="70" viewBox="0 0 2000 70" className="opacity-60" preserveAspectRatio="none">
            {[0, 180, 360, 540, 720, 900, 1000, 1180, 1360, 1540, 1720, 1900].map((x, i) => (
              <g key={i}>
                <rect x={x + 17} y="35" width="6" height="35" fill="#6B4B2B" />
                <ellipse cx={x + 20} cy="28" rx="16" ry="22" fill={i % 2 === 0 ? '#3A7C2F' : '#4A8C3F'} />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-dino-grass">
        <div className="absolute top-0 left-0 right-0 h-3 bg-dino-grassDark" />
        {/* Scrolling grass tufts */}
        <div className="absolute top-1 w-full h-6 overflow-hidden">
          <div className="parallax-scroll" style={{ animationDuration: `${baseDuration * 1.5}s` }}>
            <div className="flex w-[200%]">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 bg-dino-grassDark rounded-t-full"
                  style={{
                    width: i % 3 === 0 ? 3 : 2,
                    height: i % 2 === 0 ? 14 : 10,
                    marginLeft: `${2 + (i % 4)}%`,
                    opacity: 0.3 + (i % 3) * 0.15,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background events */}
      {events.map(e => (
        <div key={e.id} className="absolute pointer-events-none z-5">
          {e.type === 'shootingstar' && (
            <div className="absolute top-[10%] right-0 animate-shooting-star">
              <svg width="40" height="4" viewBox="0 0 40 4">
                <line x1="0" y1="2" x2="35" y2="2" stroke="white" strokeWidth="2" opacity="0.8" />
                <circle cx="37" cy="2" r="2" fill="white" />
              </svg>
            </div>
          )}
          {e.type === 'volcanopuff' && (
            <div className="absolute bottom-[32%] right-[14%] animate-volcano-puff">
              <svg width="60" height="40" viewBox="0 0 60 40">
                <ellipse cx="30" cy="30" rx="20" ry="10" fill="#999" opacity="0.3" />
                <ellipse cx="25" cy="20" rx="15" ry="10" fill="#aaa" opacity="0.25" />
                <ellipse cx="35" cy="12" rx="12" ry="8" fill="#bbb" opacity="0.2" />
              </svg>
            </div>
          )}
          {e.type === 'herd' && (
            <div className="absolute bottom-[27%] animate-herd-run">
              {[0, 15, 30].map(offset => (
                <svg key={offset} width="12" height="10" viewBox="0 0 20 16" className="inline-block opacity-30" style={{ marginLeft: offset }}>
                  <ellipse cx="10" cy="8" rx="8" ry="5" fill="#5A8A5A" />
                  <ellipse cx="16" cy="5" rx="4" ry="3" fill="#5A8A5A" />
                </svg>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

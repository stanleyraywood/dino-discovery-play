import React, { useState, useCallback, useRef } from 'react';

interface Particle {
  id: number;
  x: number;     // % from left
  y: number;     // % from bottom
  type: 'dust' | 'sparkle' | 'impact' | 'speed-line';
  color: string;
  size: number;
  delay: number;
}

export function useParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);

  const emit = useCallback((
    type: Particle['type'],
    x: number,
    y: number,
    count: number = 6,
    color: string = '#8B6B3B'
  ) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: nextId.current++,
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 2,
        type,
        color,
        size: 3 + Math.random() * 5,
        delay: i * 25,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);

    // Clean up after animation completes
    const duration = type === 'sparkle' ? 700 : type === 'speed-line' ? 500 : 450;
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, duration + count * 25);
  }, []);

  const emitDust = useCallback((x: number, y: number) => {
    emit('dust', x, y, 6, '#8B6B3B');
  }, [emit]);

  const emitSparkle = useCallback((x: number, y: number) => {
    emit('sparkle', x, y, 10, '#FFD700');
  }, [emit]);

  const emitImpact = useCallback((x: number, y: number) => {
    emit('impact', x, y, 8, '#FF4444');
  }, [emit]);

  const clear = useCallback(() => setParticles([]), []);

  return { particles, emitDust, emitSparkle, emitImpact, clear };
}

export const ParticleRenderer: React.FC<{ particles: Particle[] }> = ({ particles }) => {
  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
      {particles.map(p => {
        const animClass =
          p.type === 'dust' ? 'animate-particle-dust' :
          p.type === 'sparkle' ? 'animate-particle-sparkle' :
          p.type === 'impact' ? 'animate-particle-impact' :
          'animate-particle-speed';

        const shape = p.type === 'sparkle' ? 'star' : 'circle';

        return (
          <div
            key={p.id}
            className={`absolute ${animClass}`}
            style={{
              left: `${p.x}%`,
              bottom: `${p.y}%`,
              animationDelay: `${p.delay}ms`,
            }}
          >
            {shape === 'star' ? (
              <svg width={p.size * 2} height={p.size * 2} viewBox="0 0 20 20">
                <path
                  d="M10 0 L12 7 L20 8 L14 13 L16 20 L10 16 L4 20 L6 13 L0 8 L8 7 Z"
                  fill={p.color}
                />
              </svg>
            ) : (
              <div
                className="rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

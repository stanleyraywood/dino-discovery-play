import React from 'react';
import { Dinosaur } from '@/data/dinosaurs';

interface DinoSVGProps {
  dino: Dinosaur;
  size?: number;
  isRunning?: boolean;
  isJumping?: boolean;
  isStumbling?: boolean;
  className?: string;
}

const BipedDino: React.FC<{ color: string; bodyColor: string; size: number }> = ({ color, bodyColor, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg">
    {/* Body */}
    <ellipse cx="45" cy="55" rx="25" ry="18" fill={bodyColor} />
    {/* Head */}
    <ellipse cx="72" cy="40" rx="14" ry="12" fill={bodyColor} />
    {/* Jaw */}
    <ellipse cx="80" cy="44" rx="10" ry="5" fill={color} />
    {/* Eye */}
    <circle cx="76" cy="36" r="4" fill="white" />
    <circle cx="77" cy="36" r="2.5" fill="#222" />
    <circle cx="78" cy="35" r="1" fill="white" />
    {/* Teeth */}
    <path d="M74 47 L76 50 L78 47 L80 50 L82 47" fill="white" stroke="white" strokeWidth="0.5" />
    {/* Neck */}
    <path d="M60 48 Q65 42 70 44" fill={bodyColor} stroke={bodyColor} strokeWidth="8" />
    {/* Tail */}
    <path d="M20 55 Q5 45 2 35" fill="none" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
    {/* Legs */}
    <rect x="35" y="68" width="7" height="18" rx="3" fill={color} />
    <rect x="50" y="68" width="7" height="18" rx="3" fill={color} />
    {/* Tiny arms */}
    <rect x="62" y="50" width="4" height="8" rx="2" fill={color} transform="rotate(-20 62 50)" />
    {/* Feet */}
    <ellipse cx="38" cy="88" rx="6" ry="3" fill={color} />
    <ellipse cx="53" cy="88" rx="6" ry="3" fill={color} />
  </svg>
);

const QuadrupedDino: React.FC<{ color: string; bodyColor: string; size: number }> = ({ color, bodyColor, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg">
    {/* Body */}
    <ellipse cx="50" cy="50" rx="30" ry="16" fill={bodyColor} />
    {/* Head */}
    <ellipse cx="82" cy="42" rx="12" ry="10" fill={bodyColor} />
    {/* Eye */}
    <circle cx="86" cy="38" r="3.5" fill="white" />
    <circle cx="87" cy="38" r="2" fill="#222" />
    <circle cx="88" cy="37" r="0.8" fill="white" />
    {/* Horn/frill */}
    <path d="M88 32 L94 28 L90 35" fill={color} />
    <path d="M84 30 L86 22 L82 30" fill={color} />
    <path d="M78 32 L76 24 L75 32" fill={color} />
    {/* Tail */}
    <path d="M20 50 Q8 42 4 48 Q2 52 8 50" fill={bodyColor} stroke={bodyColor} strokeWidth="2" />
    {/* Tail spikes */}
    <circle cx="6" cy="46" r="3" fill={color} />
    <circle cx="10" cy="43" r="2.5" fill={color} />
    {/* Plates on back */}
    <path d="M35 34 L38 24 L41 34" fill={color} />
    <path d="M44 32 L48 20 L52 32" fill={color} />
    <path d="M55 34 L58 24 L61 34" fill={color} />
    {/* Legs */}
    <rect x="30" y="62" width="7" height="16" rx="3" fill={color} />
    <rect x="42" y="62" width="7" height="16" rx="3" fill={color} />
    <rect x="58" y="62" width="7" height="16" rx="3" fill={color} />
    <rect x="70" y="62" width="7" height="16" rx="3" fill={color} />
    {/* Feet */}
    <ellipse cx="33" cy="80" rx="5" ry="3" fill={color} />
    <ellipse cx="45" cy="80" rx="5" ry="3" fill={color} />
    <ellipse cx="61" cy="80" rx="5" ry="3" fill={color} />
    <ellipse cx="73" cy="80" rx="5" ry="3" fill={color} />
  </svg>
);

const FlyerDino: React.FC<{ color: string; bodyColor: string; size: number }> = ({ color, bodyColor, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg">
    {/* Body */}
    <ellipse cx="50" cy="50" rx="15" ry="10" fill={bodyColor} />
    {/* Head with crest */}
    <ellipse cx="70" cy="42" rx="10" ry="8" fill={bodyColor} />
    <path d="M72 34 L82 22 L74 36" fill={color} />
    {/* Beak */}
    <path d="M78 42 L90 44 L78 46" fill={color} />
    {/* Eye */}
    <circle cx="73" cy="39" r="3" fill="white" />
    <circle cx="74" cy="39" r="1.8" fill="#222" />
    {/* Wings */}
    <path d="M40 45 Q20 20 5 30 Q15 35 35 42" fill={bodyColor} opacity="0.9" />
    <path d="M40 55 Q20 80 5 70 Q15 65 35 58" fill={bodyColor} opacity="0.9" />
    {/* Wing details */}
    <path d="M35 42 Q25 30 15 35" fill="none" stroke={color} strokeWidth="1" />
    <path d="M35 58 Q25 70 15 65" fill="none" stroke={color} strokeWidth="1" />
    {/* Feet */}
    <path d="M48 58 L46 68 L42 70 M46 68 L48 70 M46 68 L50 70" fill="none" stroke={color} strokeWidth="1.5" />
    <path d="M54 58 L52 68 L48 70 M52 68 L54 70 M52 68 L56 70" fill="none" stroke={color} strokeWidth="1.5" />
  </svg>
);

const LongneckDino: React.FC<{ color: string; bodyColor: string; size: number }> = ({ color, bodyColor, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg">
    {/* Body */}
    <ellipse cx="40" cy="60" rx="25" ry="16" fill={bodyColor} />
    {/* Neck */}
    <path d="M55 50 Q65 30 75 18" fill="none" stroke={bodyColor} strokeWidth="10" strokeLinecap="round" />
    {/* Head */}
    <ellipse cx="80" cy="15" rx="10" ry="7" fill={bodyColor} />
    {/* Eye */}
    <circle cx="84" cy="12" r="3" fill="white" />
    <circle cx="85" cy="12" r="1.8" fill="#222" />
    <circle cx="86" cy="11" r="0.7" fill="white" />
    {/* Nostril */}
    <circle cx="88" cy="15" r="1.2" fill={color} />
    {/* Smile */}
    <path d="M82 18 Q85 20 88 18" fill="none" stroke={color} strokeWidth="1" />
    {/* Tail */}
    <path d="M15 60 Q2 52 0 42" fill="none" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
    {/* Legs */}
    <rect x="25" y="72" width="8" height="16" rx="4" fill={color} />
    <rect x="38" y="72" width="8" height="16" rx="4" fill={color} />
    <rect x="48" y="72" width="8" height="16" rx="4" fill={color} />
    {/* Feet */}
    <ellipse cx="29" cy="90" rx="6" ry="3" fill={color} />
    <ellipse cx="42" cy="90" rx="6" ry="3" fill={color} />
    <ellipse cx="52" cy="90" rx="6" ry="3" fill={color} />
  </svg>
);

export const DinoSVG: React.FC<DinoSVGProps> = ({ 
  dino, 
  size = 80, 
  isRunning = false, 
  isJumping = false,
  isStumbling = false,
  className = '' 
}) => {
  const animClass = [
    isRunning && !isJumping && !isStumbling ? 'animate-dino-run' : '',
    isJumping ? 'animate-dino-jump' : '',
    isStumbling ? 'animate-dino-stumble' : '',
    className,
  ].filter(Boolean).join(' ');

  const Component = {
    biped: BipedDino,
    quadruped: QuadrupedDino,
    flyer: FlyerDino,
    longneck: LongneckDino,
  }[dino.svgType];

  return (
    <div className={animClass} style={{ width: size, height: size }}>
      <Component color={dino.color} bodyColor={dino.bodyColor} size={size} />
    </div>
  );
};

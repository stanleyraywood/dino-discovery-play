import React from 'react';
import type { AvatarConfig } from '@/data/leaderboard';

interface Props {
  avatar: AvatarConfig;
  size?: number;
}

const HatOverlay: React.FC<{ hat: string; size: number }> = ({ hat, size }) => {
  const s = size / 100; // scale factor
  switch (hat) {
    case 'tophat':
      return (
        <g>
          <rect x={65 * s} y={18 * s} width={20 * s} height={18 * s} rx={2 * s} fill="#222" />
          <rect x={60 * s} y={34 * s} width={30 * s} height={4 * s} rx={2 * s} fill="#333" />
          <rect x={68 * s} y={28 * s} width={14 * s} height={3 * s} fill="#C41E3A" />
        </g>
      );
    case 'crown':
      return (
        <g>
          <path d={`M${62*s} ${32*s} L${65*s} ${20*s} L${70*s} ${26*s} L${75*s} ${18*s} L${80*s} ${26*s} L${85*s} ${20*s} L${88*s} ${32*s} Z`} fill="#FFD700" />
          <circle cx={75*s} cy={28*s} r={2*s} fill="#FF0000" />
        </g>
      );
    case 'party':
      return (
        <g>
          <path d={`M${70*s} ${20*s} L${80*s} ${34*s} L${60*s} ${34*s} Z`} fill="#FF6B6B" />
          <circle cx={70*s} cy={19*s} r={3*s} fill="#FFD700" />
          <path d={`M${66*s} ${26*s} L${74*s} ${26*s}`} stroke="#4ECDC4" strokeWidth={2*s} />
        </g>
      );
    case 'cowboy':
      return (
        <g>
          <ellipse cx={75*s} cy={32*s} rx={18*s} ry={5*s} fill="#8B6B3B" />
          <path d={`M${65*s} ${32*s} Q${70*s} ${18*s} ${75*s} ${20*s} Q${80*s} ${18*s} ${85*s} ${32*s}`} fill="#A0825A" />
        </g>
      );
    case 'beanie':
      return (
        <g>
          <ellipse cx={75*s} cy={30*s} rx={14*s} ry={10*s} fill="#4ECDC4" />
          <circle cx={75*s} cy={20*s} r={3*s} fill="#FF6B6B" />
          <rect x={61*s} y={32*s} width={28*s} height={4*s} rx={2*s} fill="#45B7D1" />
        </g>
      );
    default:
      return null;
  }
};

const AccessoryOverlay: React.FC<{ accessory: string; size: number }> = ({ accessory, size }) => {
  const s = size / 100;
  switch (accessory) {
    case 'bowtie':
      return (
        <g>
          <path d={`M${55*s} ${48*s} L${62*s} ${44*s} L${62*s} ${52*s} Z`} fill="#C41E3A" />
          <path d={`M${69*s} ${48*s} L${62*s} ${44*s} L${62*s} ${52*s} Z`} fill="#C41E3A" />
          <circle cx={62*s} cy={48*s} r={2*s} fill="#FFD700" />
        </g>
      );
    case 'scarf':
      return (
        <g>
          <path d={`M${55*s} ${48*s} Q${65*s} ${52*s} ${60*s} ${60*s}`} fill="none" stroke="#FF6B6B" strokeWidth={4*s} strokeLinecap="round" />
          <path d={`M${58*s} ${55*s} L${55*s} ${65*s}`} fill="none" stroke="#FF6B6B" strokeWidth={3*s} strokeLinecap="round" />
        </g>
      );
    case 'sunglasses':
      return (
        <g>
          <rect x={70*s} y={33*s} width={12*s} height={7*s} rx={2*s} fill="#222" opacity="0.8" />
          <line x1={65*s} y1={36*s} x2={71*s} y2={36*s} stroke="#333" strokeWidth={1.5*s} />
        </g>
      );
    case 'monocle':
      return (
        <g>
          <circle cx={77*s} cy={36*s} r={6*s} fill="none" stroke="#FFD700" strokeWidth={1.5*s} />
          <line x1={77*s} y1={42*s} x2={75*s} y2={55*s} stroke="#FFD700" strokeWidth={1*s} />
        </g>
      );
    default:
      return null;
  }
};

export const AvatarDino: React.FC<Props> = ({ avatar, size = 60 }) => {
  const { bodyColor, accentColor, hat, accessory } = avatar;

  // Simplified dino body based on type
  const renderBody = () => {
    switch (avatar.dinoType) {
      case 'biped':
        return (
          <>
            <ellipse cx="45" cy="55" rx="25" ry="18" fill={bodyColor} />
            <ellipse cx="72" cy="40" rx="14" ry="12" fill={bodyColor} />
            <ellipse cx="80" cy="44" rx="10" ry="5" fill={accentColor} />
            <circle cx="76" cy="36" r="4" fill="white" />
            <circle cx="77" cy="36" r="2.5" fill="#222" />
            <circle cx="78" cy="35" r="1" fill="white" />
            <path d="M74 47 L76 50 L78 47 L80 50 L82 47" fill="white" stroke="white" strokeWidth="0.5" />
            <path d="M20 55 Q5 45 2 35" fill="none" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
            <rect x="35" y="68" width="7" height="18" rx="3" fill={accentColor} />
            <rect x="50" y="68" width="7" height="18" rx="3" fill={accentColor} />
            <ellipse cx="38" cy="88" rx="6" ry="3" fill={accentColor} />
            <ellipse cx="53" cy="88" rx="6" ry="3" fill={accentColor} />
          </>
        );
      case 'quadruped':
        return (
          <>
            <ellipse cx="50" cy="50" rx="30" ry="16" fill={bodyColor} />
            <ellipse cx="82" cy="42" rx="12" ry="10" fill={bodyColor} />
            <circle cx="86" cy="38" r="3.5" fill="white" />
            <circle cx="87" cy="38" r="2" fill="#222" />
            <path d="M88 32 L94 28 L90 35" fill={accentColor} />
            <path d="M20 50 Q8 42 4 48" fill={bodyColor} stroke={bodyColor} strokeWidth="2" />
            <rect x="30" y="62" width="7" height="16" rx="3" fill={accentColor} />
            <rect x="42" y="62" width="7" height="16" rx="3" fill={accentColor} />
            <rect x="58" y="62" width="7" height="16" rx="3" fill={accentColor} />
            <rect x="70" y="62" width="7" height="16" rx="3" fill={accentColor} />
          </>
        );
      case 'flyer':
        return (
          <>
            <ellipse cx="50" cy="50" rx="15" ry="10" fill={bodyColor} />
            <ellipse cx="70" cy="42" rx="10" ry="8" fill={bodyColor} />
            <path d="M72 34 L82 22 L74 36" fill={accentColor} />
            <path d="M78 42 L90 44 L78 46" fill={accentColor} />
            <circle cx="73" cy="39" r="3" fill="white" />
            <circle cx="74" cy="39" r="1.8" fill="#222" />
            <path d="M40 45 Q20 20 5 30 Q15 35 35 42" fill={bodyColor} opacity="0.9" />
            <path d="M40 55 Q20 80 5 70 Q15 65 35 58" fill={bodyColor} opacity="0.9" />
          </>
        );
      case 'longneck':
        return (
          <>
            <ellipse cx="40" cy="60" rx="25" ry="16" fill={bodyColor} />
            <path d="M55 50 Q65 30 75 18" fill="none" stroke={bodyColor} strokeWidth="10" strokeLinecap="round" />
            <ellipse cx="80" cy="15" rx="10" ry="7" fill={bodyColor} />
            <circle cx="84" cy="12" r="3" fill="white" />
            <circle cx="85" cy="12" r="1.8" fill="#222" />
            <path d="M15 60 Q2 52 0 42" fill="none" stroke={bodyColor} strokeWidth="8" strokeLinecap="round" />
            <rect x="25" y="72" width="8" height="16" rx="4" fill={accentColor} />
            <rect x="38" y="72" width="8" height="16" rx="4" fill={accentColor} />
            <rect x="48" y="72" width="8" height="16" rx="4" fill={accentColor} />
          </>
        );
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
      {renderBody()}
      <HatOverlay hat={hat} size={100} />
      <AccessoryOverlay accessory={accessory} size={100} />
    </svg>
  );
};

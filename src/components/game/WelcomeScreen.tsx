import React from 'react';
import { DINOSAURS } from '@/data/dinosaurs';
import { DinoSVG } from './DinoSVG';
import { GameAudio } from '@/lib/audio';

interface Props {
  onPlay: () => void;
  onCollection: () => void;
  onLeaderboard: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onPlay, onCollection, onLeaderboard }) => {
  const trex = DINOSAURS[0];

  const handlePlay = () => {
    GameAudio.init();
    onPlay();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-dino-sky via-dino-skyLight to-dino-grass p-4 overflow-hidden">
      {/* Clouds */}
      <div className="absolute top-10 left-10 w-24 h-10 bg-white/60 rounded-full animate-cloud-drift" />
      <div className="absolute top-20 right-20 w-32 h-12 bg-white/50 rounded-full animate-cloud-drift-slow" />
      <div className="absolute top-8 left-1/2 w-20 h-8 bg-white/40 rounded-full animate-cloud-drift" />

      {/* Volcano bg */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 800 200" className="w-full" preserveAspectRatio="none">
          <path d="M0 200 L0 120 Q50 100 100 120 L200 80 Q230 60 260 80 L400 100 Q500 60 550 90 L700 70 Q740 50 780 80 L800 100 L800 200 Z" fill="#5B8C3E" />
          <path d="M300 200 L350 60 Q370 30 390 60 L440 200 Z" fill="#8B7355" />
          <path d="M355 70 Q370 40 385 70" fill="#FF6B35" opacity="0.6" />
        </svg>
      </div>

      {/* Title */}
      <div className="relative z-10 mb-4">
        <h1 className="text-6xl md:text-8xl font-extrabold text-dino-title drop-shadow-[0_4px_0_rgba(0,0,0,0.3)] tracking-wider animate-bounce-gentle">
          DINO DASH
        </h1>
        <p className="text-xl md:text-2xl text-white font-bold text-center mt-2 drop-shadow-md">
          Run. Jump. Discover.
        </p>
      </div>

      {/* Animated Dino */}
      <div className="relative z-10 my-6 animate-bounce-gentle">
        <DinoSVG dino={trex} size={120} isRunning />
      </div>

      {/* Buttons */}
      <div className="relative z-10 flex flex-col gap-3 items-center">
        <button
          onClick={handlePlay}
          className="px-12 py-5 text-3xl font-extrabold bg-dino-orange text-white rounded-2xl shadow-[0_6px_0_#c0500a] hover:shadow-[0_4px_0_#c0500a] hover:translate-y-[2px] active:shadow-[0_1px_0_#c0500a] active:translate-y-[5px] transition-all duration-100 transform hover:scale-105"
        >
          PLAY
        </button>
        <div className="flex gap-3">
          <button
            onClick={onLeaderboard}
            className="px-6 py-3 text-lg font-bold bg-dino-eggYellow text-foreground rounded-2xl shadow-[0_4px_0_#C4A435] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-100 transform hover:scale-105"
          >
            🏆 Scores
          </button>
          <button
            onClick={onCollection}
            className="px-6 py-3 text-lg font-bold bg-dino-purple text-white rounded-2xl shadow-[0_4px_0_#5B3A8B] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-100 transform hover:scale-105"
          >
            📚 My Dinos
          </button>
        </div>
      </div>

      {/* Ground dinos walking */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-around z-10 opacity-40">
        {DINOSAURS.slice(1, 4).map(d => (
          <DinoSVG key={d.id} dino={d} size={40} isRunning />
        ))}
      </div>
    </div>
  );
};

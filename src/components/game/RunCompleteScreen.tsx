import React, { useEffect, useState } from 'react';
import { type Dinosaur, DINOSAURS, getUnlockedDinos, saveDinoUnlock } from '@/data/dinosaurs';
import { DinoSVG } from './DinoSVG';

interface Props {
  dino: Dinosaur;
  factsCollected: number[];
  distance: number;
  onPlayAgain: () => void;
  onNewDino: () => void;
  onHome: () => void;
}

export const RunCompleteScreen: React.FC<Props> = ({
  dino,
  factsCollected,
  distance,
  onPlayAgain,
  onNewDino,
  onHome,
}) => {
  const [newUnlock, setNewUnlock] = useState<Dinosaur | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Check if we should unlock a new dino (2+ facts collected)
    if (factsCollected.length >= 2) {
      const unlocked = getUnlockedDinos();
      const nextDino = DINOSAURS.find(d => !unlocked.includes(d.id));
      if (nextDino) {
        saveDinoUnlock(nextDino.id);
        setNewUnlock(nextDino);
      }
    }
    const t = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(t);
  }, [factsCollected]);

  const stars = factsCollected.length >= 3 ? 3 : factsCollected.length >= 2 ? 2 : 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-dino-sky to-dino-grass p-4 overflow-hidden relative">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#FF6B35', '#FFD700', '#4CAF50', '#2196F3', '#9C27B0', '#FF4081'][
                    Math.floor(Math.random() * 6)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <h1 className="text-5xl md:text-7xl font-extrabold text-dino-title drop-shadow-lg mb-2 animate-bounce-gentle z-10">
        Great Run! 🎉
      </h1>

      {/* Stars */}
      <div className="flex gap-2 mb-4 z-10">
        {[1, 2, 3].map(s => (
          <span
            key={s}
            className={`text-5xl ${s <= stars ? 'animate-star-pop' : 'opacity-30'}`}
            style={{ animationDelay: `${s * 0.3}s` }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Dino */}
      <div className="z-10 mb-4">
        <DinoSVG dino={dino} size={90} />
      </div>

      {/* Stats */}
      <div className="bg-white/90 rounded-3xl p-5 max-w-sm w-full z-10 mb-4 shadow-xl">
        <div className="flex justify-around mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{distance}m</p>
            <p className="text-sm text-muted-foreground">Distance</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{factsCollected.length}</p>
            <p className="text-sm text-muted-foreground">Facts Found</p>
          </div>
        </div>

        {factsCollected.length > 0 && (
          <div className="space-y-2">
            <p className="font-bold text-center">Facts you learned:</p>
            {factsCollected.map(fi => (
              <p key={fi} className="text-sm bg-dino-eggYellow/30 rounded-xl p-2 text-center">
                {dino.facts[fi]?.text}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* New unlock */}
      {newUnlock && (
        <div className="bg-dino-orange/90 rounded-3xl p-5 max-w-sm w-full z-10 mb-4 shadow-xl animate-scale-in">
          <p className="text-xl font-extrabold text-white text-center mb-2">
            🎊 NEW DINO UNLOCKED! 🎊
          </p>
          <div className="flex justify-center">
            <DinoSVG dino={newUnlock} size={70} />
          </div>
          <p className="text-2xl font-extrabold text-white text-center mt-2">
            {newUnlock.name}!
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-3 z-10 w-full max-w-xs">
        <button
          onClick={onPlayAgain}
          className="px-8 py-4 text-2xl font-extrabold bg-dino-green text-white rounded-2xl shadow-[0_5px_0_#2d6b1e] hover:translate-y-[2px] active:translate-y-[4px] transition-all"
        >
          🔄 Run Again!
        </button>
        <button
          onClick={onNewDino}
          className="px-8 py-3 text-xl font-bold bg-dino-purple text-white rounded-2xl shadow-[0_4px_0_#5B3A8B] hover:translate-y-[2px] transition-all"
        >
          🦕 Pick New Dino
        </button>
        <button
          onClick={onHome}
          className="px-6 py-2 text-lg font-bold bg-white/80 text-foreground rounded-2xl shadow hover:bg-white transition-all"
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
};

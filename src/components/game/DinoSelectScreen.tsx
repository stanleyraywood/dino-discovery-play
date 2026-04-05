import React, { useState } from 'react';
import { DINOSAURS, getUnlockedDinos, type Dinosaur } from '@/data/dinosaurs';
import { DinoSVG } from './DinoSVG';

interface Props {
  onSelect: (dino: Dinosaur) => void;
  onBack: () => void;
}

export const DinoSelectScreen: React.FC<Props> = ({ onSelect, onBack }) => {
  const unlocked = getUnlockedDinos();
  const [selected, setSelected] = useState<Dinosaur | null>(null);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-dino-sky to-dino-grass p-4">
      <button
        onClick={onBack}
        className="self-start px-4 py-2 text-lg font-bold text-white bg-dino-brown rounded-xl mb-4 shadow-md"
      >
        ← Back
      </button>

      <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-6">
        Pick Your Dino! 🦕
      </h2>

      {/* Dino grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6 w-full max-w-2xl">
        {DINOSAURS.map(dino => {
          const isUnlocked = unlocked.includes(dino.id);
          return (
            <button
              key={dino.id}
              onClick={() => isUnlocked && setSelected(dino)}
              disabled={!isUnlocked}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-200 ${
                selected?.id === dino.id
                  ? 'bg-white/40 scale-110 ring-4 ring-dino-orange'
                  : isUnlocked
                  ? 'bg-white/20 hover:bg-white/30 hover:scale-105'
                  : 'bg-black/20 opacity-50'
              }`}
            >
              <div className={!isUnlocked ? 'grayscale brightness-50' : ''}>
                <DinoSVG dino={dino} size={60} />
              </div>
              <span className="text-sm font-bold text-white mt-1 drop-shadow">
                {isUnlocked ? dino.name : '???'}
              </span>
              {!isUnlocked && <span className="text-xs">🔒</span>}
            </button>
          );
        })}
      </div>

      {/* Selected dino detail */}
      {selected && (
        <div className="bg-white/90 rounded-3xl p-6 max-w-md w-full text-center shadow-xl animate-scale-in">
          <DinoSVG dino={selected} size={100} isRunning className="mx-auto" />
          <h3 className="text-3xl font-extrabold mt-3" style={{ color: selected.color }}>
            {selected.name}
          </h3>
          <p className="text-sm text-muted-foreground italic mb-2">
            "{selected.pronunciation}"
          </p>
          <p className="text-lg font-semibold mb-1">
            {selected.diet === 'carnivore' ? '🥩 Meat eater' : '🌿 Plant eater'}
          </p>
          <p className="text-base mb-3">📏 {selected.sizeComparison}</p>
          <p className="text-lg font-bold mb-4">💡 {selected.funQuirk}</p>
          <button
            onClick={() => onSelect(selected)}
            className="px-10 py-4 text-2xl font-extrabold bg-dino-green text-white rounded-2xl shadow-[0_5px_0_#2d6b1e] hover:translate-y-[2px] active:translate-y-[4px] transition-all"
          >
            🏃 RUN!
          </button>
        </div>
      )}
    </div>
  );
};

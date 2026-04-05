import React, { useState } from 'react';
import { DINOSAURS, getUnlockedDinos, getCollectedFacts, type Dinosaur } from '@/data/dinosaurs';
import { DinoSVG } from './DinoSVG';

interface Props {
  onBack: () => void;
}

export const CollectionScreen: React.FC<Props> = ({ onBack }) => {
  const unlocked = getUnlockedDinos();
  const collectedFacts = getCollectedFacts();
  const [selected, setSelected] = useState<Dinosaur | null>(null);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-dino-purple/30 via-dino-sky to-dino-grass p-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 text-lg font-bold text-white bg-dino-brown rounded-xl shadow-md"
          >
            ← Back
          </button>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            My Dinos 📚
          </h2>
          <div className="text-white font-bold text-lg">
            {unlocked.length}/{DINOSAURS.length}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {DINOSAURS.map(dino => {
            const isUnlocked = unlocked.includes(dino.id);
            const facts = collectedFacts[dino.id] || [];
            return (
              <button
                key={dino.id}
                onClick={() => isUnlocked && setSelected(dino)}
                disabled={!isUnlocked}
                className={`flex flex-col items-center p-4 rounded-3xl transition-all duration-200 ${
                  selected?.id === dino.id
                    ? 'bg-white/60 scale-105 ring-4 ring-dino-orange'
                    : isUnlocked
                    ? 'bg-white/30 hover:bg-white/40 hover:scale-105'
                    : 'bg-black/20 opacity-40'
                }`}
              >
                <div className={!isUnlocked ? 'grayscale brightness-50' : ''}>
                  <DinoSVG dino={dino} size={70} />
                </div>
                <span className="font-bold text-white mt-2 text-lg drop-shadow">
                  {isUnlocked ? dino.name : '???'}
                </span>
                {isUnlocked && (
                  <div className="flex gap-0.5 mt-1">
                    {dino.facts.map((_, i) => (
                      <span key={i} className={`text-sm ${facts.includes(i) ? '' : 'opacity-30'}`}>
                        🥚
                      </span>
                    ))}
                  </div>
                )}
                {!isUnlocked && <span className="text-2xl mt-1">🔒</span>}
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="bg-white/95 rounded-3xl p-6 shadow-xl animate-scale-in">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <DinoSVG dino={selected} size={120} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-extrabold" style={{ color: selected.color }}>
                  {selected.name}
                </h3>
                <p className="text-muted-foreground italic mb-2">
                  Say it: "{selected.pronunciation}"
                </p>
                <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-dino-eggYellow/30">
                    {selected.diet === 'carnivore' ? '🥩 Carnivore' : '🌿 Herbivore'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-dino-sky/30">
                    🕐 {selected.period}
                  </span>
                </div>
                <p className="text-lg mb-2">📏 {selected.sizeComparison}</p>
                <p className="text-lg font-bold mb-4">✨ {selected.funQuirk}</p>
                <div className="space-y-2">
                  <p className="font-bold">Dino Facts:</p>
                  {selected.facts.map((fact, i) => {
                    const isFound = (collectedFacts[selected.id] || []).includes(i);
                    return (
                      <p
                        key={i}
                        className={`text-sm rounded-xl p-2 ${
                          isFound ? 'bg-dino-eggYellow/20' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isFound ? fact.text : '🔒 Play to discover this fact!'}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

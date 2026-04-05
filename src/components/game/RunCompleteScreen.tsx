import React, { useEffect, useState } from 'react';
import { type Dinosaur, DINOSAURS, getUnlockedDinos, saveDinoUnlock } from '@/data/dinosaurs';
import { DinoSVG } from './DinoSVG';
import { GameAudio } from '@/lib/audio';
import { type Achievement } from '@/data/achievements';
import { type RunResult } from './RunnerGame';

interface Props {
  dino: Dinosaur;
  result: RunResult;
  newAchievements?: Achievement[];
  showHighScoreEntry?: boolean;
  onSaveScore?: (name: string) => void;
  onPlayAgain: () => void;
  onNewDino: () => void;
  onHome: () => void;
}

export const RunCompleteScreen: React.FC<Props> = ({
  dino,
  result,
  newAchievements = [],
  showHighScoreEntry = false,
  onSaveScore,
  onPlayAgain,
  onNewDino,
  onHome,
}) => {
  const { factsCollected, distance, bones, score } = result;
  const [newUnlock, setNewUnlock] = useState<Dinosaur | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [visibleAchievements, setVisibleAchievements] = useState<Achievement[]>([]);
  const [speakingFact, setSpeakingFact] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    if (factsCollected.length >= 2) {
      const unlocked = getUnlockedDinos();
      const nextDino = DINOSAURS.find(d => !unlocked.includes(d.id));
      if (nextDino) {
        saveDinoUnlock(nextDino.id);
        setNewUnlock(nextDino);
      }
    }
    GameAudio.victory();
    const t = setTimeout(() => setShowConfetti(false), 3000);
    newAchievements.forEach((ach, i) => {
      setTimeout(() => setVisibleAchievements(prev => [...prev, ach]), 1500 + i * 600);
    });
    return () => clearTimeout(t);
  }, [factsCollected, newAchievements]);

  const handleSpeak = (factIndex: number, text: string) => {
    setSpeakingFact(factIndex);
    GameAudio.speak(text);
    const duration = Math.max(2000, text.length * 70);
    setTimeout(() => setSpeakingFact(null), duration);
  };

  const stars = factsCollected.length >= 3 ? 3 : factsCollected.length >= 2 ? 2 : factsCollected.length >= 1 ? 1 : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-dino-sky to-dino-grass p-4 overflow-auto relative">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="absolute animate-confetti" style={{
              left: `${Math.random() * 100}%`, top: '-5%',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}>
              <div className="w-3 h-3 rounded-sm" style={{
                backgroundColor: ['#FF6B35', '#FFD700', '#4CAF50', '#2196F3', '#9C27B0', '#FF4081'][Math.floor(Math.random() * 6)],
                transform: `rotate(${Math.random() * 360}deg)`,
              }} />
            </div>
          ))}
        </div>
      )}

      <h1 className="text-5xl md:text-6xl font-extrabold text-dino-title drop-shadow-lg mb-2 animate-bounce-gentle z-10">
        Great Run!
      </h1>

      {/* Stars */}
      <div className="flex gap-2 mb-3 z-10">
        {[1, 2, 3].map(s => (
          <span key={s} className={`text-5xl ${s <= stars ? 'animate-star-pop' : 'opacity-30'}`} style={{ animationDelay: `${s * 0.3}s` }}>
            ⭐
          </span>
        ))}
      </div>

      <div className="z-10 mb-3">
        <DinoSVG dino={dino} size={80} />
      </div>

      {/* Stats */}
      <div className="bg-white/90 rounded-3xl p-5 max-w-sm w-full z-10 mb-4 shadow-xl">
        {/* Score breakdown */}
        <div className="text-center mb-4">
          <p className="text-4xl font-extrabold" style={{ color: dino.color }}>{score}</p>
          <p className="text-sm text-gray-500">Total Score</p>
        </div>

        <div className="flex justify-around mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">🦴 {bones}</p>
            <p className="text-xs text-gray-500">Bones</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">🥚 {factsCollected.length}</p>
            <p className="text-xs text-gray-500">Facts ({factsCollected.length}×50)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{distance}m</p>
            <p className="text-xs text-gray-500">Distance</p>
          </div>
        </div>

        {/* Facts with read-aloud */}
        {factsCollected.length > 0 && (
          <div className="space-y-2">
            <p className="font-bold text-center text-sm">Facts discovered:</p>
            {factsCollected.map(fi => (
              <div key={fi} className="flex items-center gap-2 bg-dino-eggYellow/30 rounded-xl p-2">
                <button
                  onClick={() => handleSpeak(fi, dino.facts[fi]?.text || '')}
                  className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base transition-all ${
                    speakingFact === fi ? 'bg-dino-purple text-white scale-110' : 'bg-dino-purple/20 hover:bg-dino-purple/40'
                  }`}
                >
                  {speakingFact === fi ? '🔊' : '🔈'}
                </button>
                <p className="text-sm flex-1">{dino.facts[fi]?.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* High score entry */}
      {showHighScoreEntry && !scoreSaved && onSaveScore && (
        <div className="bg-dino-eggYellow/90 rounded-3xl p-5 max-w-sm w-full z-10 mb-4 shadow-xl animate-scale-in">
          <p className="text-xl font-extrabold text-center mb-2">🏆 NEW HIGH SCORE!</p>
          <p className="text-sm text-center text-gray-700 mb-3">Enter your name for the leaderboard</p>
          <div className="flex gap-2">
            <input
              type="text" value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 12))}
              placeholder="Your name..." maxLength={12}
              className="flex-1 px-4 py-3 text-lg font-bold rounded-xl border-2 border-dino-orange/30 focus:border-dino-orange outline-none text-center"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter' && playerName.trim()) { onSaveScore(playerName.trim()); setScoreSaved(true); } }}
            />
            <button
              onClick={() => { if (playerName.trim()) { onSaveScore(playerName.trim()); setScoreSaved(true); } }}
              disabled={!playerName.trim()}
              className="px-5 py-3 text-lg font-bold bg-dino-orange text-white rounded-xl shadow disabled:opacity-40 hover:scale-105 active:scale-95 transition-transform"
            >Save</button>
          </div>
        </div>
      )}

      {scoreSaved && (
        <div className="bg-dino-green/90 rounded-3xl p-4 max-w-sm w-full z-10 mb-4 shadow-xl animate-scale-in text-center">
          <p className="text-lg font-extrabold text-white">Score saved! 🎉</p>
        </div>
      )}

      {/* Achievements */}
      {visibleAchievements.map(ach => (
        <div key={ach.id} className="bg-dino-title/90 rounded-2xl px-5 py-3 max-w-sm w-full z-10 mb-3 shadow-xl animate-scale-in">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{ach.icon}</span>
            <div>
              <p className="text-sm font-extrabold text-white">ACHIEVEMENT UNLOCKED!</p>
              <p className="text-lg font-bold text-white">{ach.name}</p>
            </div>
          </div>
        </div>
      ))}

      {/* New unlock */}
      {newUnlock && (
        <div className="bg-dino-orange/90 rounded-3xl p-5 max-w-sm w-full z-10 mb-4 shadow-xl animate-scale-in">
          <p className="text-xl font-extrabold text-white text-center mb-2">NEW DINO UNLOCKED!</p>
          <div className="flex justify-center"><DinoSVG dino={newUnlock} size={70} /></div>
          <p className="text-2xl font-extrabold text-white text-center mt-2">{newUnlock.name}!</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-3 z-10 w-full max-w-xs">
        <button onClick={onPlayAgain} className="px-8 py-4 text-2xl font-extrabold bg-dino-green text-white rounded-2xl shadow-[0_5px_0_#2d6b1e] hover:translate-y-[2px] active:translate-y-[4px] transition-all">
          Run Again!
        </button>
        <button onClick={onNewDino} className="px-8 py-3 text-xl font-bold bg-dino-purple text-white rounded-2xl shadow-[0_4px_0_#5B3A8B] hover:translate-y-[2px] transition-all">
          Pick New Dino
        </button>
        <button onClick={onHome} className="px-6 py-2 text-lg font-bold bg-white/80 text-foreground rounded-2xl shadow hover:bg-white transition-all">
          Home
        </button>
      </div>
    </div>
  );
};

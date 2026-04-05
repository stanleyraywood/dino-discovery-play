import React from 'react';
import { getLeaderboard } from '@/data/leaderboard';
import { AvatarDino } from './AvatarDino';

interface Props {
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<Props> = ({ onBack }) => {
  const entries = getLeaderboard();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-dino-sky via-dino-skyLight to-dino-grass p-4 overflow-auto">
      <h1 className="text-5xl md:text-6xl font-extrabold text-dino-title drop-shadow-lg mb-6 mt-6">
        Leaderboard
      </h1>

      {entries.length === 0 ? (
        <div className="bg-white/90 rounded-3xl p-8 max-w-md w-full shadow-xl text-center">
          <p className="text-6xl mb-4">🏆</p>
          <p className="text-xl font-bold text-gray-500">No scores yet!</p>
          <p className="text-sm text-gray-400 mt-2">Play a round to get on the board</p>
        </div>
      ) : (
        <div className="bg-white/90 rounded-3xl p-4 max-w-md w-full shadow-xl space-y-2">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-2xl ${
                i === 0 ? 'bg-yellow-100' : i === 1 ? 'bg-gray-100' : i === 2 ? 'bg-orange-50' : 'bg-white'
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center">
                {i === 0 ? (
                  <span className="text-2xl">🥇</span>
                ) : i === 1 ? (
                  <span className="text-2xl">🥈</span>
                ) : i === 2 ? (
                  <span className="text-2xl">🥉</span>
                ) : (
                  <span className="text-lg font-bold text-gray-400">#{i + 1}</span>
                )}
              </div>

              {/* Avatar */}
              <AvatarDino avatar={entry.avatar} size={45} />

              {/* Name & stats */}
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-sm truncate">{entry.name}</p>
                <p className="text-xs text-gray-500">🥚 {entry.eggs} facts</p>
              </div>

              {/* Score */}
              <div className="text-right">
                <span className="text-lg font-extrabold">{entry.score}</span>
                <span className="text-xs text-gray-400 ml-1">pts</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-6 px-8 py-3 text-xl font-bold bg-white/80 text-foreground rounded-2xl shadow hover:bg-white transition-all z-10"
      >
        Back
      </button>
    </div>
  );
};

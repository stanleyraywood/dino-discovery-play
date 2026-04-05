import React, { useState, useRef } from 'react';
import { type Dinosaur, saveCollectedFact, getUnlockedDinos, getCollectedFacts } from '@/data/dinosaurs';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { DinoSelectScreen } from '@/components/game/DinoSelectScreen';
import { RunnerGame, type RunResult } from '@/components/game/RunnerGame';
import { CollectionScreen } from '@/components/game/CollectionScreen';
import { LeaderboardScreen } from '@/components/game/LeaderboardScreen';
import { ScreenTransition } from '@/components/game/ScreenTransition';
import { getPlayerStats, savePlayerStats, checkAndUnlockAchievements } from '@/data/achievements';
import { isHighScore, generateAvatar, addToLeaderboard } from '@/data/leaderboard';

type Screen = 'welcome' | 'select' | 'running' | 'collection' | 'leaderboard';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selectedDino, setSelectedDino] = useState<Dinosaur | null>(null);
  const [runKey, setRunKey] = useState(0); // Force remount on retry
  const isReplay = useRef(false);

  const handleDinoSelect = (dino: Dinosaur) => {
    setSelectedDino(dino);
    isReplay.current = false;
    setScreen('running');
  };

  // Called on game over — either from "tap to retry" or "home"
  const handleRunComplete = (result: RunResult) => {
    if (selectedDino) {
      result.factsCollected.forEach(fi => saveCollectedFact(selectedDino.id, fi));
    }

    // Update stats
    const stats = getPlayerStats();
    stats.totalRuns++;
    stats.totalDistance += result.distance;
    stats.totalEggs += result.factsCollected.length;
    if (result.distance > stats.maxDistance) stats.maxDistance = result.distance;
    if (result.stumbles === 0) stats.perfectRuns++;
    stats.dinosUnlocked = getUnlockedDinos().length;
    const allFacts = getCollectedFacts();
    stats.factsCollected = Object.values(allFacts).reduce((sum, arr) => sum + arr.length, 0);
    savePlayerStats(stats);
    checkAndUnlockAchievements(stats);

    // Auto-save to leaderboard if high score
    if (isHighScore(result.factsCollected.length, result.score) && result.score > 0) {
      const avatar = generateAvatar(selectedDino!.svgType);
      addToLeaderboard({
        id: crypto.randomUUID(),
        name: selectedDino!.name, // Use dino name as default
        score: result.score,
        eggs: result.factsCollected.length,
        dinoId: selectedDino!.id,
        avatar,
        timestamp: Date.now(),
      });
    }

    // Instant retry — just remount the game
    isReplay.current = true;
    setRunKey(k => k + 1);
    // Screen stays as 'running' — the game just restarts
  };

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onPlay={() => setScreen('select')}
            onCollection={() => setScreen('collection')}
            onLeaderboard={() => setScreen('leaderboard')}
          />
        );
      case 'select':
        return (
          <DinoSelectScreen
            onSelect={handleDinoSelect}
            onBack={() => setScreen('welcome')}
          />
        );
      case 'running':
        return selectedDino ? (
          <RunnerGame
            key={runKey}
            dino={selectedDino}
            isReplay={isReplay.current}
            onComplete={handleRunComplete}
            onBack={() => setScreen('welcome')}
          />
        ) : null;
      case 'collection':
        return <CollectionScreen onBack={() => setScreen('welcome')} />;
      case 'leaderboard':
        return <LeaderboardScreen onBack={() => setScreen('welcome')} />;
      default:
        return null;
    }
  };

  return (
    <ScreenTransition screen={screen}>
      {renderScreen()}
    </ScreenTransition>
  );
};

export default Index;

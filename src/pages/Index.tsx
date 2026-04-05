import React, { useState } from 'react';
import { type Dinosaur, saveCollectedFact } from '@/data/dinosaurs';
import { WelcomeScreen } from '@/components/game/WelcomeScreen';
import { DinoSelectScreen } from '@/components/game/DinoSelectScreen';
import { RunnerGame } from '@/components/game/RunnerGame';
import { RunCompleteScreen } from '@/components/game/RunCompleteScreen';
import { CollectionScreen } from '@/components/game/CollectionScreen';

type Screen = 'welcome' | 'select' | 'running' | 'complete' | 'collection';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selectedDino, setSelectedDino] = useState<Dinosaur | null>(null);
  const [runFacts, setRunFacts] = useState<number[]>([]);
  const [runDistance, setRunDistance] = useState(0);

  const handleDinoSelect = (dino: Dinosaur) => {
    setSelectedDino(dino);
    setScreen('running');
  };

  const handleRunComplete = (facts: number[], distance: number) => {
    if (selectedDino) {
      facts.forEach(fi => saveCollectedFact(selectedDino.id, fi));
    }
    setRunFacts(facts);
    setRunDistance(distance);
    setScreen('complete');
  };

  switch (screen) {
    case 'welcome':
      return (
        <WelcomeScreen
          onPlay={() => setScreen('select')}
          onCollection={() => setScreen('collection')}
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
          dino={selectedDino}
          onComplete={handleRunComplete}
          onBack={() => setScreen('select')}
        />
      ) : null;
    case 'complete':
      return selectedDino ? (
        <RunCompleteScreen
          dino={selectedDino}
          factsCollected={runFacts}
          distance={runDistance}
          onPlayAgain={() => setScreen('running')}
          onNewDino={() => setScreen('select')}
          onHome={() => setScreen('welcome')}
        />
      ) : null;
    case 'collection':
      return <CollectionScreen onBack={() => setScreen('welcome')} />;
    default:
      return null;
  }
};

export default Index;

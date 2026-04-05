import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type Dinosaur } from '@/data/dinosaurs';
import { DinoSVG } from './DinoSVG';

interface Obstacle {
  id: number;
  x: number;
  type: 'rock' | 'log' | 'river';
  width: number;
  height: number;
}

interface Egg {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  factIndex: number;
}

interface Props {
  dino: Dinosaur;
  onComplete: (factsCollected: number[], distance: number) => void;
  onBack: () => void;
}

const GROUND_Y = 75; // % from top
const GAME_SPEED_BASE = 2.5;
const JUMP_VELOCITY = -14;
const GRAVITY = 0.7;
const GAME_DURATION = 35000; // 35s
const OBSTACLE_INTERVAL = 2200;
const EGG_INTERVAL = 3500;

export const RunnerGame: React.FC<Props> = ({ dino, onComplete, onBack }) => {
  const [dinoY, setDinoY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isStumbling, setIsStumbling] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [distance, setDistance] = useState(0);
  const [factsCollected, setFactsCollected] = useState<number[]>([]);
  const [showFact, setShowFact] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const velocityRef = useRef(0);
  const dinoYRef = useRef(0);
  const gameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastObstacleRef = useRef(0);
  const lastEggRef = useRef(0);
  const startTimeRef = useRef(0);
  const obstacleIdRef = useRef(0);
  const stumblingRef = useRef(false);
  const factsRef = useRef<number[]>([]);

  // Countdown
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 800);
      return () => clearTimeout(t);
    } else {
      setGameStarted(true);
      startTimeRef.current = Date.now();
    }
  }, [countdown]);

  const jump = useCallback(() => {
    if (dinoYRef.current <= 0 && !stumblingRef.current) {
      velocityRef.current = JUMP_VELOCITY;
      setIsJumping(true);
    }
  }, []);

  // Input handlers
  useEffect(() => {
    if (!gameStarted) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameStarted, jump]);

  const handleTap = useCallback(() => {
    if (gameStarted) jump();
  }, [gameStarted, jump]);

  // Main game loop
  useEffect(() => {
    if (!gameStarted) return;

    let animId: number;
    const obstaclesArr: Obstacle[] = [];
    const eggsArr: Egg[] = [];
    let dist = 0;

    const loop = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;

      // End game
      if (elapsed > GAME_DURATION) {
        onComplete(factsRef.current, Math.floor(dist));
        return;
      }

      const speed = GAME_SPEED_BASE + (elapsed / GAME_DURATION) * 1.5;

      // Physics
      velocityRef.current += GRAVITY;
      dinoYRef.current += velocityRef.current;
      if (dinoYRef.current >= 0) {
        dinoYRef.current = 0;
        velocityRef.current = 0;
        setIsJumping(false);
      }
      setDinoY(dinoYRef.current);

      dist += speed * 0.1;
      setDistance(Math.floor(dist));

      // Spawn obstacles
      if (now - lastObstacleRef.current > OBSTACLE_INTERVAL) {
        const types: ('rock' | 'log' | 'river')[] = ['rock', 'log', 'river'];
        const type = types[Math.floor(Math.random() * types.length)];
        obstaclesArr.push({
          id: obstacleIdRef.current++,
          x: 110,
          type,
          width: type === 'river' ? 8 : 5,
          height: type === 'log' ? 3 : 5,
        });
        lastObstacleRef.current = now;
      }

      // Spawn eggs
      if (now - lastEggRef.current > EGG_INTERVAL) {
        const availableFacts = dino.facts
          .map((_, i) => i)
          .filter(i => !factsRef.current.includes(i));
        if (availableFacts.length > 0) {
          const factIndex = availableFacts[Math.floor(Math.random() * availableFacts.length)];
          eggsArr.push({
            id: obstacleIdRef.current++,
            x: 110,
            y: Math.random() > 0.5 ? -5 : 0,
            collected: false,
            factIndex,
          });
        }
        lastEggRef.current = now;
      }

      // Move obstacles
      for (let i = obstaclesArr.length - 1; i >= 0; i--) {
        obstaclesArr[i].x -= speed * 0.5;
        if (obstaclesArr[i].x < -20) obstaclesArr.splice(i, 1);
      }

      // Move eggs
      for (let i = eggsArr.length - 1; i >= 0; i--) {
        eggsArr[i].x -= speed * 0.5;
        if (eggsArr[i].x < -10) eggsArr.splice(i, 1);
      }

      // Collision with obstacles (generous hitbox)
      const dinoLeft = 10;
      const dinoRight = 18;
      const dinoTop = GROUND_Y + dinoYRef.current * 0.3 - 10;

      for (const obs of obstaclesArr) {
        if (
          !stumblingRef.current &&
          obs.x < dinoRight &&
          obs.x + obs.width > dinoLeft &&
          dinoYRef.current > -6
        ) {
          stumblingRef.current = true;
          setIsStumbling(true);
          setTimeout(() => {
            stumblingRef.current = false;
            setIsStumbling(false);
          }, 600);
          // Remove the obstacle
          const idx = obstaclesArr.indexOf(obs);
          if (idx > -1) obstaclesArr.splice(idx, 1);
          break;
        }
      }

      // Collect eggs
      for (const egg of eggsArr) {
        if (
          !egg.collected &&
          egg.x < dinoRight + 3 &&
          egg.x > dinoLeft - 3 &&
          Math.abs((GROUND_Y + dinoYRef.current * 0.3) - (GROUND_Y + egg.y)) < 15
        ) {
          egg.collected = true;
          factsRef.current = [...factsRef.current, egg.factIndex];
          setFactsCollected([...factsRef.current]);
          setShowFact(dino.facts[egg.factIndex].text);
          setTimeout(() => setShowFact(null), 2500);
        }
      }

      setObstacles([...obstaclesArr]);
      setEggs([...eggsArr]);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameStarted, dino, onComplete]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden cursor-pointer select-none"
      onClick={handleTap}
      onTouchStart={handleTap}
    >
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-dino-sky via-dino-skyLight to-dino-skyLight" />

      {/* Clouds - parallax */}
      <div className="absolute top-[8%] animate-cloud-drift" style={{ left: `${(Date.now() / 80) % 200 - 50}%` }}>
        <div className="w-20 h-8 bg-white/50 rounded-full" />
      </div>
      <div className="absolute top-[15%] animate-cloud-drift-slow" style={{ left: `${(Date.now() / 120) % 200 - 30}%` }}>
        <div className="w-28 h-10 bg-white/40 rounded-full" />
      </div>

      {/* Mountains - far bg */}
      <div className="absolute bottom-[25%] left-0 right-0">
        <svg viewBox="0 0 800 100" className="w-full" preserveAspectRatio="none">
          <path d="M0 100 L100 30 L200 70 L350 10 L500 50 L600 20 L750 60 L800 40 L800 100 Z" fill="#7BA67B" opacity="0.5" />
        </svg>
      </div>

      {/* Volcano */}
      <div className="absolute bottom-[25%] right-[15%]">
        <svg width="120" height="100" viewBox="0 0 120 100">
          <path d="M20 100 L50 20 Q60 5 70 20 L100 100 Z" fill="#8B7355" />
          <path d="M52 22 Q60 10 68 22" fill="#FF6B35" opacity="0.7" />
          <ellipse cx="60" cy="8" rx="8" ry="5" fill="#FF4500" opacity="0.3" className="animate-pulse" />
        </svg>
      </div>

      {/* Trees - mid bg */}
      <div className="absolute bottom-[22%] left-[5%]">
        <svg width="40" height="60" viewBox="0 0 40 60">
          <rect x="17" y="35" width="6" height="25" fill="#8B6B3B" />
          <ellipse cx="20" cy="25" rx="18" ry="25" fill="#4A8C3F" />
        </svg>
      </div>
      <div className="absolute bottom-[22%] left-[35%]">
        <svg width="30" height="50" viewBox="0 0 30 50">
          <rect x="12" y="30" width="5" height="20" fill="#8B6B3B" />
          <path d="M15 0 L0 30 L30 30 Z" fill="#3A7C2F" />
        </svg>
      </div>
      <div className="absolute bottom-[22%] right-[40%]">
        <svg width="35" height="55" viewBox="0 0 35 55">
          <rect x="14" y="32" width="6" height="23" fill="#8B6B3B" />
          <ellipse cx="17" cy="22" rx="16" ry="22" fill="#5A9C4F" />
        </svg>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-dino-grass">
        <div className="absolute top-0 left-0 right-0 h-3 bg-dino-grassDark" />
        {/* Ground details */}
        <div className="absolute top-2 left-[10%] w-3 h-4 bg-dino-grassDark rounded-t-full opacity-60" />
        <div className="absolute top-2 left-[30%] w-2 h-3 bg-dino-grassDark rounded-t-full opacity-40" />
        <div className="absolute top-2 left-[60%] w-3 h-5 bg-dino-grassDark rounded-t-full opacity-50" />
        <div className="absolute top-2 left-[80%] w-2 h-3 bg-dino-grassDark rounded-t-full opacity-60" />
      </div>

      {/* Countdown */}
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <span className="text-9xl font-extrabold text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.4)] animate-bounce">
            {countdown === 0 ? 'GO!' : countdown}
          </span>
        </div>
      )}

      {/* Dinosaur */}
      <div
        className="absolute z-20 transition-none"
        style={{
          left: '10%',
          bottom: `${25 + (-dinoY * 0.5)}%`,
        }}
      >
        <DinoSVG
          dino={dino}
          size={70}
          isRunning={gameStarted && !isStumbling}
          isJumping={isJumping}
          isStumbling={isStumbling}
        />
      </div>

      {/* Obstacles */}
      {obstacles.map(obs => (
        <div
          key={obs.id}
          className="absolute z-10"
          style={{
            left: `${obs.x}%`,
            bottom: '25%',
          }}
        >
          {obs.type === 'rock' && (
            <svg width="50" height="40" viewBox="0 0 50 40">
              <path d="M5 40 L15 10 L25 5 L35 8 L45 15 L48 40 Z" fill="#8B8B8B" />
              <path d="M15 10 L25 5 L30 15 L20 18 Z" fill="#9B9B9B" />
            </svg>
          )}
          {obs.type === 'log' && (
            <svg width="60" height="30" viewBox="0 0 60 30">
              <ellipse cx="30" cy="20" rx="28" ry="10" fill="#8B6B3B" />
              <ellipse cx="30" cy="18" rx="28" ry="8" fill="#A0825A" />
              <ellipse cx="5" cy="20" rx="5" ry="10" fill="#7B5B2B" />
              <circle cx="10" cy="18" r="3" fill="#6B4B1B" />
            </svg>
          )}
          {obs.type === 'river' && (
            <svg width="80" height="20" viewBox="0 0 80 20">
              <rect x="0" y="0" width="80" height="20" rx="3" fill="#4A9BD9" opacity="0.7" />
              <path d="M5 8 Q15 4 25 8 Q35 12 45 8 Q55 4 65 8 Q75 12 80 8" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />
            </svg>
          )}
        </div>
      ))}

      {/* Eggs */}
      {eggs.map(egg =>
        !egg.collected ? (
          <div
            key={egg.id}
            className="absolute z-15 animate-egg-float"
            style={{
              left: `${egg.x}%`,
              bottom: `${30 + egg.y}%`,
            }}
          >
            <svg width="30" height="35" viewBox="0 0 30 35">
              <ellipse cx="15" cy="18" rx="12" ry="16" fill="#FFD700" />
              <ellipse cx="15" cy="14" rx="8" ry="10" fill="#FFE44D" opacity="0.6" />
              <text x="15" y="22" textAnchor="middle" fontSize="12">🥚</text>
            </svg>
          </div>
        ) : null
      )}

      {/* Fact popup */}
      {showFact && (
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 z-30 bg-white/95 rounded-3xl px-6 py-4 max-w-sm shadow-xl animate-scale-in">
          <p className="text-lg font-bold text-center" style={{ color: dino.color }}>
            {showFact}
          </p>
        </div>
      )}

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <button
          onClick={(e) => { e.stopPropagation(); onBack(); }}
          className="px-3 py-2 text-sm font-bold bg-white/80 rounded-xl shadow"
        >
          ✕
        </button>
        <div className="flex items-center gap-4">
          <div className="bg-white/80 rounded-xl px-4 py-2 shadow">
            <span className="text-lg font-bold">🏃 {distance}m</span>
          </div>
          <div className="bg-white/80 rounded-xl px-4 py-2 shadow">
            <span className="text-lg font-bold">🥚 {factsCollected.length}/{dino.facts.length}</span>
          </div>
        </div>
      </div>

      {/* Tap hint */}
      {gameStarted && distance < 5 && (
        <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 z-20 animate-pulse">
          <p className="text-2xl font-bold text-white drop-shadow-lg">👆 Tap to Jump!</p>
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-[25.5%] left-0 right-0 h-2 bg-black/10 z-20">
        <div
          className="h-full bg-dino-orange transition-all duration-300"
          style={{ width: `${gameStarted ? Math.min(100, ((Date.now() - startTimeRef.current) / GAME_DURATION) * 100) : 0}%` }}
        />
      </div>
    </div>
  );
};

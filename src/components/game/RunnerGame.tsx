import React, { useState, useRef, useCallback } from 'react';
import { type Dinosaur } from '@/data/dinosaurs';
import { DinoSVG } from './DinoSVG';
import { ParticleRenderer, useParticles } from './Particles';
import { PHYSICS, getStreakMultiplier } from '@/lib/physics';
import { useGameInput } from '@/hooks/useGameInput';
import { useGamePhysics, type PhysicsState } from '@/hooks/useGamePhysics';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useScreenShake } from '@/hooks/useScreenShake';
import { GameAudio } from '@/lib/audio';
import { ParallaxBackground } from './ParallaxBackground';

type ObstacleType = 'rock' | 'log';

interface Obstacle { id: number; x: number; type: ObstacleType; width: number; height: number; destroying?: boolean; }
interface Fossil { id: number; x: number; y: number; collected: boolean; popping?: boolean; }
interface Egg { id: number; x: number; y: number; collected: boolean; factIndex: number; }
interface ScorePopup { id: number; x: number; y: number; text: string; color: string; }
interface ScatterFossil { id: number; variant: number; }

export interface RunResult {
  factsCollected: number[];
  distance: number;
  fossils: number;
  score: number;
  stumbles: number;
}

interface Props {
  dino: Dinosaur;
  isReplay?: boolean;
  onComplete: (result: RunResult) => void;
  onBack: () => void;
}

const BEST_SCORE_KEY = 'dino-dash-best';
function getBestScore(): number { return parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10); }
function saveBestScore(s: number) { localStorage.setItem(BEST_SCORE_KEY, String(s)); }

export const RunnerGame: React.FC<Props> = ({ dino, isReplay = false, onComplete, onBack }) => {
  // --- State ---
  const [physicsState, setPhysicsState] = useState<PhysicsState>({
    y: 0, velocityY: 0, isGrounded: true, isJumping: false,
    squash: { scaleX: 1, scaleY: 1 }, justLanded: false, justJumped: false,
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [fossils, setFossils] = useState<Fossil[]>([]);
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [fossilCount, setFossilCount] = useState(0);
  const [factsCollected, setFactsCollected] = useState<number[]>([]);
  const [showFact, setShowFact] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(isReplay);
  const [countdown, setCountdown] = useState(isReplay ? 0 : 3);
  const [isStumbling, setIsStumbling] = useState(false);
  const [invincible, setInvincible] = useState(false);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [gameElapsed, setGameElapsed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(PHYSICS.GAME_SPEED_BASE);
  const [isMuted, setIsMuted] = useState(GameAudio.isMuted());
  const [hearts, setHearts] = useState(PHYSICS.MAX_HEARTS);
  const [heartLostIndex, setHeartLostIndex] = useState(-1);
  const [streak, setStreak] = useState(0);
  const [scoreBump, setScoreBump] = useState(false);
  const [nearMiss, setNearMiss] = useState(false);
  const [speedMilestone, setSpeedMilestone] = useState<string | null>(null);
  const [scatterFossils, setScatterFossils] = useState<ScatterFossil[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [newBestFlash, setNewBestFlash] = useState(false);
  const [bestScore] = useState(getBestScore());
  const [finalScore, setFinalScore] = useState(0);

  // --- Refs ---
  const obstaclesArr = useRef<Obstacle[]>([]);
  const fossilsArr = useRef<Fossil[]>([]);
  const eggsArr = useRef<Egg[]>([]);
  const dist = useRef(0);
  const fossilCountRef = useRef(0);
  const heartsRef = useRef(PHYSICS.MAX_HEARTS);
  const streakRef = useRef(0);
  const streakTimer = useRef(0);
  const lastObstacleTime = useRef(0);
  const lastFossilTime = useRef(0);
  const nextId = useRef(0);
  const stumblingRef = useRef(false);
  const invincibleRef = useRef(false);
  const invincibleEnd = useRef(0);
  const factsRef = useRef<number[]>([]);
  const completedRef = useRef(false);
  const popupId = useRef(0);
  const stumbleCount = useRef(0);
  const prevLanded = useRef(false);
  const milestonesShown = useRef(new Set<number>());
  const lastWhooshTime = useRef(0);
  const fossilPatternStep = useRef(0);
  const factEggSpawnedAt = useRef(new Set<number>());
  const passedBest = useRef(false);
  const scoreRef = useRef(0);

  // --- Systems ---
  const { poll } = useGameInput(gameStarted && !gameOver);
  const physics = useGamePhysics();
  const { shake, style: shakeStyle } = useScreenShake();
  const { particles, emitDust, emitSparkle, emitImpact } = useParticles();

  // Countdown
  React.useEffect(() => {
    if (countdown > 0) {
      GameAudio.countdownBeep();
      const t = setTimeout(() => setCountdown(c => c - 1), 800);
      return () => clearTimeout(t);
    } else if (!gameStarted) {
      GameAudio.countdownGo();
      setGameStarted(true);
    }
  }, [countdown, gameStarted]);

  const getSpeed = useCallback((elapsed: number) => {
    const t = Math.min(elapsed / PHYSICS.GAME_DURATION, 1);
    return PHYSICS.GAME_SPEED_BASE + t * (PHYSICS.GAME_SPEED_MAX - PHYSICS.GAME_SPEED_BASE);
  }, []);

  const getObstacleInterval = useCallback((elapsed: number) => {
    const t = Math.min(elapsed / PHYSICS.GAME_DURATION, 1);
    return PHYSICS.OBSTACLE_INTERVAL_START - t * (PHYSICS.OBSTACLE_INTERVAL_START - PHYSICS.OBSTACLE_INTERVAL_MIN);
  }, []);

  const getFossilY = useCallback((elapsed: number): number => {
    const step = fossilPatternStep.current++;
    const pattern = step % 10;
    const t = elapsed / PHYSICS.GAME_DURATION;
    if (t < 0.15) return 0; // First 6s: ground only
    // Arc: ground → rising → peak → falling → ground, then 3 ground-level in a row
    const arcHeight = t > 0.5 ? -5 : -3.5;
    if (pattern <= 4) { // 5-fossil arc
      const arc = [0, -1.5, arcHeight, -1.5, 0];
      return arc[pattern];
    }
    return 0; // Ground-level run (5 fossils)
  }, []);

  const addScorePopup = useCallback((x: number, y: number, text: string, color: string) => {
    const id = popupId.current++;
    setScorePopups(prev => [...prev, { id, x, y, text, color }]);
    setTimeout(() => setScorePopups(prev => prev.filter(p => p.id !== id)), 600);
  }, []);

  const getCurrentScore = useCallback(() => {
    const multiplier = getStreakMultiplier(streakRef.current);
    return fossilCountRef.current * PHYSICS.FOSSIL_VALUE * multiplier + factsRef.current.length * PHYSICS.FACT_EGG_VALUE;
  }, []);

  const endGame = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    const score = getCurrentScore();
    setFinalScore(score);
    if (score > bestScore) {
      saveBestScore(score);
    }
    setGameOver(true);
    GameAudio.gameOver();
  }, [bestScore, getCurrentScore]);

  // --- Main Game Tick ---
  const onTick = useCallback((dt: number, elapsed: number): boolean => {
    if (completedRef.current) return false;

    // Timer end (secondary)
    if (elapsed > PHYSICS.GAME_DURATION) {
      endGame();
      return false;
    }

    const now = performance.now();
    const speed = getSpeed(elapsed);
    setGameElapsed(elapsed);
    setCurrentSpeed(speed);

    // Invincibility expiry
    if (invincibleRef.current && now > invincibleEnd.current) {
      invincibleRef.current = false;
      setInvincible(false);
    }

    // Input & physics
    const input = poll();
    const maskedInput = stumblingRef.current
      ? { jumpPressed: false, jumpHeld: false, jumpReleased: true }
      : input;
    const state = physics.tick(maskedInput, dt);
    setPhysicsState(state);

    if (state.justJumped) GameAudio.jump();
    if (state.justLanded && !prevLanded.current) {
      emitDust(12, 25);
      GameAudio.land();
    }
    prevLanded.current = state.justLanded;

    dist.current += speed * 0.1;

    // --- Streak timeout ---
    if (streakRef.current > 0 && now - streakTimer.current > PHYSICS.STREAK_TIMEOUT) {
      streakRef.current = 0;
      setStreak(0);
    }

    // --- Spawn obstacles ---
    const obsInterval = getObstacleInterval(elapsed);
    if (now - lastObstacleTime.current > obsInterval) {
      const type: ObstacleType = Math.random() > 0.4 ? 'rock' : 'log';
      obstaclesArr.current.push({ id: nextId.current++, x: 110, type, width: 5, height: type === 'log' ? 3 : 5 });
      lastObstacleTime.current = now;
    }

    // --- Spawn fossils ---
    if (now - lastFossilTime.current > PHYSICS.FOSSIL_SPAWN_INTERVAL) {
      fossilsArr.current.push({ id: nextId.current++, x: 110, y: getFossilY(elapsed), collected: false });
      lastFossilTime.current = now;
    }

    // --- Spawn fact eggs at fixed times ---
    for (const spawnTime of PHYSICS.FACT_EGG_SPAWN_TIMES) {
      if (elapsed >= spawnTime && !factEggSpawnedAt.current.has(spawnTime)) {
        factEggSpawnedAt.current.add(spawnTime);
        const available = dino.facts.map((_, i) => i).filter(i => !factsRef.current.includes(i));
        if (available.length > 0) {
          const factIndex = available[Math.floor(Math.random() * available.length)];
          eggsArr.current.push({ id: nextId.current++, x: 110, y: -3, collected: false, factIndex });
        }
      }
    }

    // --- Move everything ---
    const mv = speed * 0.5;
    for (let i = obstaclesArr.current.length - 1; i >= 0; i--) { obstaclesArr.current[i].x -= mv; if (obstaclesArr.current[i].x < -20) obstaclesArr.current.splice(i, 1); }
    for (let i = fossilsArr.current.length - 1; i >= 0; i--) { fossilsArr.current[i].x -= mv; if (fossilsArr.current[i].x < -10) fossilsArr.current.splice(i, 1); }
    for (let i = eggsArr.current.length - 1; i >= 0; i--) { eggsArr.current[i].x -= mv; if (eggsArr.current[i].x < -10) eggsArr.current.splice(i, 1); }

    // --- Obstacle collisions ---
    const dinoLeft = 10, dinoRight = 18;
    for (const obs of obstaclesArr.current) {
      if (stumblingRef.current || obs.destroying || invincibleRef.current) continue;
      if (obs.x >= dinoRight || obs.x + obs.width <= dinoLeft) continue;

      if (state.y > PHYSICS.JUMP_CLEARANCE) {
        // HIT!
        heartsRef.current--;
        setHearts(heartsRef.current);
        setHeartLostIndex(heartsRef.current); // Index of heart that was just lost

        // Scatter fossils visually
        const scatterCount = Math.min(PHYSICS.SCATTER_COUNT, fossilCountRef.current);
        if (scatterCount > 0) {
          const half = Math.floor(fossilCountRef.current / 2);
          fossilCountRef.current -= half;
          setFossilCount(fossilCountRef.current);
          setScatterFossils(Array.from({ length: scatterCount }, (_, i) => ({ id: nextId.current++, variant: (i % 8) + 1 })));
          setTimeout(() => setScatterFossils([]), PHYSICS.SCATTER_DURATION);
        }

        // Reset streak
        streakRef.current = 0;
        setStreak(0);

        // Stumble + invincibility
        stumblingRef.current = true;
        setIsStumbling(true);
        invincibleRef.current = true;
        invincibleEnd.current = now + PHYSICS.HIT_INVINCIBILITY;
        setInvincible(true);

        shake(12, 400);
        GameAudio.heartLost();
        emitImpact(obs.x, 26);

        obs.destroying = true;
        setTimeout(() => { const idx = obstaclesArr.current.indexOf(obs); if (idx > -1) obstaclesArr.current.splice(idx, 1); }, 400);
        setTimeout(() => { stumblingRef.current = false; setIsStumbling(false); }, PHYSICS.STUMBLE_DURATION);

        stumbleCount.current++;

        if (heartsRef.current <= 0) {
          setTimeout(() => endGame(), 300);
          break;
        }
        break;
      }

      // Near miss
      if (state.y <= PHYSICS.JUMP_CLEARANCE && state.y > PHYSICS.JUMP_CLEARANCE - 2) {
        GameAudio.nearMiss();
        setNearMiss(true);
        addScorePopup(obs.x, 32, 'CLOSE!', '#FF6B35');
        setTimeout(() => setNearMiss(false), 600);
      }
    }

    // Whoosh cue
    for (const obs of obstaclesArr.current) {
      if (!obs.destroying && obs.x > 22 && obs.x < 28 && now - lastWhooshTime.current > 1500) {
        GameAudio.whoosh();
        lastWhooshTime.current = now;
        break;
      }
    }

    // Speed milestones
    for (const pct of [25, 50, 75]) {
      if (!milestonesShown.current.has(pct) && (elapsed / PHYSICS.GAME_DURATION) * 100 >= pct) {
        milestonesShown.current.add(pct);
        GameAudio.speedUp();
        setSpeedMilestone('Faster!');
        setTimeout(() => setSpeedMilestone(null), 1200);
      }
    }

    // --- Collect fossils ---
    for (const fossil of fossilsArr.current) {
      if (fossil.collected) continue;
      if (fossil.x < dinoRight + 2 && fossil.x > dinoLeft - 2 && Math.abs(state.y * 0.3 - fossil.y) < 10) {
        fossil.collected = true;
        fossil.popping = true;

        // Streak
        streakRef.current++;
        streakTimer.current = now;
        setStreak(streakRef.current);

        const multiplier = getStreakMultiplier(streakRef.current);
        const points = PHYSICS.FOSSIL_VALUE * multiplier;
        fossilCountRef.current += points;
        setFossilCount(fossilCountRef.current);

        // Ascending pitch!
        GameAudio.fossilCollect(streakRef.current - 1);

        // Score popup
        const text = multiplier > 1 ? `+${points}` : '+1';
        addScorePopup(fossil.x, 30 + fossil.y, text, multiplier > 1 ? '#FF6B35' : '#E8A030');

        // Score bump animation
        setScoreBump(true);
        setTimeout(() => setScoreBump(false), 250);

        // Update running score and check best
        scoreRef.current = getCurrentScore();
        if (!passedBest.current && scoreRef.current > bestScore && bestScore > 0) {
          passedBest.current = true;
          GameAudio.newBest();
          setNewBestFlash(true);
          setTimeout(() => setNewBestFlash(false), 1500);
        }
      }
    }

    // --- Collect fact eggs ---
    for (const egg of eggsArr.current) {
      if (egg.collected || factsRef.current.includes(egg.factIndex)) continue;
      if (egg.x < dinoRight + 3 && egg.x > dinoLeft - 3 && Math.abs(state.y * 0.3 - egg.y) < 12) {
        egg.collected = true;
        factsRef.current = [...factsRef.current, egg.factIndex];
        setFactsCollected([...factsRef.current]);
        setShowFact(dino.facts[egg.factIndex].text);
        setTimeout(() => setShowFact(null), 3500);
        GameAudio.eggCollect();
        emitSparkle(egg.x, 30 + egg.y);
        addScorePopup(egg.x, 32 + egg.y, `+${PHYSICS.FACT_EGG_VALUE}`, '#FFD700');
        setScoreBump(true);
        setTimeout(() => setScoreBump(false), 250);
      }
    }

    setObstacles([...obstaclesArr.current]);
    setFossils([...fossilsArr.current]);
    setEggs([...eggsArr.current]);

    return true;
  }, [dino, poll, physics, getSpeed, getObstacleInterval, getFossilY, shake, emitDust, emitSparkle, emitImpact, addScorePopup, endGame, getCurrentScore, bestScore]);

  useGameLoop(gameStarted && !gameOver, onTick);

  // Retry handler
  const handleRetry = useCallback(() => {
    onComplete({
      factsCollected: factsRef.current,
      distance: Math.floor(dist.current),
      fossils: fossilCountRef.current,
      score: finalScore,
      stumbles: stumbleCount.current,
    });
  }, [onComplete, finalScore]);

  const dinoBottom = 25 + (-physicsState.y * 0.5);
  const { scaleX, scaleY } = physicsState.squash;
  const multiplier = getStreakMultiplier(streak);
  const displayScore = fossilCount * PHYSICS.FOSSIL_VALUE + factsCollected.length * PHYSICS.FACT_EGG_VALUE;

  return (
    <div className={`relative w-full h-screen overflow-hidden cursor-pointer select-none ${streak >= PHYSICS.STREAK_X2 ? 'animate-streak-glow' : ''}`} style={shakeStyle}>
      <ParallaxBackground speed={currentSpeed} elapsed={gameElapsed} />
      <ParticleRenderer particles={particles} />

      {/* Countdown */}
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <span className="text-9xl font-extrabold text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.4)] animate-bounce">
            {countdown === 0 ? 'GO!' : countdown}
          </span>
        </div>
      )}

      {/* Dino */}
      <div
        className={`absolute z-20 transition-none ${invincible ? 'animate-invincible' : ''}`}
        style={{ left: '10%', bottom: `${dinoBottom}%`, transform: `scaleX(${scaleX}) scaleY(${scaleY})`, transformOrigin: 'bottom center' }}
      >
        <DinoSVG dino={dino} size={70} isRunning={gameStarted && !isStumbling} isJumping={physicsState.isJumping} isStumbling={isStumbling} />
      </div>

      {/* Obstacles */}
      {obstacles.map(obs => (
        <div key={obs.id} className={`absolute z-10 ${obs.destroying ? 'animate-obstacle-break' : ''}`} style={{ left: `${obs.x}%`, bottom: '25%' }}>
          {obs.type === 'rock' ? (
            <svg width="50" height="40" viewBox="0 0 50 40"><path d="M5 40 L15 10 L25 5 L35 8 L45 15 L48 40 Z" fill="#8B8B8B"/><path d="M15 10 L25 5 L30 15 L20 18 Z" fill="#9B9B9B"/></svg>
          ) : (
            <svg width="60" height="30" viewBox="0 0 60 30"><ellipse cx="30" cy="20" rx="28" ry="10" fill="#8B6B3B"/><ellipse cx="30" cy="18" rx="28" ry="8" fill="#A0825A"/><ellipse cx="5" cy="20" rx="5" ry="10" fill="#7B5B2B"/></svg>
          )}
        </div>
      ))}

      {/* Fossils — bright amber ammonite spirals */}
      {fossils.map(f =>
        !f.collected ? (
          <div key={f.id} className="absolute z-14" style={{ left: `${f.x}%`, bottom: `${29 + f.y}%` }}>
            <svg width="18" height="18" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="9" fill="#E8A030" />
              <path d="M10 3 Q15 5 14 10 Q13 14 10 15 Q7 14 6 10 Q5 7 7 5" fill="none" stroke="#C47820" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="2.5" fill="#D49028" />
            </svg>
          </div>
        ) : f.popping ? (
          <div key={f.id} className="absolute z-14 animate-fossil-pop" style={{ left: `${f.x}%`, bottom: `${29 + f.y}%` }}>
            <svg width="18" height="18" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="9" fill="#E8A030" />
            </svg>
          </div>
        ) : null
      )}

      {/* Fact eggs — golden, glowing, rare */}
      {eggs.map(egg =>
        !egg.collected ? (
          <div key={egg.id} className="absolute z-15 animate-egg-float" style={{ left: `${egg.x}%`, bottom: `${30 + egg.y}%` }}>
            <div className="relative">
              <svg width="32" height="38" viewBox="0 0 30 35">
                <ellipse cx="15" cy="18" rx="13" ry="17" fill="#FFD700" />
                <ellipse cx="15" cy="14" rx="9" ry="11" fill="#FFE44D" opacity="0.6" />
                <text x="15" y="23" textAnchor="middle" fontSize="14" fill="#B8860B">?</text>
              </svg>
              <div className="absolute inset-0 rounded-full animate-pulse" style={{ boxShadow: '0 0 15px 5px rgba(255, 215, 0, 0.5)' }} />
            </div>
          </div>
        ) : null
      )}

      {/* Fossil scatter on hit */}
      {scatterFossils.length > 0 && (
        <div className="absolute z-25 pointer-events-none" style={{ left: '12%', bottom: `${dinoBottom}%` }}>
          {scatterFossils.map(sf => (
            <div key={sf.id} className={`absolute animate-fossil-scatter-${sf.variant}`}>
              <svg width="14" height="14" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#E8A030" opacity="0.8" /></svg>
            </div>
          ))}
        </div>
      )}

      {/* Score popups */}
      {scorePopups.map(p => (
        <div key={p.id} className="absolute z-30 pointer-events-none animate-score-float" style={{ left: `${p.x}%`, bottom: `${p.y}%` }}>
          <span className="text-lg font-extrabold drop-shadow-lg" style={{ color: p.color }}>{p.text}</span>
        </div>
      ))}

      {nearMiss && (
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 z-30 animate-near-miss">
          <span className="text-4xl font-extrabold text-dino-orange drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]">CLOSE!</span>
        </div>
      )}

      {speedMilestone && (
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 z-30 animate-speed-flash">
          <span className="text-3xl font-extrabold text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]">{speedMilestone}</span>
        </div>
      )}

      {newBestFlash && (
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 z-30 animate-new-best">
          <span className="text-4xl font-extrabold text-dino-title drop-shadow-[0_3px_0_rgba(0,0,0,0.3)]">NEW BEST!</span>
        </div>
      )}

      {/* Fact banner */}
      {showFact && (
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 z-30 animate-scale-in">
          <div className="bg-white/95 rounded-2xl px-6 py-3 max-w-md shadow-xl border-2 border-dino-eggYellow">
            <p className="text-lg font-bold text-center" style={{ color: dino.color }}>{showFact}</p>
          </div>
        </div>
      )}

      {/* HUD */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="px-2.5 py-1.5 text-sm font-bold bg-white/80 rounded-xl shadow">{'✕'}</button>
          <button onClick={(e) => { e.stopPropagation(); setIsMuted(GameAudio.toggleMute()); }} className="px-2.5 py-1.5 text-sm font-bold bg-white/80 rounded-xl shadow">{isMuted ? '🔇' : '🔊'}</button>
        </div>

        <div className="flex flex-col items-end gap-1">
          {/* Hearts */}
          <div className="flex gap-1">
            {Array.from({ length: PHYSICS.MAX_HEARTS }).map((_, i) => (
              <span key={i} className={`text-xl ${i >= hearts ? (i === heartLostIndex ? 'animate-heart-lost' : 'opacity-20 grayscale') : ''}`}>
                🥚
              </span>
            ))}
          </div>

          {/* Score + streak */}
          <div className="flex items-center gap-2">
            {multiplier > 1 && (
              <div className="bg-dino-orange/90 text-white text-xs font-extrabold px-2 py-0.5 rounded-lg">
                x{multiplier}
              </div>
            )}
            <div className={`bg-white/90 rounded-xl px-3 py-1 shadow ${scoreBump ? 'animate-score-bump' : ''}`}>
              <span className="text-lg font-extrabold">{displayScore}</span>
            </div>
          </div>

          {/* Best score */}
          <div className="text-xs font-bold text-white/60">
            BEST: {Math.max(bestScore, displayScore)}
          </div>
        </div>
      </div>

      {/* Hint */}
      {gameStarted && !gameOver && dist.current < 5 && (
        <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 z-20">
          <p className="text-2xl font-bold text-white drop-shadow-lg animate-pulse">Tap to Jump!</p>
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-[25.5%] left-0 right-0 h-1.5 bg-black/10 z-20">
        <div className="h-full bg-dino-orange/60 transition-all duration-500" style={{ width: `${gameStarted ? Math.min(100, (gameElapsed / PHYSICS.GAME_DURATION) * 100) : 0}%` }} />
      </div>

      {/* === GAME OVER OVERLAY === */}
      {gameOver && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center animate-game-over cursor-pointer"
          onClick={handleRetry}
          onTouchStart={handleRetry}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-6xl font-extrabold text-white drop-shadow-lg mb-2">
              {finalScore > bestScore ? '🏆 NEW BEST!' : 'GAME OVER'}
            </p>
            <p className="text-5xl font-extrabold text-dino-title drop-shadow-lg mb-4">{finalScore}</p>

            <div className="flex gap-6 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{fossilCount}</p>
                <p className="text-xs text-white/60">Fossils</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">🥚 {factsCollected.length}</p>
                <p className="text-xs text-white/60">Facts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{Math.floor(dist.current)}m</p>
                <p className="text-xs text-white/60">Distance</p>
              </div>
            </div>

            <p className="text-3xl font-extrabold text-white animate-pulse mb-8">TAP TO RETRY</p>

            <button
              onClick={(e) => { e.stopPropagation(); onBack(); }}
              className="px-6 py-2 text-sm font-bold bg-white/30 text-white rounded-xl hover:bg-white/50 transition-all"
            >
              Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

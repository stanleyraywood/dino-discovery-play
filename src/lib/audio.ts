// Web Audio API synthesized game sounds — zero audio files needed

let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

function osc(
  type: OscillatorType,
  freq: number,
  duration: number,
  gain: number = 0.3,
  freqEnd?: number,
) {
  if (muted) return;
  const c = getCtx();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (freqEnd) {
    o.frequency.exponentialRampToValueAtTime(freqEnd, c.currentTime + duration);
  }
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + duration);
}

function noise(duration: number, gain: number = 0.15) {
  if (muted) return;
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  source.connect(g);
  g.connect(c.destination);
  source.start();
}

export const GameAudio = {
  init() {
    // Call on first user gesture to unlock AudioContext
    getCtx();
    // Load mute preference
    muted = localStorage.getItem('dino-muted') === 'true';
  },

  jump() {
    osc('triangle', 220, 0.12, 0.25, 580);
  },

  doubleJump() {
    osc('triangle', 440, 0.1, 0.2, 880);
    setTimeout(() => osc('sine', 660, 0.08, 0.15, 1200), 40);
  },

  land() {
    osc('sine', 90, 0.1, 0.2);
    noise(0.06, 0.1);
  },

  // Mario coin inspired: two quick ascending tones
  eggCollect() {
    osc('square', 988, 0.06, 0.2);
    setTimeout(() => osc('square', 1319, 0.15, 0.2), 60);
  },

  // Comedic bonk
  obstacleHit() {
    noise(0.15, 0.25);
    osc('sine', 300, 0.25, 0.3, 80);
  },

  // Ascending arpeggio for combo
  combo(level: number) {
    const baseFreq = 523; // C5
    const notes = [1, 1.25, 1.5]; // C-E-G
    notes.forEach((ratio, i) => {
      setTimeout(() => osc('triangle', baseFreq * ratio * (1 + level * 0.1), 0.08, 0.15), i * 50);
    });
  },

  countdownBeep() {
    osc('square', 440, 0.1, 0.15);
  },

  countdownGo() {
    osc('square', 880, 0.2, 0.2);
    setTimeout(() => osc('square', 880, 0.15, 0.15), 100);
  },

  victory() {
    const notes = [523, 659, 784, 1047]; // C5-E5-G5-C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const dur = i === notes.length - 1 ? 0.4 : 0.12;
        osc('sawtooth', freq, dur, 0.15);
      }, i * 120);
    });
  },

  duck() {
    osc('sine', 180, 0.08, 0.1, 120);
  },

  // Read a fact aloud using Web Speech API
  speak(text: string) {
    if (muted) return;
    // Strip emoji from text for cleaner speech
    const clean = text.replace(/[\u{1F000}-\u{1FFFF}]/gu, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.85;  // Slightly slower for kids
    utterance.pitch = 1.1;  // Slightly higher, friendlier
    utterance.volume = 0.9;
    speechSynthesis.cancel(); // Stop any previous speech
    speechSynthesis.speak(utterance);
  },

  stopSpeak() {
    speechSynthesis.cancel();
  },

  // THE KEY SOUND: ascending pentatonic scale on consecutive fossil pickups
  // C5→D5→E5→G5→A5→C6 — resets after 400ms gap. Kids will jump just to hear the music.
  fossilCollect(streakIndex: number) {
    const pentatonic = [523, 587, 659, 784, 880, 1047]; // C D E G A C(octave)
    const noteIndex = Math.min(streakIndex, pentatonic.length - 1);
    osc('triangle', pentatonic[noteIndex], 0.08, 0.2);
  },

  heartLost() {
    osc('sine', 300, 0.15, 0.25, 100);
    setTimeout(() => osc('sine', 200, 0.2, 0.2, 80), 100);
  },

  newBest() {
    osc('triangle', 784, 0.1, 0.2);  // G5
    setTimeout(() => osc('triangle', 1047, 0.2, 0.25), 100); // C6
  },

  gameOver() {
    const notes = [440, 370, 330, 262]; // A4→F#4→E4→C4 descending
    notes.forEach((freq, i) => {
      setTimeout(() => osc('sine', freq, 0.2, 0.15), i * 150);
    });
  },

  nearMiss() {
    // Quick ascending whoosh
    osc('sine', 400, 0.15, 0.12, 800);
  },

  whoosh() {
    // Subtle warning before obstacle
    noise(0.1, 0.06);
    osc('sine', 120, 0.12, 0.06, 80);
  },

  speedUp() {
    // Quick ascending arpeggio
    osc('triangle', 330, 0.06, 0.1);
    setTimeout(() => osc('triangle', 440, 0.06, 0.1), 60);
    setTimeout(() => osc('triangle', 550, 0.08, 0.1), 120);
  },

  isMuted() {
    return muted;
  },

  toggleMute() {
    muted = !muted;
    localStorage.setItem('dino-muted', String(muted));
    return muted;
  },
};

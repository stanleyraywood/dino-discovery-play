export interface DinoFact {
  text: string;
  category: 'diet' | 'size' | 'era' | 'fun';
}

export type AbilityType = 'roar' | 'charge' | 'glide' | 'dash' | 'stomp' | 'tailwhip' | 'swim' | 'trumpet' | 'whip' | 'armor';

export interface DinoAbility {
  type: AbilityType;
  name: string;
  description: string;
  cooldown: number;  // ms
  duration: number;  // ms
  icon: string;
}

export interface Dinosaur {
  id: string;
  name: string;
  pronunciation: string;
  color: string;
  bodyColor: string;
  facts: DinoFact[];
  sizeComparison: string;
  diet: 'herbivore' | 'carnivore' | 'omnivore';
  period: string;
  funQuirk: string;
  svgType: 'biped' | 'quadruped' | 'flyer' | 'longneck';
  ability: DinoAbility;
}

export const DINOSAURS: Dinosaur[] = [
  {
    id: 'trex',
    name: 'T-Rex',
    pronunciation: 'tie-RAN-oh-SORE-us REX',
    color: '#4A7C3F',
    bodyColor: '#5A9C4F',
    facts: [
      { text: 'T-Rex had teeth as big as bananas! 🍌', category: 'fun' },
      { text: 'T-Rex was a meat eater — a carnivore! 🥩', category: 'diet' },
      { text: 'T-Rex was as tall as a 2-story building! 🏠', category: 'size' },
      { text: 'T-Rex lived 68 million years ago! ⏰', category: 'era' },
    ],
    sizeComparison: 'As long as a school bus!',
    diet: 'carnivore',
    period: 'Late Cretaceous',
    funQuirk: 'Had tiny arms but a HUGE bite!',
    svgType: 'biped',
    ability: { type: 'roar', name: 'Roar', description: 'Destroy all obstacles on screen!', cooldown: 12000, duration: 500, icon: '\u{1F4A5}' },
  },
  {
    id: 'triceratops',
    name: 'Triceratops',
    pronunciation: 'try-SER-uh-tops',
    color: '#C4873B',
    bodyColor: '#D4974B',
    facts: [
      { text: 'Triceratops had 3 horns on its head! 🦏', category: 'fun' },
      { text: 'Triceratops ate plants — a herbivore! 🌿', category: 'diet' },
      { text: 'Triceratops was as heavy as 2 cars! 🚗', category: 'size' },
      { text: 'Its frill may have been super colorful! 🌈', category: 'fun' },
    ],
    sizeComparison: 'As long as a big car!',
    diet: 'herbivore',
    period: 'Late Cretaceous',
    funQuirk: 'Its name means "three-horned face"!',
    svgType: 'quadruped',
    ability: { type: 'charge', name: 'Charge', description: 'Immunity for 3 seconds!', cooldown: 15000, duration: 3000, icon: '\u{1F6E1}' },
  },
  {
    id: 'stegosaurus',
    name: 'Stegosaurus',
    pronunciation: 'STEG-oh-SORE-us',
    color: '#6B8E4E',
    bodyColor: '#7B9E5E',
    facts: [
      { text: 'Stegosaurus had plates on its back like shields! 🛡️', category: 'fun' },
      { text: 'Its brain was the size of a walnut! 🧠', category: 'fun' },
      { text: 'Stegosaurus ate ferns and mosses! 🌿', category: 'diet' },
      { text: 'It had spikes on its tail called a "thagomizer"! 💥', category: 'fun' },
    ],
    sizeComparison: 'As long as a big van!',
    diet: 'herbivore',
    period: 'Late Jurassic',
    funQuirk: 'Had a tiny brain but was still awesome!',
    svgType: 'quadruped',
    ability: { type: 'tailwhip', name: 'Tail Whip', description: 'Smash nearby obstacles!', cooldown: 10000, duration: 400, icon: '\u{1F4AB}' },
  },
  {
    id: 'brachiosaurus',
    name: 'Brachiosaurus',
    pronunciation: 'BRAK-ee-oh-SORE-us',
    color: '#5B7B9B',
    bodyColor: '#6B8BAB',
    facts: [
      { text: 'Brachiosaurus could reach the treetops! 🌲', category: 'size' },
      { text: 'It was as tall as a 4-story building! 🏢', category: 'size' },
      { text: 'It ate up to 400 kg of plants every day! 🥗', category: 'diet' },
      { text: 'Its front legs were longer than its back legs! 🦕', category: 'fun' },
    ],
    sizeComparison: 'Taller than most buildings!',
    diet: 'herbivore',
    period: 'Late Jurassic',
    funQuirk: 'One of the tallest dinosaurs ever!',
    svgType: 'longneck',
    ability: { type: 'stomp', name: 'Stomp', description: 'Shake the ground and stun obstacles!', cooldown: 12000, duration: 600, icon: '\u{1F463}' },
  },
  {
    id: 'velociraptor',
    name: 'Velociraptor',
    pronunciation: 'veh-LOSS-ih-RAP-tor',
    color: '#8B6B3B',
    bodyColor: '#9B7B4B',
    facts: [
      { text: 'Velociraptor was actually the size of a turkey! 🦃', category: 'size' },
      { text: 'It had feathers like a bird! 🪶', category: 'fun' },
      { text: 'Velociraptor was super fast and smart! 🧠', category: 'fun' },
      { text: 'It hunted in packs with its friends! 👥', category: 'fun' },
    ],
    sizeComparison: 'About as big as a large dog!',
    diet: 'carnivore',
    period: 'Late Cretaceous',
    funQuirk: 'Was actually covered in feathers!',
    svgType: 'biped',
    ability: { type: 'dash', name: 'Dash', description: 'Speed burst and collect nearby eggs!', cooldown: 10000, duration: 1500, icon: '\u{26A1}' },
  },
  {
    id: 'pteranodon',
    name: 'Pteranodon',
    pronunciation: 'teh-RAN-oh-don',
    color: '#7B5B8B',
    bodyColor: '#8B6B9B',
    facts: [
      { text: 'Pteranodon could fly through the sky! ✈️', category: 'fun' },
      { text: 'Its wings were as wide as a small plane! 🛩️', category: 'size' },
      { text: 'It ate fish from the ocean! 🐟', category: 'diet' },
      { text: 'Pteranodon was not actually a dinosaur — it was a pterosaur! 🤓', category: 'fun' },
    ],
    sizeComparison: 'Wingspan as wide as a car!',
    diet: 'carnivore',
    period: 'Late Cretaceous',
    funQuirk: 'Had a cool crest on its head!',
    svgType: 'flyer',
    ability: { type: 'glide', name: 'Glide', description: 'Float gently for 2 seconds!', cooldown: 8000, duration: 2000, icon: '\u{1F54A}' },
  },
  {
    id: 'ankylosaurus',
    name: 'Ankylosaurus',
    pronunciation: 'ANK-ih-loh-SORE-us',
    color: '#6B6B4B',
    bodyColor: '#7B7B5B',
    facts: [
      { text: 'Ankylosaurus was like a living tank! 🪖', category: 'fun' },
      { text: 'It had a giant club on its tail! 💪', category: 'fun' },
      { text: 'Its armor was made of bony plates! 🛡️', category: 'fun' },
      { text: 'Ankylosaurus ate low-growing plants! 🌱', category: 'diet' },
    ],
    sizeComparison: 'As wide as a car!',
    diet: 'herbivore',
    period: 'Late Cretaceous',
    funQuirk: 'Even its eyelids had armor!',
    svgType: 'quadruped',
    ability: { type: 'armor', name: 'Armor Up', description: 'Block next 2 hits!', cooldown: 15000, duration: 5000, icon: '\u{1F6E1}' },
  },
  {
    id: 'spinosaurus',
    name: 'Spinosaurus',
    pronunciation: 'SPY-noh-SORE-us',
    color: '#8B4B4B',
    bodyColor: '#9B5B5B',
    facts: [
      { text: 'Spinosaurus had a giant sail on its back! ⛵', category: 'fun' },
      { text: 'It loved to swim and catch fish! 🏊', category: 'fun' },
      { text: 'Spinosaurus was even BIGGER than T-Rex! 😮', category: 'size' },
      { text: 'It had a long snout like a crocodile! 🐊', category: 'fun' },
    ],
    sizeComparison: 'Bigger than a T-Rex!',
    diet: 'carnivore',
    period: 'Late Cretaceous',
    funQuirk: 'The biggest meat-eating dinosaur ever!',
    svgType: 'biped',
    ability: { type: 'swim', name: 'Swim', description: 'Rivers become powerslides!', cooldown: 10000, duration: 3000, icon: '\u{1F30A}' },
  },
  {
    id: 'parasaurolophus',
    name: 'Parasaurolophus',
    pronunciation: 'PAR-ah-saw-ROL-oh-fus',
    color: '#4B8B7B',
    bodyColor: '#5B9B8B',
    facts: [
      { text: 'Parasaurolophus could make sounds through its crest! 🎵', category: 'fun' },
      { text: 'Its crest was like a musical instrument! 🎺', category: 'fun' },
      { text: 'It walked on both two and four legs! 🦶', category: 'fun' },
      { text: 'It ate plants and berries! 🫐', category: 'diet' },
    ],
    sizeComparison: 'As long as a big truck!',
    diet: 'herbivore',
    period: 'Late Cretaceous',
    funQuirk: 'Could "sing" through its head crest!',
    svgType: 'biped',
    ability: { type: 'trumpet', name: 'Trumpet', description: 'Stun flying enemies!', cooldown: 8000, duration: 500, icon: '\u{1F3BA}' },
  },
  {
    id: 'diplodocus',
    name: 'Diplodocus',
    pronunciation: 'dih-PLOD-oh-kus',
    color: '#5B6B3B',
    bodyColor: '#6B7B4B',
    facts: [
      { text: 'Diplodocus had one of the longest tails ever! 🦕', category: 'size' },
      { text: 'Its tail could crack like a whip! 💨', category: 'fun' },
      { text: 'Diplodocus was as long as 3 school buses! 🚌', category: 'size' },
      { text: 'It swallowed stones to help digest food! 🪨', category: 'fun' },
    ],
    sizeComparison: 'As long as 3 school buses!',
    diet: 'herbivore',
    period: 'Late Jurassic',
    funQuirk: 'Could crack its tail like a whip!',
    svgType: 'longneck',
    ability: { type: 'whip', name: 'Tail Whip', description: 'Crack your tail and clear the way!', cooldown: 10000, duration: 400, icon: '\u{1F4A8}' },
  },
];

export const getUnlockedDinos = (): string[] => {
  const saved = localStorage.getItem('dino-unlocked');
  return saved ? JSON.parse(saved) : ['trex'];
};

export const saveDinoUnlock = (dinoId: string) => {
  const current = getUnlockedDinos();
  if (!current.includes(dinoId)) {
    current.push(dinoId);
    localStorage.setItem('dino-unlocked', JSON.stringify(current));
  }
};

export const getCollectedFacts = (): Record<string, number[]> => {
  const saved = localStorage.getItem('dino-facts');
  return saved ? JSON.parse(saved) : {};
};

export const saveCollectedFact = (dinoId: string, factIndex: number) => {
  const current = getCollectedFacts();
  if (!current[dinoId]) current[dinoId] = [];
  if (!current[dinoId].includes(factIndex)) {
    current[dinoId].push(factIndex);
    localStorage.setItem('dino-facts', JSON.stringify(current));
  }
};

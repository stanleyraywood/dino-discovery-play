

# 🦕 Dino Run & Learn — Side-Scrolling Dinosaur Game for Kids (4-6yr olds)

## Concept
A colorful side-scrolling runner where kids play as different dinosaurs, dodging obstacles and collecting "fact eggs." Each run introduces a new dinosaur with fun facts, sounds, and animations. Designed for short attention spans with simple one-tap controls.

## Dinosaurs Featured (8-10)
T-Rex, Triceratops, Stegosaurus, Brachiosaurus, Velociraptor, Pteranodon, Ankylosaurus, Spinosaurus, Parasaurolophus, Diplodocus

## Screens & Flow

### 1. Welcome Screen
- Big friendly title "DINO RUN!" with animated dinosaur
- "Play" button (large, colorful, easy to tap)
- "My Dinos" button to see collection

### 2. Dinosaur Picker (before each run)
- Horizontal scroll of dinosaur silhouettes — unlocked ones are colorful, locked ones are shadowed
- T-Rex unlocked by default; others unlock as you play
- Tapping a dino shows: name, size comparison to a child, one fun fact, a "RUN!" button

### 3. The Runner Game
- **Controls**: Tap/click anywhere to jump (single mechanic — perfect for 4-6yr olds)
- **Obstacles**: Rocks, logs, rivers (simple shapes, easy to read)
- **Collectibles**: Golden "fact eggs" scattered along the path — collecting one shows a pop-up fun fact about the current dinosaur
- **Speed**: Slow and forgiving — no harsh game-overs, the dino just stumbles and keeps going (no frustration)
- **Distance meter**: Shows how far you've run with cute milestone markers
- **Background**: Scrolling prehistoric landscape (volcanoes, ferns, palm trees) using CSS parallax layers
- **Smart for young kids**: Auto-running, generous hitboxes, visual cues before obstacles, encouraging sounds

### 4. Run Complete Screen
- "Great Run!" celebration with stars and confetti animation
- Shows facts collected during the run
- If enough facts collected → unlock next dinosaur with a fun reveal animation
- "Run Again" or "Meet New Dino" buttons

### 5. My Dinos Collection
- Grid of all dinosaurs with unlock status
- Tap any unlocked dino to see:
  - Semi-realistic illustration (CSS/SVG art)
  - Name with pronunciation guide ("Try-SER-uh-tops")
  - 3-4 fun facts (diet, size, when they lived, fun quirk)
  - Size comparison visual (vs. a school bus or child)

## Kid-Friendly Game Design Strategy
- **No losing** — stumbling slows you down but never ends the game
- **Constant rewards** — eggs, stars, new dinos, fact badges
- **Short sessions** — each run is ~30-60 seconds
- **Big touch targets** — all buttons oversized for small fingers
- **Bright colors & animations** — everything bounces and sparkles
- **Progress persistence** — unlocked dinos saved to localStorage
- **Audio-free by default** — works without sound, optional fun sound effects

## Technical Approach
- Pure React + CSS animations for the runner (canvas-free for simplicity)
- SVG dinosaur illustrations with CSS animations
- Parallax scrolling background layers
- requestAnimationFrame game loop
- localStorage for progress saving
- Responsive — works on tablets (primary device for this age group)


# FOLKLORERUN Design Document

## Overview

FOLKLORERUN is a mobile-first (9:16 portrait) atmospheric interactive web experience built with React that immerses players in folklore through choice-driven gameplay. The application features three mythical creatures—Baba Yaga, Banshee, and Aswang—each with unique visual themes, mechanics, and narrative arcs.

The experience flows through distinct phases: video intro → creature selection → character reveal → story bubbles → three-level gameplay → victory/defeat end card. Each creature has a distinctive visual identity expressed through custom fonts, color palettes, particle effects, and UI styling.

**Key Design Decisions:**

- **Mobile-First Architecture**: Strict 9:16 portrait layout optimized for phone screens with safe spacing for notches
- **Data-Driven Content**: JSON configuration files (creatures_game_data.json, ui_dynamic_config.json) enable content updates without code changes
- **Accessibility-First**: Keyboard navigation, screen reader support, reduced motion mode, and visual alternatives for audio cues
- **Performance-Conscious**: CSS-based animations with JavaScript hooks, particle count limits for low-power devices, <3s load time target
- **Creature-Specific Theming**: Each creature has unique fonts, colors, button styles, particle effects, and mechanics to create distinct atmospheres

## Architecture

### Component Hierarchy

```
App (root state management)
├── IntroAnimation (video intro with skip)
├── CreatureSelection (three creature cards with fire effects)
├── CharacterReveal (entrance + close-up animations)
├── StoryBubbles (4-5 sequential bubbles with creature styling)
├── GameplayScreen
│   ├── HeroScene (background, particles, visual effects)
│   ├── AmbientEffects (fire overlays, fog, creature-specific particles)
│   ├── DecisionPanel (choice buttons with creature styling)
│   ├── Inventory (creature-specific mechanics UI)
│   └── SoundCueVisual (visual feedback for audio events)
├── EndCard (victory/defeat with dramatic animations)
├── ReducedMotionToggle (accessibility control)
└── BackButton (navigation helper)
```

### State Management

**Primary Hook: useGameEngine**

Manages all game state including:
- Current phase (intro/select/characterReveal/story/level/end)
- Selected creature and loaded data
- Animation completion flags (entranceComplete, closeUpComplete, storyComplete)
- Story bubble progression (currentBubble: 0-4)
- Level progression (currentLevel: 0-2)
- Game outcome (victory/defeat)
- Player choices and consequences
- Creature-specific mechanic state (hints, meter, tokens)

**Supporting Hooks:**
- `useAnimationController`: Maps UI config to CSS variables, manages intensity states
- `useSoundCue`: Handles audio playback and visual feedback mapping
- `useReducedMotion`: Detects and manages motion preferences

### Data Flow

1. **Initialization**: App loads JSON files (creatures_game_data.json, ui_dynamic_config.json) on mount
2. **Fallback**: If loading fails, embedded fallback content is used
3. **Creature Selection**: Player choice triggers data loading and audio playback
4. **Animation Sequencing**: State transitions drive animation phases (entrance → close-up → story → gameplay)
5. **Choice Processing**: Player selections update game state, trigger consequences, advance levels
6. **Outcome Determination**: Game logic evaluates choices to determine victory/defeat

## Components and Interfaces

### IntroAnimation

**Purpose**: Full-screen video intro with skip functionality

**Props**:
- `onComplete`: Callback when video ends or skip is clicked
- `reducedMotion`: Boolean to show CSS fallback instead of video

**Key Features**:
- Video element with `/assets/Intro.mp4` and `object-fit: cover`
- Synchronized audio from `/assets/intro audio.mp3`
- Translucent skip button (top-right)
- "FOLKLORERUN" caption (bottom-left, Rubik Wet Paint font, neon stroke)
- 300ms crossfade transition on completion

### CreatureSelection

**Purpose**: Display three creature cards with fire effects

**Props**:
- `onSelect`: Callback with selected creature ID
- `creatures`: Array of creature data

**Key Features**:
- Title: "Pick your fire — step into a story" (Playfair Display)
- Three vertical cards with creature-specific fire colors (purple/pale-blue/red)
- Keyboard navigation support (Tab, Enter, Space)
- Touch-friendly tap targets
- Dynamic fire particle effects using CSS animations

### CharacterReveal

**Purpose**: Animate creature entrance and close-up

**Props**:
- `creatureImage`: Path to creature image
- `onEntranceComplete`: Callback after entrance animation
- `onCloseUpComplete`: Callback after close-up animation

**Key Features**:
- Entrance: scale 1.05→1.0, fade-in, translateY 10px→0 (450ms)
- Close-up: scale 1.0→1.15 (500ms) for half-body framing
- Full-height image display
- Optional parallax on phone tilt

### StoryBubbles

**Purpose**: Display sequential story text with creature-specific styling

**Props**:
- `creature`: Creature ID (baba-yaga/banshee/aswang)
- `bubbles`: Array of story text strings (4-5 items)
- `onComplete`: Callback when all bubbles shown

**Creature-Specific Styling**:

**Baba Yaga**:
- Round neon purple bubbles
- Asimovian font
- Neon-purple outer glow
- Translucent black inner fill
- Subtle rune particles (CSS pseudo-elements + tiny DIVs)

**Banshee**:
- Pixel pale-blue rectangular bubbles
- Jersey 10 font
- Blocky pixel edges
- Scanline noise overlay
- Low-amplitude echo ripple lines

**Aswang**:
- Irregular dark-to-light grey gradient bubbles
- Road Rage font
- Foggy blurred edges (CSS mask/blur)
- Drifting micro-fog (semi-transparent DIVs)

**Interaction**:
- Tap to advance or use "Next" chevron
- Progress indicator dots
- Pop+fade animation (~180ms per bubble)
- Auto-proceed after last bubble (300ms delay)

### HeroScene

**Purpose**: Main visual canvas with background, particles, and atmospheric effects

**Props**:
- `creature`: Creature ID
- `sceneText`: Current level scene description
- `gameState`: Intensity level (calm/tense/critical)
- `reducedMotion`: Boolean to disable complex animations

**Key Features**:
- Creature-specific BG image with 20% blur
- Full-bleed background with subtle parallax
- Layered particle system (fog, embers, runes, echoes)
- Creature-specific visual elements (rune glows, echo waves, flickering lanterns)
- Scene text with >=4.5:1 contrast ratio
- Responsive to game state intensity

### AmbientEffects (Fire Overlay)

**Purpose**: Persistent thematic overlays that respond to game state

**Props**:
- `creature`: Creature ID
- `intensity`: Game state (calm/tense/critical)

**Creature-Specific Effects**:

**Baba Yaga**:
- Purple flame overlay
- Animated vertical noise
- Rune sparks drifting upward
- CSS vars: `--fire-color: #A67CFF`, `--fire-opacity: 0.22`, `--ember-speed: 12s`

**Banshee**:
- Pale-blue spectral flame
- Soft vertical glow bands
- Pixel-noise shimmer
- Echo waves
- CSS vars: `--fire-color: #CFE8FF`, `--echo-amplitude: 0.18`

**Aswang**:
- Red ember overlay
- Smoky ember float
- Vignette that deepens with danger
- CSS vars: `--fire-color: #E04B4B`, `--vignette-strength: 0.35`, `--heartbeat-intensity`

**Intensity Mapping**:
- Calm: Faint overlay, low particle count
- Tense: Increased opacity, more particles, screen shake on wrong answers
- Critical: Full opacity, heartbeat pulse, chromatic aberration, fast particle bursts

### DecisionPanel

**Purpose**: Display choice buttons with creature-specific styling and micro-interactions

**Props**:
- `creature`: Creature ID
- `choices`: Array of choice objects
- `onChoice`: Callback with selected choice
- `disabled`: Boolean to prevent interaction
- `consequence`: Text to display after choice

**Creature-Specific Button Styling**:

**Baba Yaga**:
- Glass neon purple rounded rectangles
- Inner bevel, outer glow
- Rune icon on left
- Uppercase semibold text (Asimovian)
- Tap: scale(0.98), purple glow pulse, paper-rustle cue
- Disabled: Desaturated purple, lower opacity

**Banshee**:
- Pixel pale-blue rectangles
- Blocky pixel border
- Faint scanline noise overlay
- Jersey 10 font
- Tap: Pixel-snap jitter (1 frame), ribbon-snap cue
- Focus: Bright pale-blue pixel outline

**Aswang**:
- Irregular dark grilled buttons
- Foggy edges, ember inner glow
- Small uppercase serif text (Road Rage)
- Tap: Ember-wave ripple bottom-to-top, vignette flash, ember-clink cue
- Disabled: Lower opacity

**Accessibility**:
- Large thumb-friendly targets
- Pinned near bottom-center
- Keyboard navigation (Tab, Enter, Space)
- ARIA labels for screen readers
- High-contrast text
- Consequence text displays within 200ms

### Inventory

**Purpose**: Display and manage creature-specific mechanics

**Props**:
- `creature`: Creature ID
- `mechanicState`: Current state of creature mechanic
- `onMechanicUpdate`: Callback for mechanic interactions

**Creature-Specific Mechanics**:

**Baba Yaga - Riddles**:
- Riddle text display
- Hint reveal after incorrect attempt
- Runes glow brighter with correct steps
- Wrong answers: rune flicker, cursor warp effect

**Banshee - Calmness Meter**:
- Radial meter visualization
- Responds to player choices
- Echo-wave amplitude grows with danger
- Wrong answers: meter dips, echo ripple increases
- Critical state: frost screen edges

**Aswang - Token Deduction**:
- Token display (salt, ember, name)
- Combination validation
- Light-radius shrinks with wrong choices
- Vignette darkens progressively
- Critical state: reflection-scan flicker, zoom-in pulses

**Requirements**:
- Immediate visual updates (<100ms)
- Input validation against creature rules
- Clear visual feedback for all interactions

### EndCard

**Purpose**: Display victory or defeat with dramatic animations

**Props**:
- `outcome`: 'victory' or 'defeat'
- `creature`: Creature ID
- `outcomeText`: Dynamic text from JSON
- `onPlayAgain`: Callback to restart
- `onHome`: Callback to return to selection

**Victory Animation**:
- Display creature image (Aswang uses `Aswang_defeated.jpg`, others use base)
- Dissolve effect bottom→top in creature's fire color
- Animated CSS gradient mask with mix-blend-mode
- "Defeated!" text in matching fire color
- "Play Again" and "Home" buttons

**Defeat Animation**:
- Display base creature image
- Dramatic close-up zoom (scale 1.05→1.2, 400ms)
- Blur/radiant shift, vignette increase
- Aswang: Emphasize eyes with subtle red flare
- "You Died" text in creature fire glow
- Dynamic cause-of-death line from lose_text
- "Try Again" and "Home" buttons

### SoundCueVisual

**Purpose**: Provide visual feedback for audio events

**Props**:
- `cue`: Sound cue name (paper-rustle/ribbon-snap/ember-clink/heartbeat)
- `position`: {x, y} coordinates for effect origin

**Key Features**:
- Textual descriptor display
- Visual ripple effect at trigger location
- Creature-specific styling
- Accessible captions for all sound events

### ReducedMotionToggle

**Purpose**: Manual control for motion preferences

**Props**:
- `enabled`: Current reduced motion state
- `onChange`: Callback with new state

**Key Features**:
- Detects prefers-reduced-motion media query
- Manual toggle button
- Immediate state updates
- Disables: parallax, particles, auto zooms, complex animations
- Maintains: core functionality, choice interactions
- Provides: static visual alternatives

## Data Models

### Creature Data Structure (creatures_game_data.json)

```json
{
  "creatures": [
    {
      "id": "baba-yaga",
      "name": "Baba Yaga",
      "description": "The witch of the birch forest",
      "image": "/assets/Baba yaga.jpg",
      "bgImage": "/assets/Baba Yaga BG.jpg",
      "audio": "/assets/Baba yaga audio.mp3",
      "fireColor": "#A67CFF",
      "font": "Asimovian",
      "storyBubbles": [
        "In a ring of birch the hut wanders...",
        "Baba Yaga asks riddles...",
        "She is neither wholly guardian...",
        "Speak carefully..."
      ],
      "levels": [
        {
          "sceneText": "Level description (12-45 words)",
          "choices": [
            {
              "text": "Choice text",
              "correct": true,
              "consequence": "Consequence text"
            }
          ]
        }
      ],
      "mechanic": {
        "type": "riddle",
        "data": {
          "riddles": [],
          "hints": []
        }
      },
      "outcomes": {
        "victory": ["Victory text variant 1 (12-30 words)", "..."],
        "defeat": ["Defeat text variant 1 (12-30 words)", "..."]
      }
    }
  ]
}
```

### UI Config Structure (ui_dynamic_config.json)

```json
{
  "creatures": {
    "baba-yaga": {
      "palette": {
        "primary": "#A67CFF",
        "secondary": "#1A0033",
        "accent": "#E0B3FF"
      },
      "animations": {
        "fireOpacity": 0.22,
        "emberSpeed": "12s",
        "particleCount": {
          "calm": 15,
          "tense": 30,
          "critical": 50
        }
      },
      "soundCues": {
        "correct": "paper-rustle",
        "incorrect": "rune-flicker",
        "critical": "heartbeat"
      }
    }
  },
  "transitions": {
    "crossfade": "300ms",
    "stateChange": "420ms",
    "buttonPress": "180ms"
  }
}
```

### Game State Model

```javascript
{
  phase: 'intro' | 'select' | 'characterReveal' | 'story' | 'level' | 'end',
  selectedCreature: string | null,
  creatureData: Object | null,
  animationFlags: {
    entranceComplete: boolean,
    closeUpComplete: boolean,
    storyComplete: boolean
  },
  storyProgress: {
    currentBubble: number, // 0-4
    totalBubbles: number
  },
  gameProgress: {
    currentLevel: number, // 0-2
    totalLevels: 3,
    choices: Array<{level: number, choice: number, correct: boolean}>
  },
  mechanicState: {
    // Creature-specific state
    hintsRevealed: number, // Baba Yaga
    calmnessLevel: number, // Banshee (0-100)
    tokensUsed: Array<string> // Aswang
  },
  outcome: 'victory' | 'defeat' | null,
  outcomeText: string,
  intensity: 'calm' | 'tense' | 'critical',
  reducedMotion: boolean
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


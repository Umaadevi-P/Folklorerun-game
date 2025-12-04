# Requirements Document

## Introduction

FOLKLORERUN is a mobile-first (9:16 portrait) atmospheric interactive web experience that brings legendary creatures from folklore to life through immersive storytelling and choice-driven gameplay. Players encounter three mythical beings—Baba Yaga, Banshee, and Aswang—navigating challenges inspired by their cultural stories through sequential story bubbles and creature-specific mechanics. The application delivers a cinematic, haunted experience through video intro, character animations, persistent fire overlays, and dynamic UI elements that respond to player choices. The app is strictly designed for phone-size viewports with full-screen canvas and safe spacing for notches.

## Glossary

- **FOLKLORERUN System**: The complete web application including UI, game engine, animation system, and data integration
- **Creature**: One of three playable folklore entities (Baba Yaga, Banshee, or Aswang) with unique mechanics and story
- **Level**: A discrete story segment within a creature's narrative, containing choices and consequences
- **Decision Panel**: The interactive UI component where players make choices
- **Hero Scene**: The main visual canvas displaying the current story scene with atmospheric effects
- **Game Engine**: The state management system controlling game flow, choices, and outcomes
- **UI Config**: The ui_dynamic_config.json file containing visual rules, palettes, and animation parameters
- **Creature Data**: The creatures_game_data.json file containing story content, levels, and mechanics
- **Intro Video**: The opening full-screen video (`intro.mp4`) with audio that plays before creature selection
- **Story Bubbles**: Sequential talking bubbles (4-5) that reveal the creature's story with creature-specific styling
- **Fire Overlay**: Persistent animated CSS overlay matching creature theme (purple/pale-blue/red flames)
- **Character Animation**: Entrance animation (scale + fade + translateY) followed by close-up camera effect
- **Background Image**: Creature-specific background image with blur applied during encounter phase
- **Correctness Property**: A universally quantified rule that must hold across all valid game states
- **Round Trip**: The process of serializing and deserializing data to verify data integrity

## Requirements

### Requirement 1

**User Story:** As a player, I want to experience a full-screen video intro with audio, so that I am immersed in the folklore theme from the start.

#### Acceptance Criteria

1. WHEN the application loads THEN the FOLKLORERUN System SHALL display a full-screen autoplay muted video element playing `/assets/Intro.mp4` with `object-fit: cover` for 9:16 aspect ratio
2. WHEN the intro video plays THEN the FOLKLORERUN System SHALL play audio from `/assets/intro audio.mp3` synchronized with the video
3. WHEN the intro video displays THEN the FOLKLORERUN System SHALL show a translucent "Skip" button in the top-right corner and a caption "FOLKLORERUN" in Rubik Wet Paint font bottom-left with subtle neon stroke
4. WHEN the video ends or Skip button is tapped THEN the FOLKLORERUN System SHALL transition to creature selection with a 300ms crossfade
5. WHEN reduced motion is enabled THEN the FOLKLORERUN System SHALL display the existing CSS title animation as fallback instead of the video

### Requirement 2

**User Story:** As a player, I want to select from three creature cards with dynamic fire effects, so that I can choose which folklore story to experience.

#### Acceptance Criteria

1. WHEN the creature selection screen displays THEN the FOLKLORERUN System SHALL present three large vertical tappable cards with title "Pick your fire — step into a story" in Playfair Display font
2. WHEN displaying creature cards THEN the FOLKLORERUN System SHALL show Baba Yaga with purple fire, Banshee with pale blue fire, and Aswang with red fire, each with creature name and small description
3. WHEN a player taps a creature card THEN the FOLKLORERUN System SHALL load the creature's high-res image from `/assets/` (exact filename: `Baba yaga.jpg`, `Banshee.jpg`, or `Aswang.jpg`) and start playing creature-specific audio
4. WHEN a creature is selected THEN the FOLKLORERUN System SHALL display the creature image full-height and apply entrance animation (scale 1.05→1.0, fade-in, translateY 10px→0) over 450ms
5. WHEN entrance animation completes THEN the FOLKLORERUN System SHALL animate a close-up camera effect (scale 1.0→1.15) over 500ms for tighter half-body framing where story bubbles will appear
6. WHEN close-up animation completes THEN the FOLKLORERUN System SHALL display story bubbles over the creature image

### Requirement 3

**User Story:** As a player, I want to experience the creature's story through sequential talking bubbles, so that I understand the folklore narrative before making choices.

#### Acceptance Criteria

1. WHEN close-up animation completes THEN the FOLKLORERUN System SHALL display 4-5 story bubbles sequentially with gentle delays and pop+fade animation (~180ms each) appearing from the right side
2. WHEN displaying Baba Yaga story THEN the FOLKLORERUN System SHALL render round neon purple bubbles with Asimovian font, neon-purple outer glow, translucent black inner fill, and subtle rune particles drifting inside, positioned to the right of the character
3. WHEN displaying Banshee story THEN the FOLKLORERUN System SHALL render pixel pale-blue rectangular bubbles with Jersey 10 font, blocky pixel edges, pale-blue fill, thin darker-blue pixel border, scanline noise overlay, and low-amplitude echo ripple lines, positioned to the right of the character
4. WHEN displaying Aswang story THEN the FOLKLORERUN System SHALL render irregular dark grey to light grey gradient bubbles with Road Rage font, foggy blurred edges using CSS mask or blur, and drifting micro-fog around bubble edges, positioned to the right of the character
5. WHEN a story bubble displays THEN the FOLKLORERUN System SHALL allow tap to advance to next bubble and show progress indicator dots for remaining bubbles
6. WHEN all story bubbles complete THEN the FOLKLORERUN System SHALL proceed automatically after 300ms to the encounter phase with creature-specific BG image

### Requirement 4

**User Story:** As a player, I want to navigate through three levels of story challenges, so that I can progress through the creature's narrative.

#### Acceptance Criteria

1. WHEN story bubbles complete THEN the FOLKLORERUN System SHALL switch background to creature-specific BG image with 20% blur (exact filenames: `Baba Yaga BG.jpg`, `Banshee BG.jpg`, `Aswang BG.jpg`)
2. WHEN a level begins THEN the FOLKLORERUN System SHALL display the level scene text and two choice options
3. WHEN a player makes a choice THEN the FOLKLORERUN System SHALL update the game state and display consequence text
4. WHEN a level is completed THEN the FOLKLORERUN System SHALL transition to the next level or end screen
5. WHEN all three levels are completed successfully THEN the FOLKLORERUN System SHALL display the victory end card
6. WHEN a player makes a failing choice THEN the FOLKLORERUN System SHALL display the defeat end card

### Requirement 5

**User Story:** As a player, I want persistent thematic fire overlays that respond to game state, so that the atmosphere intensifies with danger.

#### Acceptance Criteria

1. WHEN Baba Yaga encounter begins THEN the FOLKLORERUN System SHALL display purple flame overlay with animated vertical noise, rune sparks drifting upward, using CSS variables `--fire-color: #A67CFF`, `--fire-opacity: 0.22`, `--ember-speed: 12s`
2. WHEN Banshee encounter begins THEN the FOLKLORERUN System SHALL display pale-blue spectral flame with soft vertical glow bands, pixel-noise shimmer, echo waves, using CSS variables `--fire-color: #CFE8FF`, `--echo-amplitude: 0.18`
3. WHEN Aswang encounter begins THEN the FOLKLORERUN System SHALL display red ember overlay with smoky ember float, vignette that deepens with danger, using CSS variables `--fire-color: #E04B4B`, `--vignette-strength: 0.35`, `--heartbeat-intensity`
4. WHEN game state is calm THEN the FOLKLORERUN System SHALL apply faint overlay with low particle count
5. WHEN game state is tense THEN the FOLKLORERUN System SHALL increase overlay opacity and particle activity
6. WHEN game state is critical THEN the FOLKLORERUN System SHALL apply full overlay opacity with heartbeat pulse visual and fast particle bursts

### Requirement 6

**User Story:** As a player, I want immediate visual and textual feedback for my choices, so that I understand the consequences of my actions.

#### Acceptance Criteria

1. WHEN a player selects a choice THEN the FOLKLORERUN System SHALL display consequence text within 200 milliseconds
2. WHEN a correct choice is made THEN the FOLKLORERUN System SHALL trigger positive UI reactions specified in UI Config
3. WHEN an incorrect choice is made THEN the FOLKLORERUN System SHALL trigger negative UI reactions specified in UI Config
4. WHEN UI reactions are triggered THEN the FOLKLORERUN System SHALL apply CSS animations matching the creature's visual theme
5. WHEN consequence text displays THEN the FOLKLORERUN System SHALL maintain readability with contrast ratio >= 4.5:1

### Requirement 7

**User Story:** As a player, I want creature-specific button styles with micro-interactions, so that each encounter feels distinct and tactile.

#### Acceptance Criteria

1. WHEN displaying Baba Yaga buttons THEN the FOLKLORERUN System SHALL render glass neon purple rounded rectangles with inner bevel, outer glow, rune icon on left, uppercase semibold label text in Asimovian font, and on tap: scale(0.98), purple glow pulse, paper-rustle visual cue
2. WHEN displaying Banshee buttons THEN the FOLKLORERUN System SHALL render pixel pale-blue rectangles with blocky pixel border, faint scanline noise overlay, text in Jersey 10 font, and on tap: pixel-snap jitter animation (1 frame), ribbon-snap visual cue, with bright pale-blue pixel outline on focus
3. WHEN displaying Aswang buttons THEN the FOLKLORERUN System SHALL render irregular dark grilled buttons with foggy edges, ember inner glow, small uppercase serif text in Road Rage font, and on tap: ember-wave ripple bottom-to-top, vignette flash, ember-clink visual cue
4. WHEN buttons are rendered THEN the FOLKLORERUN System SHALL make them large, thumb-friendly, pinned near bottom-center, with accessible labels and high-contrast text
5. WHEN a button is disabled THEN the FOLKLORERUN System SHALL apply desaturated styling with lower opacity

### Requirement 8

**User Story:** As a player, I want creature-specific interactive mechanics, so that each folklore encounter feels distinct and authentic.

#### Acceptance Criteria

1. WHEN playing Baba Yaga THEN the FOLKLORERUN System SHALL present riddle challenges with hint reveals after incorrect attempts, runes glow brighter with correct steps, wrong answers cause rune flicker and cursor warp effect
2. WHEN playing Banshee THEN the FOLKLORERUN System SHALL display a calmness radial meter that responds to choices, echo-wave amplitude grows with danger, wrong answers dip meter and increase echo ripple, critical state frosts screen edges
3. WHEN playing Aswang THEN the FOLKLORERUN System SHALL provide token-based deduction mechanics (salt, ember, name), light-radius shrinks with wrong choices, vignette darkens, critical state shows reflection-scan flicker and zoom-in pulses
4. WHEN a player interacts with creature-specific mechanics THEN the FOLKLORERUN System SHALL validate inputs against the creature's core mechanic rules
5. WHEN mechanic interactions occur THEN the FOLKLORERUN System SHALL update visual indicators (meters, tokens, hints) immediately

### Requirement 9

**User Story:** As a player, I want keyboard and touch accessibility, so that I can interact with the game using my preferred input method on mobile.

#### Acceptance Criteria

1. WHEN navigating choices THEN the FOLKLORERUN System SHALL support keyboard tab navigation with visible focus rings and touch-friendly tap targets
2. WHEN a choice is focused THEN the FOLKLORERUN System SHALL allow selection via Enter or Space keys or touch tap
3. WHEN tapping interactive elements THEN the FOLKLORERUN System SHALL display visual feedback within 100 milliseconds
4. WHEN interactive elements are rendered THEN the FOLKLORERUN System SHALL include aria-labels for screen readers and aria-live regions for story bubbles
5. WHEN keyboard focus changes THEN the FOLKLORERUN System SHALL maintain logical tab order through all interactive elements

### Requirement 10

**User Story:** As a player, I want audio cues represented visually, so that I can experience the atmosphere without requiring sound.

#### Acceptance Criteria

1. WHEN no creature is selected THEN the FOLKLORERUN System SHALL play `Background audio.mp3` during intro and selection
2. WHEN a creature is selected THEN the FOLKLORERUN System SHALL play creature-specific audio (exact filenames: `Baba yaga audio.mp3`, `Banshee audio.mp3`, `Aswang audio.mp3`)
3. WHEN an audio cue is triggered THEN the FOLKLORERUN System SHALL display a textual descriptor and render a visual ripple effect at the trigger location
4. WHEN audio cues are specified in UI Config THEN the FOLKLORERUN System SHALL map them to visual feedback animations (paper-rustle, ribbon-snap, ember-clink, heartbeat)
5. WHEN the playSoundCue function is called THEN the FOLKLORERUN System SHALL log the cue name and trigger visual feedback

### Requirement 11

**User Story:** As a player, I want the application to load story and UI configuration from JSON files, so that content can be updated without code changes.

#### Acceptance Criteria

1. WHEN the application initializes THEN the FOLKLORERUN System SHALL fetch creatures_game_data.json from the root directory
2. WHEN the application initializes THEN the FOLKLORERUN System SHALL fetch ui_dynamic_config.json from the root directory
3. WHEN JSON files are successfully loaded THEN the FOLKLORERUN System SHALL parse and validate the data structure
4. WHEN JSON files fail to load THEN the FOLKLORERUN System SHALL use embedded fallback content for all creatures
5. WHEN parsing JSON data THEN the FOLKLORERUN System SHALL handle missing fields gracefully with safe defaults

### Requirement 12

**User Story:** As a player, I want to experience canonical story text through sequential bubbles, so that the narrative is consistent and atmospheric.

#### Acceptance Criteria

1. WHEN displaying Baba Yaga story THEN the FOLKLORERUN System SHALL show exactly 4 bubbles with canonical text: "In a ring of birch the hut wanders...", "Baba Yaga asks riddles...", "She is neither wholly guardian...", "Speak carefully..."
2. WHEN displaying Banshee story THEN the FOLKLORERUN System SHALL show exactly 4 bubbles with canonical text: "By hedgerow and stream...", "Her cry is a thread...", "To soothe her is to acknowledge...", "Listen and answer..."
3. WHEN displaying Aswang story THEN the FOLKLORERUN System SHALL show exactly 5 bubbles with canonical text: "In the small lanes...", "The Aswang wears faces...", "Salt burns paths...", "Watch reflections...", "Act in sequence..."
4. WHEN displaying win conditions THEN the FOLKLORERUN System SHALL render victory text variants from JSON (12-30 words)
5. WHEN displaying lose conditions THEN the FOLKLORERUN System SHALL render defeat text variants from JSON using lose_text field (12-30 words)

### Requirement 13

**User Story:** As a player, I want dynamic UI that responds to game state, so that the interface reflects the tension and mood of each moment.

#### Acceptance Criteria

1. WHEN the game state is "calm" THEN the FOLKLORERUN System SHALL apply faint overlay with low particle count per UI Config
2. WHEN the game state is "tense" THEN the FOLKLORERUN System SHALL increase overlay opacity, particle activity, and enable screen shake on wrong answers per UI Config
3. WHEN the game state is "critical" THEN the FOLKLORERUN System SHALL apply full overlay opacity with heartbeat pulse visual, chromatic aberration effect, and fast particle bursts on wrong answers
4. WHEN UI Config specifies animation parameters THEN the FOLKLORERUN System SHALL map values to CSS variables and animation timings
5. WHEN transitioning between states THEN the FOLKLORERUN System SHALL animate changes smoothly over 300-420 milliseconds

### Requirement 14

**User Story:** As a player, I want a reduced motion option, so that I can enjoy the experience without triggering motion sensitivity.

#### Acceptance Criteria

1. WHEN the application loads THEN the FOLKLORERUN System SHALL detect the user's prefers-reduced-motion setting
2. WHEN reduced motion is enabled THEN the FOLKLORERUN System SHALL disable parallax, particle, auto zooms, and complex animations
3. WHEN reduced motion is enabled THEN the FOLKLORERUN System SHALL show CSS title animation fallback instead of video intro
4. WHEN a reduced motion toggle is clicked THEN the FOLKLORERUN System SHALL update animation states immediately
5. WHEN reduced motion is active THEN the FOLKLORERUN System SHALL display static visual alternatives for animated effects while maintaining core functionality

### Requirement 15

**User Story:** As a player, I want victory and defeat end cards with dramatic animations, so that I receive clear closure on my story outcome.

#### Acceptance Criteria

1. WHEN a player wins THEN the FOLKLORERUN System SHALL display creature image (for Aswang use `Aswang_defeated.jpg`, others use base image) and animate dissolve effect bottom→top in creature's fire color using animated CSS gradient mask with mix-blend-mode
2. WHEN dissolve animation completes THEN the FOLKLORERUN System SHALL show centered text "Defeated!" in matching fire color with two buttons: "Play Again" and "Home"
3. WHEN a player loses THEN the FOLKLORERUN System SHALL display base creature image and animate dramatic close-up zoom (scale 1.05→1.2) over 400ms with blur/radiant shift and vignette increase
4. WHEN Aswang defeat zoom occurs THEN the FOLKLORERUN System SHALL emphasize eyes with subtle red flare during zoom-in
5. WHEN defeat animation completes THEN the FOLKLORERUN System SHALL show centered text "You Died" in creature fire glow with dynamic cause-of-death line from lose_text, then "Try Again" and "Home" buttons

### Requirement 16

**User Story:** As a developer, I want the application to be strictly mobile-first with 9:16 portrait layout, so that it works perfectly on phone screens.

#### Acceptance Criteria

1. WHEN the application renders THEN the FOLKLORERUN System SHALL use 9:16 portrait aspect ratio with full-screen canvas and safe top/bottom spacing for notches
2. WHEN rendering on desktop THEN the FOLKLORERUN System SHALL show a centered 9:16 canvas only
3. WHEN rendering visual effects THEN the FOLKLORERUN System SHALL use CSS and small JavaScript hooks tuned for phone performance
4. WHEN particle counts are set THEN the FOLKLORERUN System SHALL limit counts for low-power mobile devices
5. WHEN the application loads THEN the FOLKLORERUN System SHALL complete initial load within 3 seconds on standard mobile connections

### Requirement 17

**User Story:** As a developer, I want to use exact asset filenames from `/assets/` directory, so that all media loads correctly.

#### Acceptance Criteria

1. WHEN loading video THEN the FOLKLORERUN System SHALL use exact filename `/assets/Intro.mp4`
2. WHEN loading creature images THEN the FOLKLORERUN System SHALL use exact filenames `/assets/Baba yaga.jpg`, `/assets/Banshee.jpg`, `/assets/Aswang.jpg`, `/assets/Aswang_defeated.jpg`
3. WHEN loading background images THEN the FOLKLORERUN System SHALL use exact filenames `/assets/Baba Yaga BG.jpg`, `/assets/Banshee BG.jpg`, `/assets/Aswang BG.jpg`
4. WHEN loading audio THEN the FOLKLORERUN System SHALL use exact filenames `/assets/intro audio.mp3`, `/assets/Background audio.mp3`, `/assets/Baba yaga audio.mp3`, `/assets/Banshee audio.mp3`, `/assets/Aswang audio.mp3`
5. WHEN any asset is missing THEN the FOLKLORERUN System SHALL show graceful fallback with soft gradient and "Image unavailable" text with option to continue in text-only mode

### Requirement 18

**User Story:** As a player, I want all UI elements for each creature to use their distinctive font, so that the visual identity is consistent and immersive.

#### Acceptance Criteria

1. WHEN displaying Baba Yaga UI elements THEN the FOLKLORERUN System SHALL use Asimovian font from Google Fonts for all text including story bubbles, buttons, messages, and UI labels
2. WHEN displaying Banshee UI elements THEN the FOLKLORERUN System SHALL use Jersey 10 font from Google Fonts for all text including story bubbles, buttons, messages, and UI labels
3. WHEN displaying Aswang UI elements THEN the FOLKLORERUN System SHALL use Road Rage font from Google Fonts for all text including story bubbles, buttons, messages, and UI labels
4. WHEN fonts fail to load THEN the FOLKLORERUN System SHALL provide appropriate fallback fonts that maintain similar visual weight
5. WHEN rendering creature-specific text THEN the FOLKLORERUN System SHALL ensure readability with proper sizing and contrast

### Requirement 19

**User Story:** As a developer, I want clear component separation with evocative comments, so that the codebase is maintainable and captures the haunted atmosphere.

#### Acceptance Criteria

1. WHEN the application is structured THEN the FOLKLORERUN System SHALL separate concerns into distinct React components (IntroVideo, CreatureSelection, CharacterReveal, StoryBubbles, HeroScene, DecisionPanel, FireOverlay, EndCard)
2. WHEN game logic is implemented THEN the FOLKLORERUN System SHALL encapsulate state management in a custom useGameEngine hook
3. WHEN components are created THEN the FOLKLORERUN System SHALL use functional components with hooks exclusively
4. WHEN files are organized THEN the FOLKLORERUN System SHALL follow a clear directory structure (components, hooks, styles, assets)
5. WHEN code is written THEN the FOLKLORERUN System SHALL include short evocative comments (1-2 lines) explaining mood and key logic (e.g., "// neon runes: glow when player chooses correctly — little praise from the woods")

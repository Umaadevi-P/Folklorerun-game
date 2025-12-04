# Implementation Plan

- [x] 1. Set up project structure and dependencies





  - Create React project with minimal dependencies (React 18+, react-dom)
  - Set up directory structure: src/components, src/hooks, src/styles, public
  - Configure package.json with exact versions
  - Create public/index.html with viewport meta tags
  - Install fast-check for property-based testing
  - _Requirements: 14.1, 15.4_
- [ ] 2. Create JSON data files and fallback content
















- [ ] 2. Create JSON data files and fallback content

  - Create creatures_game_data.json with all three creatures (Baba Yaga, Banshee, Aswang)
  - Include enriched text variants (12-45 words for intros/scenes, 12-30 for outcomes)
  - Add riddle data for Baba Yaga with hints and answer keys
  - Create ui_dynamic_config.json with color palettes, animation parameters, sound cues
  - Implement embedded fallback content in code for all creatures
  - _Requirements: 9.1, 9.2, 10.1, 10.2, 10.3, 10.4_
-

- [x] 3. Update useGameEngine hook with animation sequencing










  - Update state management for game phases (intro/select/characterReveal/story/level/end)
  - Implement creature selection logic with audio playback
  - Add animation state tracking (entranceComplete, closeUpComplete, storyComplete)
  - Add story bubble progression tracking (4-5 bubbles)
  - Add level progression tracking (0-2)
  - Implement choice validation and consequence handling
  - Add victory/defeat determination logic
  - Implement restart functionality
  - _Requirements: 2.3, 2.4, 2.5, 3.1, 3.6, 4.4, 4.5, 4.6_

- [x] 3.1 Write property test for level progression





  - **Property 3: Level progression maintains sequence**
  - **Validates: Requirements 3.3**

- [x] 3.2 Write property test for correct choice progression






  - **Property 4: Correct choices lead to progression**
  - **Validates: Requirements 3.4**

- [x] 3.3 Write property test for incorrect choice defeat






  - **Property 5: Incorrect choices lead to defeat**
  - **Validates: Requirements 3.5**

- [x] 3.4 Write property test for restart functionality





  - **Property 14: Restart resets to creature selection**
  - **Validates: Requirements 13.5**

- [x] 4. Update IntroAnimation component for video playback




  - Replace CSS animation with full-screen video element playing `/assets/Intro.mp4`
  - Implement `object-fit: cover` for 9:16 aspect ratio
  - Add audio playback from `/assets/intro audio.mp3` synchronized with video
  - Display translucent "Skip" button top-right
  - Show caption "FOLKLORERUN" bottom-left in Rubik Wet Paint font with neon stroke
  - Implement 300ms crossfade transition to creature selection when video ends or skip tapped
  - Keep existing CSS title animation as fallback for reduced motion
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 4.1 Write property test for intro animation completion






  - **Property 1: Intro animation completion triggers state transition**
  - **Validates: Requirements 1.3**

- [x] 4.2 Write property test for font fallback






  - **Property 18: Font fallback maintains visual weight**
  - **Validates: Requirements 1.5**

- [x] 5. Implement data loading and fallback system





  - Create data loading utility with fetch API
  - Implement JSON parsing and validation
  - Add error handling with try-catch blocks
  - Implement graceful fallback to embedded content
  - Add safe defaults for missing JSON fields
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 5.1 Write property test for JSON loading failure






  - **Property 11: JSON loading failure uses fallback content**
  - **Validates: Requirements 9.4**

- [x] 6. Update creature selection screen




  - Update title to "Pick your fire — step into a story" in Playfair Display font
  - Ensure three large vertical tappable cards are stacked vertically in a carousel tuned for phone
  - Implement dynamic fire effects with correct colors (purple for Baba Yaga, pale blue for Banshee, red for Aswang)
  - Add creature name and small description to each card
  - Add click handlers to load creature data and start creature-specific audio
  - Add keyboard navigation support
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 6.1 Write property test for creature selection data loading






  - **Property 2: Creature selection loads correct data**
  - **Validates: Requirements 2.3, 2.4**

- [x] 6.2 Create CharacterReveal component


  - Load creature high-res image from `/assets/` (exact filenames: `Baba yaga.jpg`, `Banshee.jpg`, `Aswang.jpg`)
  - Display image full-height
  - Implement entrance animation: scale 1.05→1.0, fade-in, translateY 10px→0 over 450ms
  - Add subtle parallax shift for foreground elements (optional phone tilt)
  - Implement close-up camera effect: scale 1.0→1.15 over 500ms for tighter half-body framing
  - Trigger callback when animations complete
  - _Requirements: 2.4, 2.5_

- [x] 6.3 Create StoryBubbles component with creature-specific styling


  - Display 4-5 bubbles sequentially with pop+fade animation (~180ms each) appearing from the right
  - Implement Baba Yaga bubbles: round neon purple with Asimovian font, neon-purple outer glow, translucent black inner fill, subtle rune particles drifting inside (CSS animated pseudo-elements and tiny particle DIVs), positioned to the right
  - Implement Banshee bubbles: pixel pale-blue rectangular with Jersey 10 font, blocky pixel edges, pale-blue fill, thin darker-blue pixel border, scanline noise overlay, low-amplitude echo ripple lines behind bubble, positioned to the right
  - Implement Aswang bubbles: irregular dark grey to light grey gradient with Road Rage font, foggy blurred edges (CSS mask or blur), drifting micro-fog (tiny semi-transparent DIVs) around bubble edges, positioned to the right
  - Allow tap to advance to next bubble or tap small "Next" chevron
  - Show progress indicator dots for remaining bubbles
  - Use exact canonical story text from design document
  - After last bubble, proceed automatically (300ms) to encounter phase
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 12.1, 12.2, 12.3_

- [x] 7. Update HeroScene component with background images





  - Display creature-specific BG image with 20% blur (exact filenames: `Baba Yaga BG.jpg`, `Banshee BG.jpg`, `Aswang BG.jpg`)
  - Implement full-bleed background with subtle parallax shift on scroll or small tilt on pointer (phone-light)
  - Create main visual canvas with layered structure
  - Implement creature-specific fog effects (purple for Baba Yaga, pale blue for Banshee, red for Aswang)
  - Add particle system with CSS animations
  - Implement creature-specific visual elements (rune glows, echo waves, flickering lanterns)
  - Display scene text with proper contrast (>= 4.5:1) using creature-specific fonts
  - Add reduced motion support
  - _Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4, 6.5_

- [x] 7.1 Write property test for creature-specific effects






  - **Property 8: Creature-specific effects render correctly**
  - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 7.2 Write property test for contrast ratio






  - **Property 15: Contrast ratio maintains readability**
  - **Validates: Requirements 4.5**

- [x] 8. Implement useAnimationController hook





  - Map UI config values to CSS custom properties
  - Implement game state intensity mapping (calm/tense/critical)
  - Add fog density, particle count, and animation speed controls
  - Implement screen tilt, vignette, and distortion effects for critical state
  - Add smooth transitions (300-420ms) between states
  - Detect low-power devices and reduce effects
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 5.5_

- [x] 8.1 Write property test for UI config CSS mapping






  - **Property 12: UI config parameters map to CSS variables**
  - **Validates: Requirements 11.4**

- [x] 8.2 Write property test for smooth state transitions






  - **Property 13: Game state transitions are smooth**
  - **Validates: Requirements 11.5**

- [ ] 8.3 Write property test for low-power device adaptation








  - **Property 20: Low-power devices reduce particle count**
  - **Validates: Requirements 5.5**

- [x] 9. Update DecisionPanel component with creature-specific button styling





  - Implement Baba Yaga buttons: glass neon purple rounded rectangles with inner bevel, outer glow, rune icon on left, uppercase semibold label text in Asimovian font; on tap: scale(0.98), purple glow pulse, paper-rustle cue; disabled state: desaturated purple with lower opacity
  - Implement Banshee buttons: pixel pale-blue rectangles with blocky pixel border, faint scanline noise overlay, text in Jersey 10 font; on tap: pixel-snap jitter (1 frame), ribbon-snap cue; focus state: bright pale-blue pixel outline
  - Implement Aswang buttons: irregular dark grilled with foggy edges, ember inner glow, small uppercase serif text in Road Rage font; on tap: ember-wave ripple bottom-to-top, vignette flash, ember-clink cue
  - Make buttons large, thumb-friendly, pinned near bottom-center
  - Display consequence text within 200ms of selection
  - Implement keyboard navigation (Tab, Enter, Space)
  - Add ARIA labels for screen readers with high-contrast text
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 9.1 Write property test for choice feedback timing






  - **Property 6: Choice feedback displays within time constraint**
  - **Validates: Requirements 4.1**

- [x] 9.2 Write property test for UI reactions matching correctness






  - **Property 7: UI reactions match choice correctness**
  - **Validates: Requirements 4.2, 4.3**

- [x] 9.3 Write property test for keyboard navigation





  - **Property 10: Keyboard navigation maintains logical order**
  - **Validates: Requirements 7.1, 7.2, 7.5**

- [x] 10. Implement Inventory component for creature mechanics





  - Create Baba Yaga riddle interface with hint reveal after incorrect attempt
  - Build Banshee calmness meter with visual indicator
  - Implement Aswang token-based deduction system with combination validation
  - Add immediate visual updates for all mechanic interactions
  - Validate inputs against creature-specific rules
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 10.1 Write property test for mechanic indicator updates





  - **Property 16: Mechanic interactions update indicators immediately**
  - **Validates: Requirements 6.5**

- [x] 11. Update audio system and useSoundCue hook




  - Play `Background audio.mp3` when no creature is selected (intro and selection)
  - Play creature-specific audio when creature is selected (exact filenames: `Baba yaga audio.mp3`, `Banshee audio.mp3`, `Aswang audio.mp3`)
  - Implement playSoundCue function that logs cue names
  - Map sound cues to visual effects (ripple, pulse, shake)
  - Display textual descriptors for audio cues (paper-rustle, ribbon-snap, ember-clink, heartbeat)
  - Render visual ripple effects at trigger locations
  - Add accessible captions for all sound events
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 11.1 Write property test for sound cue visual feedback






  - **Property 17: Sound cues trigger visual feedback**
  - **Validates: Requirements 8.2, 8.5**

- [x] 12. Update EndCard component with dramatic animations



  - **Victory**: Display creature image (for Aswang use `Aswang_defeated.jpg`, others use base image) and animate dissolve effect bottom→top in creature's fire color using animated CSS gradient mask with mix-blend-mode
  - After dissolve animation completes, show centered text "Defeated!" in matching fire color
  - Display two big buttons: "Play Again" and "Home"
  - **Defeat**: Display base creature image and animate dramatic close-up zoom (scale 1.05→1.2) over 400ms with blur/radiant shift and vignette increase
  - For Aswang defeat, emphasize eyes with subtle red flare during zoom-in
  - After zoom animation completes, show centered text "You Died" in creature fire glow
  - Display dynamic cause-of-death line from lose_text field
  - Display "Try Again" and "Home" buttons
  - Use creature-specific fonts for all text
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 13. Implement reduced motion accessibility





  - Detect prefers-reduced-motion media query
  - Add manual reduced motion toggle button
  - Disable parallax, particle, and complex animations when enabled
  - Maintain core functionality and choice interactions
  - Display static visual alternatives for animated effects
  - Update animation states immediately on toggle
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 13.1 Write property test for reduced motion






  - **Property 9: Reduced motion disables complex animations**
  - **Validates: Requirements 12.2, 12.3**

- [x] 14. Update main App component and wire everything together




  - Implement App.jsx with useGameEngine hook
  - Add JSON data loading on mount
  - Implement conditional rendering based on game state (intro/select/characterReveal/story/level/end)
  - Pass state and handlers to child components (IntroVideo, CreatureSelection, CharacterReveal, StoryBubbles, HeroScene, DecisionPanel, FireOverlay, EndCard)
  - Add global CSS variables for theming and creature-specific fonts
  - Implement error boundaries for graceful error handling
  - Ensure 9:16 portrait layout with full-screen canvas and safe spacing for notches
  - On desktop, show centered 9:16 canvas only
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 19.1, 19.2, 19.3, 19.4_
- [x] 15. Update global styles and CSS architecture with creature-specific fonts




- [ ] 15. Update global styles and CSS architecture with creature-specific fonts

  - Import Google Fonts: Asimovian, Jersey 10, Road Rage, Rubik Wet Paint, Playfair Display
  - Create CSS custom properties for creature-specific fonts with fallbacks
  - Apply Asimovian font to all Baba Yaga UI elements (bubbles, buttons, messages, labels)
  - Apply Jersey 10 font to all Banshee UI elements (bubbles, buttons, messages, labels)
  - Apply Road Rage font to all Aswang UI elements (bubbles, buttons, messages, labels)
  - Define creature-specific color palettes
  - Implement fog and particle animations with keyframes
  - Add responsive design with mobile-first 9:16 approach
  - Ensure all text meets contrast requirements
  - Add visible focus rings for keyboard navigation
  - Implement smooth transitions for all state changes
  - _Requirements: 4.5, 7.1, 11.5, 18.1, 18.2, 18.3, 18.4, 18.5_

- [x] 16. Add enriched story text for all creatures




  - Write 3 enriched intro variants per creature (12-45 words, poetic tone)
  - Write enriched scene text for each level (12-45 words)
  - Create 3 victory text variants per creature (12-30 words)
  - Create 3 defeat text variants per creature (12-30 words)
  - Add riddles and sly humor for Baba Yaga
  - Use elegiac tone for Banshee
  - Add taut, urgent tone with rural details for Aswang
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 16.1 Write property test for enriched text word counts






  - **Property 19: Enriched text maintains word count constraints**
  - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**

- [ ]* 16.2 Write property test for creature-specific fonts
  - **Property 21: Creature-specific fonts apply to all UI elements**
  - **Validates: Requirements 18.1, 18.2, 18.3**

- [x] 17. Implement cross-platform compatibility




  - Test in Chrome DevTools mobile simulator
  - Verify rendering at various viewport sizes (320px - 1920px)
  - Ensure no external asset dependencies
  - Optimize load time to under 3 seconds
  - Test touch interactions
  - _Requirements: 14.3, 14.4, 14.5_

- [x] 17.1 Write integration tests for complete game flows





  - Test full victory path: intro → select → 3 correct choices → victory
  - Test defeat path: intro → select → incorrect choice → defeat
  - Test reduced motion mode throughout entire flow
  - Test keyboard-only navigation through entire game

- [x] 18. Add code comments and documentation





  - Comment data integration points in components
  - Explain animation logic in CSS and JS
  - Document creature mechanic implementations
  - Add JSDoc comments to hooks
  - Create README.md with project description and setup instructions
  - _Requirements: 15.5_

- [x] 19. Final checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.

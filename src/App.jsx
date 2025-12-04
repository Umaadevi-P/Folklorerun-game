import React, { useState, useEffect, useRef } from 'react';
import StartScreen from './components/StartScreen';
import IntroAnimation from './components/IntroAnimation';
import CreatureSelection from './components/CreatureSelection';
import CharacterReveal from './components/CharacterReveal';
import StoryBubbles from './components/StoryBubbles';
import GameplayScreen from './components/GameplayScreen';
import EndCard from './components/EndCard';
import LevelTransition from './components/LevelTransition';
import GoodbyeScreen from './components/GoodbyeScreen';
import ReducedMotionToggle from './components/ReducedMotionToggle';
import SoundCueVisual from './components/SoundCueVisual';
import BackButton from './components/BackButton';
import useGameEngine from './hooks/useGameEngine';
import useReducedMotion from './hooks/useReducedMotion';
import useAnimationController from './hooks/useAnimationController';
import useSoundCue from './hooks/useSoundCue';
import { loadAllGameData } from './utils/dataLoader';

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI.
 * Implements graceful error handling as per Requirement 15.5
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>The game encountered an unexpected error. Please refresh the page to try again.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * App Component
 * 
 * Main application container that orchestrates all components and manages global state.
 * Implements conditional rendering based on game state and passes state/handlers to children.
 * 
 * Requirements: 15.1, 15.3, 15.5
 */
function App() {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showGoodbye, setShowGoodbye] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [uiConfig, setUIConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Audio management refs - Requirements 10.1, 10.2
  const backgroundAudioRef = useRef(null);
  const creatureAudioRef = useRef(null);

  // Initialize game engine with creature data - Requirement 15.2
  const gameEngine = useGameEngine(gameData);
  
  // Reduced motion accessibility - Requirement 12.1
  const { reducedMotion, toggleReducedMotion } = useReducedMotion();

  // Sound cue system - Requirements 10.3, 10.4, 10.5
  const soundCue = useSoundCue(uiConfig);

  // Determine game state intensity for animations - Requirements 11.1, 11.2, 11.3
  const getGameStateIntensity = () => {
    if (gameEngine.gameState !== 'level') return 'calm';
    
    // Map level progression to intensity
    if (gameEngine.currentLevel === 0) return 'calm';
    if (gameEngine.currentLevel === 1) return 'tense';
    if (gameEngine.currentLevel === 2) return 'critical';
    
    return 'calm';
  };

  // Dynamic animation controller - Requirements 11.1-11.5
  const animationController = useAnimationController(
    uiConfig,
    getGameStateIntensity(),
    gameEngine.selectedCreature,
    reducedMotion
  );

  // Load game data on mount - Requirement 9.1, 9.2
  useEffect(() => {
    const initializeData = async () => {
      try {
        const { creatureData, uiConfig } = await loadAllGameData();
        setGameData(creatureData);
        setUIConfig(uiConfig);
      } catch (error) {
        console.error('Unexpected error during data initialization:', error);
        // Data loader already handles fallbacks, so this shouldn't happen
        // but we'll set loading to false anyway
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Audio management - Requirements 10.1, 10.2
  useEffect(() => {
    console.log('🎵 Audio effect triggered - Creature:', gameEngine.selectedCreature?.name, 'State:', gameEngine.gameState);
    
    // Requirement 10.1: Play Background audio.mp3 when no creature is selected (intro and selection)
    if (!gameEngine.selectedCreature && (showIntro || gameEngine.gameState === 'select')) {
      // Stop creature audio if playing
      if (creatureAudioRef.current) {
        console.log('🛑 Stopping creature audio');
        creatureAudioRef.current.pause();
        creatureAudioRef.current.currentTime = 0;
        creatureAudioRef.current = null;
      }

      // Start background audio if not already playing
      if (!backgroundAudioRef.current) {
        console.log('🎵 Loading background audio');
        backgroundAudioRef.current = new Audio('/assets/Background audio.mp3');
        backgroundAudioRef.current.loop = true;
        backgroundAudioRef.current.volume = 0.07; // Reduced to 7% so creature music is prominent
        
        backgroundAudioRef.current.addEventListener('error', (e) => {
          console.error('❌ Background audio error:', e);
        });
        
        const playPromise = backgroundAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('▶️ Background audio playing');
            })
            .catch(error => {
              console.log('⚠️ Background audio autoplay prevented:', error);
            });
        }
      }
    }

    // Requirement 10.2: Play creature-specific audio when creature is selected
    if (gameEngine.selectedCreature && gameEngine.gameState !== 'select' && gameEngine.gameState !== 'intro') {
      // Stop background audio
      if (backgroundAudioRef.current) {
        console.log('🛑 Stopping background audio');
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.currentTime = 0;
        backgroundAudioRef.current = null;
      }

      // Start creature-specific audio if not already playing
      if (!creatureAudioRef.current) {
        const creatureName = gameEngine.selectedCreature.name;
        // Exact filenames: "Baba Yaga audio.mp3", "Banshee audio.mp3", "Aswang audio.mp3"
        const audioPath = `/assets/${encodeURIComponent(creatureName)} audio.mp3`;
        console.log('🎵 Loading creature audio:', audioPath, 'for creature:', creatureName);
        
        creatureAudioRef.current = new Audio(audioPath);
        creatureAudioRef.current.loop = true;
        creatureAudioRef.current.volume = 0.7;
        
        creatureAudioRef.current.addEventListener('error', (e) => {
          console.error('❌ Audio loading error:', e, 'Path:', audioPath);
          console.error('Error details:', e.target.error);
        });
        
        creatureAudioRef.current.addEventListener('canplaythrough', () => {
          console.log('✅ Audio loaded successfully:', audioPath);
        });
        
        creatureAudioRef.current.addEventListener('loadeddata', () => {
          console.log('📦 Audio data loaded:', audioPath);
        });
        
        const playPromise = creatureAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('▶️ Creature audio playing:', audioPath);
            })
            .catch(error => {
              console.log('⚠️ Creature audio autoplay prevented:', error);
              // Try to play on next user interaction
              const playOnClick = () => {
                if (creatureAudioRef.current) {
                  console.log('🖱️ Attempting to play on user click');
                  creatureAudioRef.current.play()
                    .then(() => console.log('✅ Audio playing after click'))
                    .catch(e => console.log('❌ Still blocked:', e));
                }
              };
              document.addEventListener('click', playOnClick, { once: true });
              document.addEventListener('touchstart', playOnClick, { once: true });
            });
        }
      } else {
        console.log('ℹ️ Creature audio already playing');
      }
    }

    // Cleanup function - don't set to null, just pause
    return () => {
      // Don't cleanup on every render, only when component unmounts
    };
  }, [gameEngine.selectedCreature, gameEngine.gameState, showIntro]);

  // Apply reduced motion class to body - Requirement 12.1
  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduced-motion-active');
    } else {
      document.body.classList.remove('reduced-motion-active');
    }
  }, [reducedMotion]);

  // Apply global CSS variables for theming - Requirement 11.4
  useEffect(() => {
    if (!animationController.cssVariables) return;

    const root = document.documentElement;
    Object.entries(animationController.cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, String(value));
    });
  }, [animationController.cssVariables]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    gameEngine.startGame(); // Transition to creature selection
  };

  const handleCreatureSelect = (creatureId) => {
    gameEngine.selectCreature(creatureId);
  };

  const handleChoice = (choiceIndex) => {
    gameEngine.makeChoice(choiceIndex);
  };

  const handleMechanicUpdate = (updates) => {
    gameEngine.updateMechanicState(updates);
  };

  const handleExit = () => {
    // Stop all audio
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
    }
    if (creatureAudioRef.current) {
      creatureAudioRef.current.pause();
      creatureAudioRef.current.currentTime = 0;
    }
    
    // Show goodbye screen
    setShowGoodbye(true);
  };

  // Show goodbye screen
  if (showGoodbye) {
    return <GoodbyeScreen />;
  }

  // Show loading state briefly if data isn't ready
  if (isLoading) {
    return <div className="app-loading">Loading...</div>;
  }

  // Start screen phase - User interaction to enable audio
  if (showStartScreen) {
    return (
      <ErrorBoundary>
        <StartScreen onStart={() => {
          setShowStartScreen(false);
          setShowIntro(true);
        }} />
      </ErrorBoundary>
    );
  }

  // Intro animation phase
  if (showIntro) {
    return (
      <ErrorBoundary>
        <IntroAnimation onComplete={handleIntroComplete} reducedMotion={reducedMotion} />
        <ReducedMotionToggle reducedMotion={reducedMotion} onToggle={toggleReducedMotion} />
      </ErrorBoundary>
    );
  }

  // Creature selection phase - Requirement 15.3
  if (gameEngine.gameState === 'select') {
    console.log('📍 Rendering CreatureSelection - gameState:', gameEngine.gameState, 'creature:', gameEngine.selectedCreature?.name);
    return (
      <ErrorBoundary>
        <CreatureSelection 
          gameData={gameData} 
          onSelectCreature={handleCreatureSelect}
          onExit={handleExit}
          reducedMotion={reducedMotion}
        />
        <ReducedMotionToggle reducedMotion={reducedMotion} onToggle={toggleReducedMotion} />
      </ErrorBoundary>
    );
  }

  // Character reveal phase - Requirements 2.4, 2.5
  if (gameEngine.gameState === 'characterReveal') {
    console.log('📍 Rendering CharacterReveal - gameState:', gameEngine.gameState, 'creature:', gameEngine.selectedCreature?.name);
    
    // Safety check: if no creature is selected, show error
    if (!gameEngine.selectedCreature) {
      console.error('❌ CharacterReveal state but no creature selected!');
      return (
        <div className="app-error">
          <p>Error: No creature selected</p>
          <button onClick={gameEngine.goHome}>Return to Selection</button>
        </div>
      );
    }
    
    return (
      <ErrorBoundary>
        <div className="app app--character-reveal">
          <CharacterReveal
            creature={gameEngine.selectedCreature}
            onEntranceComplete={gameEngine.completeEntranceAnimation}
            onCloseUpComplete={gameEngine.completeCloseUpAnimation}
            reducedMotion={reducedMotion}
          />
          <BackButton onBack={gameEngine.goHome} />
          <ReducedMotionToggle reducedMotion={reducedMotion} onToggle={toggleReducedMotion} />
        </div>
      </ErrorBoundary>
    );
  }

  // Story bubbles phase - Requirements 3.1, 3.2, 3.3, 12.1, 12.2, 12.3
  if (gameEngine.gameState === 'story') {
    const storyLines = gameEngine.getStoryLines();
    
    return (
      <ErrorBoundary>
        <div className="app app--story">
          {/* Creature image as background with blur - smooth transition from CharacterReveal */}
          <div 
            className="story-background"
            style={{
              backgroundImage: `url(/assets/${encodeURIComponent(gameEngine.selectedCreature.name)}.jpg)`,
              filter: reducedMotion ? 'blur(8px)' : 'blur(8px)',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0
            }}
          />
          <StoryBubbles
            creature={gameEngine.selectedCreature}
            onComplete={gameEngine.advanceStoryBubble}
            reducedMotion={reducedMotion}
          />
          <BackButton onBack={gameEngine.goHome} />
          <ReducedMotionToggle reducedMotion={reducedMotion} onToggle={toggleReducedMotion} />
        </div>
      </ErrorBoundary>
    );
  }

  // Level transition phase - Animated transition between levels
  if (gameEngine.gameState === 'levelTransition') {
    return (
      <ErrorBoundary>
        <LevelTransition
          creature={gameEngine.selectedCreature}
          fromLevel={gameEngine.transitionFrom}
          toLevel={gameEngine.transitionFrom + 1}
          onComplete={gameEngine.completeLevelTransition}
          reducedMotion={reducedMotion}
        />
      </ErrorBoundary>
    );
  }

  // Level gameplay phase - Requirements 15.1, 15.3
  if (gameEngine.gameState === 'level') {
    const levelData = gameEngine.getCurrentLevelData();
    
    if (!levelData) {
      return (
        <div className="app-error">
          <p>Error loading level data</p>
          <button onClick={gameEngine.restartGame}>Restart</button>
        </div>
      );
    }

    return (
      <ErrorBoundary>
        <GameplayScreen
          creature={gameEngine.selectedCreature}
          levelData={levelData}
          currentLevel={gameEngine.currentLevel}
          mechanicState={gameEngine.mechanicState}
          onChoice={handleChoice}
          onMechanicUpdate={handleMechanicUpdate}
          uiConfig={uiConfig}
          reducedMotion={reducedMotion}
        />
        
        {/* Sound cue visual feedback - Requirements 10.3, 10.4, 10.5 */}
        <SoundCueVisual
          currentCue={soundCue.currentCue}
          descriptor={soundCue.descriptor}
          triggerLocation={soundCue.triggerLocation}
          visualEffectClass={soundCue.getVisualEffectClass()}
        />

        <BackButton onBack={gameEngine.goHome} />
        <ReducedMotionToggle reducedMotion={reducedMotion} onToggle={toggleReducedMotion} />
      </ErrorBoundary>
    );
  }

  // End screen phase - Requirements 15.1-15.5
  if (gameEngine.gameState === 'end') {
    console.log('📍 Rendering EndCard - gameState:', gameEngine.gameState, 'creature:', gameEngine.selectedCreature?.name);
    return (
      <ErrorBoundary>
        <EndCard
          outcome={gameEngine.outcome}
          creature={gameEngine.selectedCreature}
          onRestart={() => {
            console.log('🎮 onRestart called from App.jsx');
            gameEngine.restartGame();
          }}
          onHome={() => {
            console.log('🏠 onHome called from App.jsx');
            gameEngine.goHome();
          }}
          uiConfig={uiConfig}
          reducedMotion={reducedMotion}
        />
        <BackButton onBack={gameEngine.goHome} />
        <ReducedMotionToggle reducedMotion={reducedMotion} onToggle={toggleReducedMotion} />
      </ErrorBoundary>
    );
  }

  // Fallback for unexpected states
  return (
    <ErrorBoundary>
      <div className="app">
        <h1>FOLKLORERUN</h1>
        <p>Loading game state...</p>
      </div>
    </ErrorBoundary>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import './CreatureSelection.css';

/**
 * CreatureSelection Component
 * 
 * Displays three large vertical creature cards with dynamic fire effects.
 * Implements keyboard navigation and starts creature-specific audio on selection.
 * 
 * Requirements: 2.1, 2.2, 2.3
 * 
 * @param {Object} props
 * @param {Object} props.gameData - Creature data from JSON or fallback
 * @param {Function} props.onSelectCreature - Callback when creature is selected
 * @param {Function} props.onExit - Callback when exit button is clicked
 * @param {Boolean} props.reducedMotion - Disable complex animations for accessibility
 */
const CreatureSelection = ({ gameData, onSelectCreature, onExit, reducedMotion = false }) => {
  const [hoveredCreature, setHoveredCreature] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Play background audio when component mounts
    // Requirement 10.1: Play Background audio.mp3 when no creature is selected
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Set volume to 20% (reduced by 10%)
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Audio autoplay prevented:', err);
        });
      }
    }

    return () => {
      // Cleanup audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  if (!gameData || !gameData.creatures) {
    return (
      <div className="creature-selection">
        <p>Loading creatures...</p>
      </div>
    );
  }

  const handleCreatureClick = (creature) => {
    // Requirement 2.3: Load creature data and start creature-specific audio
    
    // Stop background audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Start creature-specific audio
    // Requirement 10.2: Play creature-specific audio when creature is selected
    const creatureAudio = new Audio(`${import.meta.env.BASE_URL}assets/${creature.name} audio.mp3`);
    const playPromise = creatureAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Creature audio playback failed:', err);
      });
    }

    // Trigger callback to load creature data
    onSelectCreature(creature.id);
  };

  const handleKeyDown = (event, creature) => {
    // Keyboard navigation support (Enter or Space)
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCreatureClick(creature);
    }
  };

  // Get creature description based on core mechanic
  const getCreatureDescription = (creature) => {
    switch (creature.coreMechanic) {
      case 'riddle':
        return 'Answer her riddles with wit and wisdom';
      case 'calmness':
        return 'Soothe her sorrow with gentle words';
      case 'deduction':
        return 'Unmask the creature before it strikes';
      default:
        return 'Face the unknown';
    }
  };

  // Requirement 2.1: Display three large vertical tappable cards
  return (
    <div className={`creature-selection ${reducedMotion ? 'reduced-motion' : ''}`}>
      {/* Background audio - Requirement 10.1 */}
      <audio ref={audioRef} loop>
        <source src={`${import.meta.env.BASE_URL}assets/Background audio.mp3`} type="audio/mpeg" />
      </audio>

      {/* Requirement 2.1: Title in Playfair Display font */}
      <h1 className="selection-title">Pick your fire — step into a story</h1>
      
      {/* Requirement 2.1: Three large vertical cards stacked vertically */}
      <div className="creature-carousel">
        {gameData.creatures.map((creature) => (
          <div
            key={creature.id}
            className={`creature-card ${hoveredCreature === creature.id ? 'hovered' : ''}`}
            onClick={() => handleCreatureClick(creature)}
            onKeyDown={(e) => handleKeyDown(e, creature)}
            onMouseEnter={() => setHoveredCreature(creature.id)}
            onMouseLeave={() => setHoveredCreature(null)}
            tabIndex={0}
            role="button"
            aria-label={`Select ${creature.name} - ${getCreatureDescription(creature)}`}
            data-creature={creature.id}
          >
            {/* Requirement 2.2: Dynamic fire effects with correct colors */}
            <div className="fire-overlay" data-creature={creature.id}>
              <div className="fire-particle"></div>
              <div className="fire-particle"></div>
              <div className="fire-particle"></div>
              <div className="fire-particle"></div>
              <div className="fire-particle"></div>
            </div>

            <div className="creature-card-content">
              {/* Requirement 2.2: Creature name */}
              <h2 className="creature-name">{creature.name}</h2>
              
              {/* Requirement 2.2: Small description */}
              <p className="creature-description">
                {getCreatureDescription(creature)}
              </p>

              {/* Visual fire icon */}
              <div className="fire-icon" data-creature={creature.id}>
                <div className="flame"></div>
                <div className="flame"></div>
                <div className="flame"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exit Button */}
      <button 
        className="exit-button"
        onClick={onExit}
        aria-label="Exit game"
      >
        Exit
      </button>
    </div>
  );
};

export default CreatureSelection;


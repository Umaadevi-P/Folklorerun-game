import React, { useState, useEffect } from 'react';
import './EndCard.css';

/**
 * EndCard Component
 * 
 * Displays victory or defeat end screen with dramatic animations and creature-specific text.
 * Victory: dissolve effect bottom→top in creature's fire color
 * Defeat: dramatic close-up zoom with blur/radiant shift and vignette
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5
 * 
 * @param {Object} props
 * @param {String} props.outcome - "victory" or "defeat"
 * @param {Object} props.creature - Current creature object with id, name, victoryTexts, defeatTexts
 * @param {String} props.outcomeText - Enriched text for the ending (optional, uses creature data if not provided)
 * @param {Function} props.onRestart - Callback to restart game
 * @param {Function} props.onHome - Callback to return to creature selection
 * @param {Object} props.uiConfig - UI configuration for theming
 * @param {Boolean} props.reducedMotion - Accessibility preference
 */
const EndCard = ({ 
  outcome, 
  creature, 
  outcomeText, 
  onRestart, 
  onHome,
  uiConfig,
  reducedMotion = false 
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Requirement 15.1, 15.3: Trigger animation completion after timing
    const animationDuration = outcome === 'victory' ? 1800 : 1200; // 1.8s for victory dissolve, 1.2s for defeat
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [outcome]);
  if (!creature || !outcome) {
    return null;
  }

  // Requirement 15.2, 15.5: Get creature-specific text
  const getOutcomeText = () => {
    if (outcomeText) return outcomeText;
    
    if (outcome === 'victory') {
      // Select random victory text variant if available
      if (creature.victoryTexts && Array.isArray(creature.victoryTexts)) {
        const randomIndex = Math.floor(Math.random() * creature.victoryTexts.length);
        return creature.victoryTexts[randomIndex];
      }
      return creature.victoryText || '';
    } else {
      // Requirement 15.5: Use defeatTexts for dynamic cause-of-death line
      if (creature.defeatTexts && Array.isArray(creature.defeatTexts)) {
        const randomIndex = Math.floor(Math.random() * creature.defeatTexts.length);
        return creature.defeatTexts[randomIndex];
      }
      return creature.defeatText || '';
    }
  };

  const displayText = getOutcomeText();

  // Requirement 15.1: Get creature image path (Aswang uses defeated image for victory)
  const getCreatureImagePath = () => {
    if (outcome === 'victory' && creature.id === 'aswang') {
      return '/assets/Aswang_defeated.jpg';
    }
    // Use base creature image for all other cases
    const creatureNameMap = {
      'baba-yaga': 'Baba yaga',
      'banshee': 'Banshee',
      'aswang': 'Aswang'
    };
    const imageName = creatureNameMap[creature.id] || creature.name;
    return `/assets/${imageName}.jpg`;
  };

  const creatureImagePath = getCreatureImagePath();

  // Get creature-specific fire colors for animations
  const getFireColor = () => {
    const fireColors = {
      'baba-yaga': '#A67CFF', // purple
      'banshee': '#CFE8FF',   // pale blue
      'aswang': '#E04B4B'     // red
    };
    return fireColors[creature.id] || '#ffffff';
  };

  const fireColor = getFireColor();

  // Get creature-specific font
  const getCreatureFont = () => {
    const fonts = {
      'baba-yaga': "'Asimovian', serif",
      'banshee': "'Jersey 10', monospace",
      'aswang': "'Road Rage', serif"
    };
    return fonts[creature.id] || "serif";
  };

  const creatureFont = getCreatureFont();

  // CSS variables for dynamic styling
  const cssVariables = {
    '--fire-color': fireColor,
    '--creature-font': creatureFont,
    '--creature-image': `url(${creatureImagePath})`
  };

  return (
    <div 
      className={`end-card end-card--${outcome} end-card--${creature.id} ${reducedMotion ? 'reduced-motion' : ''}`}
      style={cssVariables}
      role="dialog"
      aria-labelledby="end-card-title"
      aria-describedby="end-card-text"
    >
      {/* Requirement 15.1, 15.3: Creature image with dramatic animations */}
      <div className="end-card-image-container" aria-hidden="true">
        <img 
          src={creatureImagePath}
          alt={creature.name}
          className={`end-card-creature-image ${outcome === 'victory' ? 'victory-dissolve' : 'defeat-zoom'} ${creature.id === 'aswang' && outcome === 'defeat' ? 'aswang-defeat-eyes' : ''}`}
        />
        
        {/* Requirement 15.1: Victory dissolve effect overlay */}
        {outcome === 'victory' && (
          <div className="victory-dissolve-overlay"></div>
        )}
        
        {/* Requirement 15.3, 15.4: Defeat vignette and black fade */}
        {outcome === 'defeat' && (
          <>
            <div className="defeat-vignette"></div>
            <div className="defeat-black-fade"></div>
          </>
        )}
      </div>

      {/* Content container - appears after animation completes */}
      {animationComplete && (
        <div className="end-card-content">
          {/* Requirement 15.2, 15.5: Display outcome title in creature fire color */}
          <h1 
            id="end-card-title" 
            className="end-card-title"
            style={{ fontFamily: creatureFont }}
          >
            {outcome === 'victory' ? 'Defeated!' : 'You Died'}
          </h1>

          {/* Requirement 15.5: Display dynamic cause-of-death text */}
          <div 
            id="end-card-text"
            className="end-card-text-container"
          >
            <p className="end-card-text" style={{ fontFamily: creatureFont }}>
              {displayText}
            </p>
          </div>

          {/* Requirement 15.2, 15.5: Action buttons */}
          <div className="end-card-buttons">
            <button
              className="end-card-button end-card-button--primary"
              onClick={() => {
                console.log('🎮 Play Again/Try Again button clicked');
                onRestart();
              }}
              aria-label={outcome === 'victory' ? 'Play again' : 'Try again'}
              style={{ fontFamily: creatureFont }}
            >
              <span className="button-text">{outcome === 'victory' ? 'Play Again' : 'Try Again'}</span>
              <span className="button-glow"></span>
            </button>
            
            <button
              className="end-card-button end-card-button--secondary"
              onClick={() => {
                console.log('🏠 Home button clicked');
                onHome();
              }}
              aria-label="Return to creature selection"
              style={{ fontFamily: creatureFont }}
            >
              <span className="button-text">Home</span>
              <span className="button-glow"></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EndCard;

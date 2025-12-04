import React, { useState, useEffect } from 'react';
import './DecisionPanel.css';
import AmbientEffects from './AmbientEffects';

/**
 * DecisionPanel Component
 * 
 * Displays two choice buttons with creature-specific styling and micro-interactions.
 * Implements keyboard navigation, ARIA labels, and creature-specific theming.
 * Shows consequence text within 200ms of selection.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 * 
 * @param {Object} props
 * @param {Array} props.choices - Array of choice objects [{text, isCorrect, consequence}]
 * @param {Function} props.onChoice - Callback when choice is selected (receives choice index)
 * @param {boolean} props.disabled - Prevents interaction during transitions
 * @param {Object} props.creature - Current creature for theming
 * @param {Object} props.uiConfig - UI configuration for theming
 * @param {Function} props.playSoundCue - Function to play sound cues with visual feedback
 */
const DecisionPanel = ({ choices, onChoice, disabled = false, creature, uiConfig, playSoundCue }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [hoveredChoice, setHoveredChoice] = useState(null);
  const [tappedChoice, setTappedChoice] = useState(null);

  // Reset state when choices change (new level)
  useEffect(() => {
    setSelectedChoice(null);
    setShowConsequence(false);
    setHoveredChoice(null);
    setTappedChoice(null);
  }, [choices]);

  // Requirement 7.1, 7.2, 7.3: Handle choice selection with creature-specific micro-interactions
  const handleChoiceClick = (choiceIndex, event) => {
    if (disabled || selectedChoice !== null) return;

    setSelectedChoice(choiceIndex);
    setTappedChoice(choiceIndex);

    // Trigger creature-specific tap animation and sound cue
    // Requirement 7.1: Baba Yaga - scale(0.98), purple glow pulse, paper-rustle cue
    // Requirement 7.2: Banshee - pixel-snap jitter (1 frame), ribbon-snap cue
    // Requirement 7.3: Aswang - ember-wave ripple bottom-to-top, vignette flash, ember-clink cue
    // Requirements 10.3, 10.4: Map sound cues to visual effects and display textual descriptors
    const creatureId = creature?.id;
    if (playSoundCue) {
      if (creatureId === 'baba-yaga') {
        playSoundCue('paper-rustle', { x: event?.clientX, y: event?.clientY });
      } else if (creatureId === 'banshee') {
        playSoundCue('ribbon-snap', { x: event?.clientX, y: event?.clientY });
      } else if (creatureId === 'aswang') {
        playSoundCue('ember-clink', { x: event?.clientX, y: event?.clientY });
      }
    }

    // Clear tap animation after micro-interaction completes
    setTimeout(() => {
      setTappedChoice(null);
    }, 300);

    // Display consequence within 200ms (Requirement 6.1)
    setTimeout(() => {
      setShowConsequence(true);
    }, 50);

    // Trigger callback after showing consequence
    setTimeout(() => {
      onChoice(choiceIndex);
    }, 2000);
  };

  // Requirement 7.5: Keyboard navigation (Tab, Enter, Space)
  const handleKeyDown = (event, choiceIndex) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleChoiceClick(choiceIndex, event);
    }
  };

  // Get creature-specific styling configuration
  const getCreatureConfig = () => {
    if (!creature || !uiConfig?.creatures) {
      return {
        primary: '#ffffff',
        secondary: '#cccccc',
        font: 'Georgia, serif'
      };
    }

    const creatureConfig = uiConfig.creatures[creature.id];
    const creatureId = creature.id;
    
    // Requirement 18.1, 18.2, 18.3: Creature-specific fonts
    let font = 'Georgia, serif';
    if (creatureId === 'baba-yaga') {
      font = "'Asimovian', serif";
    } else if (creatureId === 'banshee') {
      font = "'Jersey 10', monospace";
    } else if (creatureId === 'aswang') {
      font = "'Road Rage', serif";
    }

    return {
      primary: creatureConfig?.primaryColor || '#ffffff',
      secondary: creatureConfig?.secondaryColor || '#cccccc',
      font: font,
      creatureId: creatureId
    };
  };

  const config = getCreatureConfig();

  if (!choices || choices.length === 0) {
    return null;
  }

  return (
    <div 
      className="decision-panel"
      style={{
        '--creature-primary': config.primary,
        '--creature-secondary': config.secondary,
        '--creature-font': config.font
      }}
    >
      {/* Flying ambient effects when consequence is shown */}
      {selectedChoice !== null && showConsequence && (
        <AmbientEffects 
          creature={config.creatureId}
          mode="flying"
          trigger={showConsequence}
          isCorrect={choices[selectedChoice].isCorrect}
          reducedMotion={false}
        />
      )}

      {/* Requirement 7.4: Display two choice buttons, large, thumb-friendly, pinned near bottom-center */}
      <div className="choices-container">
        {choices.map((choice, index) => {
          const isSelected = selectedChoice === index;
          const isHovered = hoveredChoice === index;
          const isTapped = tappedChoice === index;
          const isDimmed = selectedChoice !== null && selectedChoice !== index;
          const isDisabled = disabled || selectedChoice !== null;
          
          // Build creature-specific class names
          // Requirement 7.1: Baba Yaga - glass neon purple rounded rectangles
          // Requirement 7.2: Banshee - pixel pale-blue rectangles
          // Requirement 7.3: Aswang - irregular dark grilled with foggy edges
          const creatureClass = config.creatureId ? `creature-${config.creatureId}` : '';
          
          return (
            <button
              key={index}
              className={`choice-button ${creatureClass} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isTapped ? 'tapped' : ''} ${isDimmed ? 'dimmed' : ''}`}
              onClick={(e) => handleChoiceClick(index, e)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onMouseEnter={() => setHoveredChoice(index)}
              onMouseLeave={() => setHoveredChoice(null)}
              disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              aria-label={`Choice ${index + 1}: ${choice.text}`}
              aria-pressed={isSelected}
              aria-disabled={isDisabled}
            >
              {/* Requirement 7.1: Baba Yaga - rune icon on left */}
              {config.creatureId === 'baba-yaga' && (
                <span className="rune-icon" aria-hidden="true">ᚱ</span>
              )}
              
              <span className="choice-text">{choice.text}</span>
              
              {/* Creature-specific visual effects */}
              <span className="choice-glow"></span>
              
              {/* Requirement 7.3: Aswang - ember inner glow */}
              {config.creatureId === 'aswang' && (
                <span className="ember-glow" aria-hidden="true"></span>
              )}
              
              {/* Requirement 7.2: Banshee - scanline noise overlay */}
              {config.creatureId === 'banshee' && (
                <span className="scanline-noise" aria-hidden="true"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Requirement 6.1: Display consequence text within 200ms of selection */}
      {selectedChoice !== null && showConsequence && (
        <div 
          className={`consequence-display ${choices[selectedChoice].isCorrect ? 'correct' : 'incorrect'}`}
          role="status"
          aria-live="polite"
        >
          <p className="consequence-text">
            {choices[selectedChoice].consequence}
          </p>
        </div>
      )}
    </div>
  );
};

export default DecisionPanel;

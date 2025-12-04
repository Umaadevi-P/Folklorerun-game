import React, { useState, useEffect } from 'react';
import './CharacterReveal.css';

/**
 * CharacterReveal Component
 * 
 * Handles the creature image reveal sequence with entrance and close-up animations.
 * 
 * Requirements: 2.4, 2.5
 * 
 * @param {Object} props
 * @param {Object} props.creature - Selected creature object
 * @param {Function} props.onEntranceComplete - Callback when entrance animation finishes
 * @param {Function} props.onCloseUpComplete - Callback when close-up animation finishes
 * @param {Boolean} props.reducedMotion - Disable complex animations for accessibility
 */
const CharacterReveal = ({ creature, onEntranceComplete, onCloseUpComplete, reducedMotion = false }) => {
  const [animationPhase, setAnimationPhase] = useState('entrance'); // entrance, closeup, complete, exiting
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      // Skip animations in reduced motion mode
      setTimeout(() => {
        if (onEntranceComplete) onEntranceComplete();
        if (onCloseUpComplete) onCloseUpComplete();
      }, 100);
      return;
    }

    // Requirement 2.4: Entrance animation (1000ms) - increased for better visibility
    const entranceTimer = setTimeout(() => {
      setAnimationPhase('closeup');
      if (onEntranceComplete) onEntranceComplete();
    }, 1000);

    // Requirement 2.5: Close-up camera effect (2000ms after entrance) - hold longer for story bubbles
    const closeupTimer = setTimeout(() => {
      setAnimationPhase('complete');
      // Start exit animation before transitioning
      setTimeout(() => {
        setIsExiting(true);
        // Call completion after exit animation starts
        setTimeout(() => {
          if (onCloseUpComplete) onCloseUpComplete();
        }, 400); // Half of exit animation
      }, 500); // Hold complete state briefly
    }, 3000); // 1000ms entrance + 2000ms closeup = 3 seconds total

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(closeupTimer);
    };
  }, [onEntranceComplete, onCloseUpComplete, reducedMotion]);

  // Get creature image path
  // Requirement 2.4: Load creature high-res image from /assets/
  // URL encode the name to handle spaces (e.g., "Baba Yaga" -> "Baba%20Yaga")
  const imagePath = `/assets/${encodeURIComponent(creature.name)}.jpg`;

  return (
    <div className={`character-reveal ${reducedMotion ? 'reduced-motion' : ''} ${isExiting ? 'exiting' : ''}`}>
      <div 
        className={`character-image ${animationPhase}`}
        style={{ backgroundImage: `url(${imagePath})` }}
        role="img"
        aria-label={`${creature.name} character reveal`}
      >
        {/* Parallax foreground elements */}
        <div className="parallax-layer"></div>
      </div>
    </div>
  );
};

export default CharacterReveal;

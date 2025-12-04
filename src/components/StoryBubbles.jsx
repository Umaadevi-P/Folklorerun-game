import React, { useState, useEffect } from 'react';
import './StoryBubbles.css';

/**
 * StoryBubbles Component
 * 
 * Displays sequential talking bubbles with creature-specific styling.
 * Uses exact canonical story text from design document.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 12.1, 12.2, 12.3
 * 
 * @param {Object} props
 * @param {Object} props.creature - Current creature object
 * @param {Function} props.onComplete - Callback when all bubbles are shown
 * @param {Boolean} props.reducedMotion - Disable complex animations for accessibility
 */
const StoryBubbles = ({ creature, onComplete, reducedMotion = false }) => {
  const [currentBubbleIndex, setCurrentBubbleIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Requirement 12.1, 12.2, 12.3: Canonical story text from design document
  const getStoryLines = () => {
    switch (creature.id) {
      case 'baba-yaga':
        return [
          "In a ring of birch the hut wanders on spindly legs; it eats the footprints of those who pass.",
          "Baba Yaga asks riddles and tests manners — those who offer the right thing may be spared, those who are crude often pay.",
          "She is neither wholly guardian nor villain; she values cunning, gifts, and correct ritual.",
          "Speak carefully. Offer without arrogance. Even a small talisman or a clever answer may sway her."
        ];
      case 'banshee':
        return [
          "By hedgerow and stream she walks, a quiet light in moon-damp air.",
          "Her cry is a thread that sometimes warns families of coming loss; it is a sound to be honored, not mocked.",
          "To soothe her is to acknowledge memory — names, laces, ribbons tied with care.",
          "Listen and answer with reverence; the wrong noise draws the wail closer."
        ];
      case 'aswang':
        return [
          "In the small lanes the night moves with extra eyes; a neighbor's shadow may not be what it seems.",
          "The Aswang wears faces, eats the quiet, and slips under lantern light.",
          "Salt burns paths, ember reveals truth, and the spoken name pins the thing.",
          "Watch reflections and odd slips of movement — the clues are small and deadly.",
          "Act in sequence: reveal, bind, and speak — or the night remembers you."
        ];
      default:
        return [];
    }
  };

  const storyLines = getStoryLines();

  useEffect(() => {
    // Requirement 3.6: After last bubble, proceed automatically (300ms) to encounter phase
    if (currentBubbleIndex >= storyLines.length && onComplete) {
      const completeTimer = setTimeout(() => {
        onComplete();
      }, reducedMotion ? 100 : 300); // Reduced from 1000ms to 300ms

      return () => clearTimeout(completeTimer);
    }
  }, [currentBubbleIndex, storyLines.length, onComplete, reducedMotion]);

  // Requirement 3.5: Allow tap to advance to next bubble
  const handleAdvance = () => {
    if (currentBubbleIndex < storyLines.length && !isTransitioning) {
      setIsTransitioning(true);
      // Fade out current bubble before showing next
      setTimeout(() => {
        setCurrentBubbleIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, reducedMotion ? 50 : 200);
    }
  };

  // Requirement 3.5: Allow tap on small "Next" chevron
  const handleNextClick = (e) => {
    e.stopPropagation();
    handleAdvance();
  };

  return (
    <div 
      className={`story-bubbles ${creature.id} ${reducedMotion ? 'reduced-motion' : ''}`}
      onClick={handleAdvance}
      role="region"
      aria-label="Story narration"
    >
      <div className="bubbles-container">
        {/* Show only the current bubble */}
        {currentBubbleIndex < storyLines.length && (
          <div
            key={currentBubbleIndex}
            className={`story-bubble ${creature.id}-bubble ${isTransitioning ? 'fade-out' : 'fade-in'}`}
            data-creature={creature.id}
          >
            {/* Creature-specific particle effects */}
            {creature.id === 'baba-yaga' && (
              <>
                <div className="rune-particle"></div>
                <div className="rune-particle"></div>
                <div className="rune-particle"></div>
              </>
            )}
            {creature.id === 'banshee' && (
              <>
                <div className="echo-ripple"></div>
                <div className="echo-ripple"></div>
                <div className="scanline-noise"></div>
              </>
            )}
            {creature.id === 'aswang' && (
              <>
                <div className="micro-fog"></div>
                <div className="micro-fog"></div>
                <div className="micro-fog"></div>
              </>
            )}
            
            <p className="bubble-text">{storyLines[currentBubbleIndex]}</p>
          </div>
        )}
      </div>

      {/* Requirement 3.5: Show progress indicator dots for remaining bubbles */}
      <div className="progress-indicators">
        {storyLines.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index < currentBubbleIndex ? 'completed' : ''} ${index === currentBubbleIndex ? 'current' : ''}`}
            aria-label={`Story bubble ${index + 1} of ${storyLines.length}`}
          ></div>
        ))}
      </div>

      {/* Requirement 3.5: Tap small "Next" chevron */}
      {currentBubbleIndex < storyLines.length && (
        <button
          className="next-button"
          onClick={handleNextClick}
          aria-label="Next bubble"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default StoryBubbles;

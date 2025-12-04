import React from 'react';
import './SoundCueVisual.css';

/**
 * SoundCueVisual Component
 * 
 * Renders visual feedback and accessible captions for audio cues.
 * 
 * Requirements: 8.2, 8.3, 8.4
 * 
 * @param {object} currentCue - Current sound cue object
 * @param {string} descriptor - Textual descriptor for the sound
 * @param {object} triggerLocation - {x, y} coordinates for effect origin
 * @param {string} visualEffectClass - CSS class for the visual effect
 */
const SoundCueVisual = ({ currentCue, descriptor, triggerLocation, visualEffectClass }) => {
  if (!currentCue) {
    return null;
  }

  return (
    <>
      {/* Visual effect element - Requirement 8.2, 8.3 */}
      <div
        className={`sound-cue-visual ${visualEffectClass}`}
        style={{
          left: `${triggerLocation.x}px`,
          top: `${triggerLocation.y}px`
        }}
        aria-hidden="true"
      />
      
      {/* Accessible caption - Requirement 8.4 */}
      <div
        className="sound-cue-caption"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {descriptor && (
          <span className="sound-cue-descriptor">
            {descriptor}
          </span>
        )}
      </div>
    </>
  );
};

export default SoundCueVisual;

import React from 'react';
import './ReducedMotionToggle.css';

/**
 * Toggle button for reduced motion accessibility
 * Allows users to manually enable/disable animations
 */
function ReducedMotionToggle({ reducedMotion, onToggle }) {
  return (
    <button
      className="reduced-motion-toggle"
      onClick={onToggle}
      aria-label={reducedMotion ? "Enable animations" : "Reduce motion"}
      aria-pressed={reducedMotion}
      title={reducedMotion ? "Enable animations" : "Reduce motion"}
    >
      <span className="toggle-icon" aria-hidden="true">
        {reducedMotion ? '▶' : '⏸'}
      </span>
      <span className="toggle-text">
        {reducedMotion ? 'Animations Off' : 'Animations On'}
      </span>
    </button>
  );
}

export default ReducedMotionToggle;

import React from 'react';
import './BackButton.css';

/**
 * BackButton Component
 * 
 * A circular back arrow button that returns to the home/creature selection page.
 * 
 * @param {Function} onBack - Callback when back button is clicked
 */
const BackButton = ({ onBack }) => {
  return (
    <button
      className="back-button"
      onClick={onBack}
      aria-label="Return to creature selection"
      title="Back to Home"
    >
      <span className="back-icon">←</span>
    </button>
  );
};

export default BackButton;

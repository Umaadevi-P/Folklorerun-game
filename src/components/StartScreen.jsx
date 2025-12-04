import React from 'react';
import './StartScreen.css';

/**
 * StartScreen Component
 * 
 * Entry screen with fire animations and Start Game button.
 * Solves browser autoplay policy by requiring user interaction.
 * 
 * @param {Function} onStart - Callback when user clicks Start Game
 */
function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      {/* Animated fire effects in creature colors - floating particles */}
      <div className="fire-container">
        {/* Purple fire particles */}
        <div className="fire-effect purple-fire" style={{ '--drift': -1 }} aria-hidden="true"></div>
        <div className="fire-effect purple-fire" style={{ '--drift': 1, left: '15%', animationDelay: '0.8s' }} aria-hidden="true"></div>
        <div className="fire-effect purple-fire" style={{ '--drift': 0.5, left: '25%', animationDelay: '1.6s' }} aria-hidden="true"></div>
        
        {/* Blue fire particles */}
        <div className="fire-effect blue-fire" style={{ '--drift': 1 }} aria-hidden="true"></div>
        <div className="fire-effect blue-fire" style={{ '--drift': -0.5, left: '45%', animationDelay: '2.1s' }} aria-hidden="true"></div>
        <div className="fire-effect blue-fire" style={{ '--drift': 0, left: '55%', animationDelay: '2.9s' }} aria-hidden="true"></div>
        
        {/* Red fire particles */}
        <div className="fire-effect red-fire" style={{ '--drift': -1 }} aria-hidden="true"></div>
        <div className="fire-effect red-fire" style={{ '--drift': 0.5, left: '75%', animationDelay: '3.4s' }} aria-hidden="true"></div>
        <div className="fire-effect red-fire" style={{ '--drift': 1, left: '85%', animationDelay: '4.2s' }} aria-hidden="true"></div>
      </div>

      {/* Start button */}
      <button 
        className="start-button"
        onClick={onStart}
        aria-label="Start the game"
      >
        Start Game
      </button>
    </div>
  );
}

export default StartScreen;

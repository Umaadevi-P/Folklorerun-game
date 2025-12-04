import React, { useEffect, useState } from 'react';
import './GoodbyeScreen.css';

/**
 * GoodbyeScreen Component
 * 
 * Displays a Halloween goodbye message with a glitching pumpkin animation.
 * Pumpkin alternates between happy and horror states.
 */
const GoodbyeScreen = () => {
  const [isHorror, setIsHorror] = useState(false);

  useEffect(() => {
    // Glitch between happy and horror pumpkin
    const glitchInterval = setInterval(() => {
      setIsHorror(prev => !prev);
    }, 4000); // Switch every 4 seconds

    // Close application after 12 seconds (3 full cycles)
    const closeTimeout = setTimeout(() => {
      window.close();
      // If window.close() doesn't work (some browsers block it), show a message
      setTimeout(() => {
        document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial; font-size: 1.5rem; color: #fff; background: #0a0a0a;">You can now close this tab. Happy Halloween! 🎃</div>';
      }, 500);
    }, 12000);

    return () => {
      clearInterval(glitchInterval);
      clearTimeout(closeTimeout);
    };
  }, []);

  return (
    <div className="goodbye-screen">
      {/* Fire effects background - same as start screen */}
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

      <div className="goodbye-content">
        <h1 className="goodbye-title">Happy Halloween!</h1>
        <p className="goodbye-subtitle">Thanks for playing... if you dare return 👻</p>
        
        <div className={`pumpkin-container ${isHorror ? 'horror' : 'happy'}`}>
          {/* Happy Pumpkin - Cute version */}
          <div className="pumpkin happy-pumpkin">
            <div className="pumpkin-stem"></div>
            <div className="pumpkin-body">
              {/* Closed round eyes */}
              <div className="pumpkin-eye left closed"></div>
              <div className="pumpkin-eye right closed"></div>
              {/* Cute smile */}
              <div className="pumpkin-mouth cute-smile"></div>
            </div>
          </div>

          {/* Horror Pumpkin - Scary version */}
          <div className="pumpkin horror-pumpkin">
            <div className="pumpkin-stem horror"></div>
            <div className="pumpkin-body horror">
              {/* Wide scary eyes */}
              <div className="pumpkin-eye left horror-eye"></div>
              <div className="pumpkin-eye right horror-eye"></div>
              {/* Jagged scary mouth */}
              <div className="pumpkin-mouth horror-mouth">
                <div className="teeth-row">
                  <div className="sharp-tooth"></div>
                  <div className="sharp-tooth"></div>
                  <div className="sharp-tooth"></div>
                  <div className="sharp-tooth"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="goodbye-message">See you next Halloween...</p>
      </div>
    </div>
  );
};

export default GoodbyeScreen;

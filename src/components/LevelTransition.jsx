import React, { useEffect, useState } from 'react';
import './LevelTransition.css';

/**
 * LevelTransition Component
 * 
 * Shows animated transition between levels with creature-specific obstacles.
 * - Baba Yaga: Character crosses a mystical branch
 * - Banshee: Character crosses icy terrain (pixel style)
 * - Aswang: Character crosses fire trap
 * 
 * @param {Object} props
 * @param {Object} props.creature - Current creature
 * @param {Number} props.fromLevel - Starting level (0, 1)
 * @param {Number} props.toLevel - Destination level (1, 2)
 * @param {Function} props.onComplete - Callback when animation completes
 * @param {Boolean} props.reducedMotion - Accessibility preference
 */
const LevelTransition = ({ creature, fromLevel, toLevel, onComplete, reducedMotion = false }) => {
  const [animationPhase, setAnimationPhase] = useState('enter'); // enter, crossing, exit

  useEffect(() => {
    if (reducedMotion) {
      // Skip animation for reduced motion
      setTimeout(onComplete, 500);
      return;
    }

    // Animation sequence
    const enterTimer = setTimeout(() => {
      setAnimationPhase('crossing');
    }, 500);

    const crossingTimer = setTimeout(() => {
      setAnimationPhase('exit');
    }, 3000);

    const exitTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(crossingTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete, reducedMotion]);

  // Get creature-specific background
  const getBgImagePath = () => {
    const bgFileMap = {
      'baba-yaga': 'Baba Yaga BG.jpg',
      'banshee': 'Banshee BG.jpg',
      'aswang': 'Aswang BG.jpg'
    };
    const filename = bgFileMap[creature.id] || '';
    return filename ? `/assets/${encodeURIComponent(filename)}` : '';
  };

  // Get creature-specific font
  const getCreatureFont = () => {
    const fontMap = {
      'baba-yaga': "'Asimovian', serif",
      'banshee': "'Jersey 10', monospace",
      'aswang': "'Road Rage', serif"
    };
    return fontMap[creature.id] || "'Georgia', serif";
  };

  const bgImagePath = getBgImagePath();
  const creatureFont = getCreatureFont();

  return (
    <div 
      className={`level-transition level-transition--${creature.id} ${reducedMotion ? 'reduced-motion' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Transitioning from level ${fromLevel + 1} to level ${toLevel + 1}`}
    >
      {/* Background with creature-specific image */}
      {bgImagePath && (
        <div 
          className="transition-bg"
          style={{
            backgroundImage: `url(${bgImagePath})`
          }}
        />
      )}

      {/* Level number display - upper center */}
      <div 
        className={`level-number-display phase-${animationPhase}`}
        style={{ fontFamily: creatureFont }}
      >
        <span className="level-from">Level {fromLevel + 1}</span>
        <span className="level-arrow">→</span>
        <span className="level-to">Level {toLevel + 1}</span>
      </div>

      {/* Main character crossing obstacle */}
      <div className={`crossing-scene phase-${animationPhase}`}>
        {/* Character image */}
        <div className="character">
          <img 
            src="/assets/Main%20Character.png" 
            alt="Main character" 
            className="character-image"
          />
        </div>

        {/* Creature-specific obstacle */}
        {creature.id === 'baba-yaga' && (
          <div className="obstacle obstacle-branch">
            <div className="branch-segment branch-1"></div>
            <div className="branch-segment branch-2"></div>
            <div className="branch-segment branch-3"></div>
            <div className="mystical-glow"></div>
          </div>
        )}

        {creature.id === 'banshee' && (
          <div className="obstacle obstacle-ice">
            <div className="ice-block ice-1"></div>
            <div className="ice-block ice-2"></div>
            <div className="ice-block ice-3"></div>
            <div className="ice-crack"></div>
          </div>
        )}

        {creature.id === 'aswang' && (
          <div className="obstacle obstacle-fire">
            <div className="fire-trap fire-1"></div>
            <div className="fire-trap fire-2"></div>
            <div className="fire-trap fire-3"></div>
            <div className="ember-particles"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelTransition;

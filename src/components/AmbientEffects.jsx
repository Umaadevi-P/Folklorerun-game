import React, { useEffect, useState, useCallback } from 'react';
import './AmbientEffects.css';

// Neon colors for Baba Yaga lanterns
const LANTERN_COLORS = ['#A67CFF', '#B88FFF', '#9A6FEE', '#C89FFF', '#8B5FDD'];

const AmbientEffects = ({ 
  creature, 
  mode = 'static', // 'static' for borders, 'flying' for notifications
  trigger = false, // triggers flying animation
  isCorrect = null, // true/false for correct/wrong, null for neutral
  reducedMotion = false 
}) => {
  const [flyingElements, setFlyingElements] = useState([]);
  const [staticElements, setStaticElements] = useState([]);

  // Generate static border elements on mount
  useEffect(() => {
    if (mode === 'static' && !reducedMotion) {
      const elements = generateStaticElements(creature);
      setStaticElements(elements);
    }
  }, [creature, mode, reducedMotion]);

  // Trigger flying elements when notification appears
  useEffect(() => {
    if (mode === 'flying' && trigger && !reducedMotion) {
      const elements = generateFlyingElements(creature, isCorrect);
      setFlyingElements(elements);

      // Clear after animation completes
      const timeout = setTimeout(() => {
        setFlyingElements([]);
      }, 3500);

      return () => clearTimeout(timeout);
    }
  }, [trigger, creature, isCorrect, mode, reducedMotion]);

  const generateStaticElements = (creatureType) => {
    const elements = [];
    const count = 12; // More elements for better coverage
    
    // Create a grid-based distribution to avoid clustering
    const gridSize = 4; // 4x3 grid
    const cellWidth = 100 / gridSize;
    const cellHeight = 100 / 3;
    
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      // Add randomness within each grid cell
      const left = col * cellWidth + (Math.random() * cellWidth * 0.6 + cellWidth * 0.2);
      const top = row * cellHeight + (Math.random() * cellHeight * 0.6 + cellHeight * 0.2);
      
      // Ensure elements stay near borders (top, bottom, left, right edges)
      let position = {};
      const edge = i % 4;
      
      switch (edge) {
        case 0: // top edge
          position = {
            top: `${Math.random() * 15 + 2}%`,
            left: `${left}%`
          };
          break;
        case 1: // right edge
          position = {
            top: `${top}%`,
            right: `${Math.random() * 8 + 2}%`
          };
          break;
        case 2: // bottom edge
          position = {
            bottom: `${Math.random() * 15 + 2}%`,
            left: `${left}%`
          };
          break;
        case 3: // left edge
          position = {
            top: `${top}%`,
            left: `${Math.random() * 8 + 2}%`
          };
          break;
      }

      elements.push({
        id: `static-${i}`,
        type: creatureType,
        position,
        delay: Math.random() * 3
      });
    }

    return elements;
  };

  const generateFlyingElements = (creatureType, correct) => {
    const elements = [];
    const count = correct === null ? 15 : (correct ? 25 : 12); // More for correct answers
    
    // Create a better distributed starting grid
    const gridSize = Math.ceil(Math.sqrt(count));
    const cellSize = 100 / gridSize;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      // Start from grid positions with some randomness
      const startX = col * cellSize + (Math.random() * cellSize * 0.8 + cellSize * 0.1);
      const startY = row * cellSize + (Math.random() * cellSize * 0.8 + cellSize * 0.1);
      
      // Fly in varied directions with better spread
      const angle = (Math.random() * Math.PI * 2);
      const distance = 200 + Math.random() * 200;
      const flyX = Math.cos(angle) * distance;
      const flyY = Math.sin(angle) * distance;
      const flyRotate = (Math.random() - 0.5) * 720; // More rotation
      const duration = 2.5 + Math.random() * 1.5;
      const delay = Math.random() * 0.8;

      elements.push({
        id: `flying-${i}`,
        type: creatureType,
        startX,
        startY,
        flyX,
        flyY,
        flyRotate,
        duration,
        delay
      });
    }

    return elements;
  };

  const renderLantern = (color) => (
    <div className="lantern-body">
      <div className="lantern-string" />
      <div className="lantern-top" />
      <div className="lantern-glow" style={{ '--lantern-color': color }} />
      <div className="lantern-bottom" />
    </div>
  );

  const renderCrystal = () => (
    <div className="crystal-pixel">
      <div className="crystal-shape" />
    </div>
  );

  const renderFire = () => (
    <div className="fire-container">
      <div className="smoke" />
      <div className="flame" />
      <div className="flame inner" />
    </div>
  );

  const renderElement = (element, isStatic) => {
    const color = creature === 'baba-yaga' 
      ? LANTERN_COLORS[Math.floor(Math.random() * LANTERN_COLORS.length)]
      : null;

    const style = isStatic
      ? {
          ...element.position,
          animationDelay: `${element.delay}s`
        }
      : {
          left: `${element.startX}%`,
          top: `${element.startY}%`,
          '--fly-x': `${element.flyX}px`,
          '--fly-y': `${element.flyY}px`,
          '--fly-rotate': `${element.flyRotate}deg`,
          '--fly-duration': `${element.duration}s`,
          animationDelay: `${element.delay}s`
        };

    let className, content;

    switch (creature) {
      case 'baba-yaga':
        className = `ambient-lantern ${isStatic ? 'static' : 'flying'}`;
        content = renderLantern(color);
        break;
      case 'banshee':
        className = `ambient-crystal ${isStatic ? 'static' : 'flying'}`;
        content = renderCrystal();
        break;
      case 'aswang':
        className = `ambient-fire ${isStatic ? 'static' : 'flying'}`;
        content = renderFire();
        break;
      default:
        return null;
    }

    return (
      <div key={element.id} className={className} style={style}>
        {content}
      </div>
    );
  };

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="ambient-effects-container" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'hidden'
    }}>
      {mode === 'static' && staticElements.map(el => renderElement(el, true))}
      {mode === 'flying' && flyingElements.map(el => renderElement(el, false))}
    </div>
  );
};

export default AmbientEffects;

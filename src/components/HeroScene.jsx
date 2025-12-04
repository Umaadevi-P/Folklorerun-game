import React, { useEffect, useState } from 'react';
import './HeroScene.css';
import AmbientEffects from './AmbientEffects';

/**
 * HeroScene Component
 * 
 * Main visual canvas displaying story scenes with atmospheric effects.
 * Implements creature-specific fog, particles, and visual elements.
 * Displays creature-specific BG image with 20% blur.
 * 
 * Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4, 6.5
 * 
 * @param {Object} props
 * @param {Object} props.creature - Current creature object with id, name, etc.
 * @param {Object} props.level - Current level data with scene text
 * @param {String} props.sceneText - Text to display in the scene
 * @param {Object} props.uiConfig - UI configuration object from JSON
 * @param {String} props.gameState - Current mood state (calm/tense/critical)
 * @param {Boolean} props.reducedMotion - Accessibility preference
 */
const HeroScene = ({ 
  creature, 
  level, 
  sceneText, 
  uiConfig, 
  gameState = 'calm',
  reducedMotion = false 
}) => {
  const [isLowPower, setIsLowPower] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Detect low-power devices - Requirement 5.5
    // Check for battery API and low battery mode
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setIsLowPower(battery.level < 0.2 || battery.charging === false);
      });
    }

    // Also check for reduced motion preference
    const prefersReducedMotion = window.matchMedia 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;
    
    if (prefersReducedMotion) {
      setIsLowPower(true);
    }
  }, []);

  useEffect(() => {
    // Subtle parallax shift on pointer movement (phone-light) - Requirement 4.2
    if (reducedMotion) return;

    const handlePointerMove = (e) => {
      // Calculate offset based on pointer position (normalized to -1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      // Apply subtle shift (max 20px in each direction)
      setParallaxOffset({
        x: x * 10,
        y: y * 10
      });
    };

    // Also handle device orientation for phone tilt
    const handleOrientation = (e) => {
      if (e.beta !== null && e.gamma !== null) {
        // beta: front-to-back tilt (-180 to 180)
        // gamma: left-to-right tilt (-90 to 90)
        const x = Math.max(-1, Math.min(1, e.gamma / 45)); // normalize to -1 to 1
        const y = Math.max(-1, Math.min(1, e.beta / 45));
        
        setParallaxOffset({
          x: x * 10,
          y: y * 10
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [reducedMotion]);

  if (!creature || !uiConfig) {
    return <div className="hero-scene">Loading scene...</div>;
  }

  // Get creature-specific config
  const creatureConfig = uiConfig.creatures?.[creature.id] || {};
  const stateConfig = uiConfig.gameStates?.[gameState] || uiConfig.gameStates?.calm || {};

  // Calculate particle count based on device capabilities - Requirement 5.5
  const baseParticleCount = stateConfig.particleCount || 20;
  const particleCount = isLowPower || reducedMotion 
    ? Math.min(10, Math.floor(baseParticleCount / 2))
    : baseParticleCount;

  // Determine if we should show particles at all
  const showParticles = !reducedMotion && particleCount > 0;

  // CSS variables for dynamic styling
  const cssVariables = {
    '--creature-primary': creatureConfig.primaryColor || '#FFB84D',
    '--creature-secondary': creatureConfig.secondaryColor || '#FF8C42',
    '--fog-color': creatureConfig.fogColor || 'rgba(255, 184, 77, 0.3)',
    '--particle-color': creatureConfig.particleColor || '#FFD700',
    '--fog-density': stateConfig.fogDensity || 0.3,
    '--animation-speed': creatureConfig.animationSpeed || 1.0,
    '--animation-intensity': stateConfig.animationIntensity || 0.5,
    '--glow-intensity': creatureConfig.glowIntensity || 0.8,
  };

  // Apply vignette for critical state
  const showVignette = stateConfig.vignette && !reducedMotion;
  const vignetteIntensity = stateConfig.vignetteIntensity || 0.6;

  // Get creature-specific background image path - Requirement 4.1
  // Exact filenames: Baba Yaga BG.jpg, Banshee BG.jpg, Aswang BG.jpg
  const getBgImagePath = () => {
    const bgFileMap = {
      'baba-yaga': 'Baba Yaga BG.jpg',
      'banshee': 'Banshee BG.jpg',
      'aswang': 'Aswang BG.jpg'
    };
    const filename = bgFileMap[creature.id] || '';
    const path = filename ? `/assets/${encodeURIComponent(filename)}` : '';
    console.log('🖼️ Background image path for', creature.id, ':', path);
    return path;
  };

  const bgImagePath = getBgImagePath();

  // Get creature-specific font
  const getCreatureFont = () => {
    const fontMap = {
      'baba-yaga': "'Asimovian', serif",
      'banshee': "'Jersey 10', monospace",
      'aswang': "'Road Rage', serif"
    };
    return fontMap[creature.id] || "'Georgia', serif";
  };

  return (
    <div 
      className={`hero-scene hero-scene--${creature.id} ${reducedMotion ? 'reduced-motion' : ''}`}
      style={cssVariables}
      role="main"
      aria-label="Game scene"
    >
      {/* Creature-specific background image with 20% blur - Requirement 4.1 */}
      {bgImagePath && (
        <div 
          className="bg-image-container"
          style={{
            transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
            transition: reducedMotion ? 'none' : 'transform 0.3s ease-out'
          }}
          aria-hidden="true"
        >
          <div 
            className="bg-image"
            style={{
              backgroundImage: `url("${bgImagePath}")`,
              backgroundColor: '#1a1a1a' // Fallback color
            }}
            onError={(e) => {
              console.error('❌ Failed to load background image:', bgImagePath);
            }}
          />
        </div>
      )}

      {/* Creature-specific light animations - Requirements 5.1, 5.2, 5.3 */}
      <div className="fog-layers" aria-hidden="true"></div>

      {/* Creature-specific visual elements - Requirements 5.1, 5.2, 5.3 */}
      {creature.id === 'baba-yaga' && (
        <div className="creature-effects baba-yaga-effects" aria-hidden="true">
          {/* Neon-glowing runes - Requirement 5.1 */}
          <div className="rune-glow rune-1"></div>
          <div className="rune-glow rune-2"></div>
          <div className="rune-glow rune-3"></div>
          <div className="rune-glow rune-4"></div>
        </div>
      )}

      {creature.id === 'banshee' && (
        <div className="creature-effects banshee-effects" aria-hidden="true">
          {/* Echo-wave animations - Requirement 5.2 */}
          <div className="echo-wave echo-wave-1"></div>
          <div className="echo-wave echo-wave-2"></div>
          <div className="echo-wave echo-wave-3"></div>
        </div>
      )}

      {creature.id === 'aswang' && (
        <div className="creature-effects aswang-effects" aria-hidden="true">
          {/* Flickering lantern light - Requirement 5.3 */}
          <div className="lantern-flicker lantern-1"></div>
          <div className="lantern-flicker lantern-2"></div>
          <div className="lantern-flicker lantern-3"></div>
        </div>
      )}

      {/* Particle system - Requirement 5.4 */}
      {showParticles && (
        <div className="particles" aria-hidden="true">
          {Array.from({ length: particleCount }).map((_, i) => (
            <div
              key={i}
              className={`particle particle--${creatureConfig.particleType || 'default'}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${(5 + Math.random() * 5) / (creatureConfig.animationSpeed || 1)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Ambient effects - static border elements */}
      <AmbientEffects 
        creature={creature.id}
        mode="static"
        reducedMotion={reducedMotion}
      />

      {/* Vignette effect for critical state */}
      {showVignette && (
        <div 
          className="vignette-overlay" 
          style={{ '--vignette-intensity': vignetteIntensity }}
          aria-hidden="true"
        ></div>
      )}

      {/* Scene text with proper contrast - Requirement 4.5 - Positioned at top */}
      <div className="scene-content">
        <div className="scene-text-container">
          <p 
            className="scene-text"
            style={{ fontFamily: getCreatureFont() }}
          >
            {sceneText || level?.enrichedScene || level?.sceneText || ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroScene;

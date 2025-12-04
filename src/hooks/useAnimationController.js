import { useState, useEffect, useMemo } from 'react';

/**
 * useAnimationController Hook
 * 
 * Manages dynamic animation parameters based on UI config and game state.
 * Maps UI config values to CSS custom properties and adjusts animation intensity.
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 5.5
 * 
 * @param {object} uiConfig - UI configuration object from ui_dynamic_config.json
 * @param {string} gameStateIntensity - Current mood state (calm/tense/critical)
 * @param {object} creature - Current creature object with visual theme data
 * @param {boolean} reducedMotion - Whether reduced motion is enabled
 * @returns {object} Animation controller with CSS variables and parameters
 */
const useAnimationController = (uiConfig, gameStateIntensity = 'calm', creature = null, reducedMotion = false) => {
  const [isLowPowerDevice, setIsLowPowerDevice] = useState(false);

  /**
   * Detect low-power devices on mount
   * Requirements: 5.5
   */
  useEffect(() => {
    // Check for battery API to detect low-power mode
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        // Consider device low-power if battery saver is on or battery is low
        const isLowPower = battery.charging === false && battery.level < 0.2;
        setIsLowPowerDevice(isLowPower);
      }).catch(() => {
        // Battery API not available, assume normal power
        setIsLowPowerDevice(false);
      });
    }

    // Also check for hardware concurrency (number of CPU cores)
    // Devices with 2 or fewer cores are considered low-power
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      setIsLowPowerDevice(true);
    }
  }, []);

  /**
   * Calculate CSS variables based on current state
   * Requirements: 11.4
   */
  const cssVariables = useMemo(() => {
    if (!uiConfig) {
      return {};
    }

    const vars = {};

    // Get game state configuration (calm/tense/critical)
    // Requirements: 11.1, 11.2, 11.3
    const stateConfig = uiConfig.gameStates?.[gameStateIntensity] || uiConfig.gameStates?.calm || {};

    // Get creature-specific configuration
    const creatureConfig = creature && uiConfig.creatures?.[creature.id] 
      ? uiConfig.creatures[creature.id] 
      : {};

    // Map fog density
    // Requirement: 11.1, 11.2, 11.3
    if (stateConfig.fogDensity !== undefined) {
      vars['--fog-density'] = reducedMotion ? 0.2 : stateConfig.fogDensity;
    }

    // Map animation intensity
    if (stateConfig.animationIntensity !== undefined) {
      vars['--animation-intensity'] = reducedMotion ? 0.3 : stateConfig.animationIntensity;
    }

    // Map creature-specific colors
    if (creatureConfig.primaryColor) {
      vars['--creature-primary-color'] = creatureConfig.primaryColor;
    }
    if (creatureConfig.secondaryColor) {
      vars['--creature-secondary-color'] = creatureConfig.secondaryColor;
    }
    if (creatureConfig.fogColor) {
      vars['--creature-fog-color'] = creatureConfig.fogColor;
    }
    if (creatureConfig.particleColor) {
      vars['--creature-particle-color'] = creatureConfig.particleColor;
    }

    // Map animation speed
    if (creatureConfig.animationSpeed !== undefined) {
      vars['--animation-speed'] = reducedMotion ? 0.5 : creatureConfig.animationSpeed;
    }

    // Map glow intensity
    if (creatureConfig.glowIntensity !== undefined) {
      vars['--glow-intensity'] = reducedMotion ? 0.3 : creatureConfig.glowIntensity;
    }

    // Map screen tilt effect for tense/critical states
    // Requirement: 11.2, 11.3
    if (stateConfig.screenTilt && !reducedMotion) {
      vars['--screen-tilt'] = gameStateIntensity === 'critical' ? '2deg' : '1deg';
    } else {
      vars['--screen-tilt'] = '0deg';
    }

    // Map vignette effect for tense/critical states
    // Requirement: 11.3
    if (stateConfig.vignette && !reducedMotion) {
      const vignetteIntensity = stateConfig.vignetteIntensity || 0.5;
      vars['--vignette-intensity'] = vignetteIntensity;
    } else {
      vars['--vignette-intensity'] = 0;
    }

    // Map distortion effect for critical state
    // Requirement: 11.3
    if (stateConfig.distortion && !reducedMotion) {
      const distortionAmount = stateConfig.distortionAmount || 0.02;
      vars['--distortion-amount'] = distortionAmount;
    } else {
      vars['--distortion-amount'] = 0;
    }

    // Map transition timings
    // Requirement: 11.5
    if (uiConfig.transitions) {
      vars['--transition-state-change'] = uiConfig.transitions.stateChange || '350ms ease-in-out';
      vars['--transition-scene'] = uiConfig.transitions.sceneTransition || '420ms cubic-bezier(0.4, 0, 0.2, 1)';
      vars['--transition-choice-feedback'] = uiConfig.transitions.choiceFeedback || '200ms ease-out';
      vars['--transition-fog-shift'] = uiConfig.transitions.fogShift || '500ms ease-in-out';
    }

    return vars;
  }, [uiConfig, gameStateIntensity, creature, reducedMotion]);

  /**
   * Calculate particle count based on state and device capabilities
   * Requirements: 5.5, 11.1, 11.2, 11.3
   */
  const particleCount = useMemo(() => {
    if (!uiConfig) {
      return 20;
    }

    // Reduced motion disables particles
    if (reducedMotion) {
      return 0;
    }

    // Get base particle count from game state
    const stateConfig = uiConfig.gameStates?.[gameStateIntensity] || uiConfig.gameStates?.calm || {};
    let count = stateConfig.particleCount !== undefined ? stateConfig.particleCount : 20;

    // Reduce for low-power devices
    // Requirement: 5.5
    if (isLowPowerDevice) {
      const lowPowerConfig = uiConfig.performance?.lowPowerMode || {};
      count = lowPowerConfig.particleCount !== undefined ? lowPowerConfig.particleCount : 10;
    }

    return count;
  }, [uiConfig, gameStateIntensity, reducedMotion, isLowPowerDevice]);

  /**
   * Calculate animation speed multiplier
   * Requirements: 11.4
   */
  const animationSpeed = useMemo(() => {
    if (!uiConfig || !creature) {
      return 1.0;
    }

    // Reduced motion slows animations
    if (reducedMotion) {
      return 0.5;
    }

    const creatureConfig = uiConfig.creatures?.[creature.id] || {};
    const speed = creatureConfig.animationSpeed;
    // Handle NaN, null, undefined, or 0 - default to 1.0
    return (typeof speed === 'number' && !isNaN(speed) && speed > 0) ? speed : 1.0;
  }, [uiConfig, creature, reducedMotion]);

  /**
   * Get animation frame rate target
   * Requirements: 5.5
   */
  const targetFrameRate = useMemo(() => {
    if (!uiConfig) {
      return 60;
    }

    if (isLowPowerDevice) {
      const lowPowerConfig = uiConfig.performance?.lowPowerMode || {};
      return lowPowerConfig.animationFrameRate || 30;
    }

    return uiConfig.performance?.defaultFrameRate || 60;
  }, [uiConfig, isLowPowerDevice]);

  /**
   * Apply CSS variables to document root
   * Requirements: 11.4, 11.5
   */
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply all CSS variables with smooth transitions
    // Requirement: 11.5 (300-420ms transitions)
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, String(value));
    });

    // Cleanup on unmount
    return () => {
      Object.keys(cssVariables).forEach(property => {
        root.style.removeProperty(property);
      });
    };
  }, [cssVariables]);

  return {
    cssVariables,
    particleCount,
    animationSpeed,
    targetFrameRate,
    isLowPowerDevice,
    gameStateIntensity
  };
};

export default useAnimationController;

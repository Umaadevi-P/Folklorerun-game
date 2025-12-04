import { useState, useCallback, useEffect } from 'react';

/**
 * useSoundCue Hook
 * 
 * Handles audio cue visualization for accessibility.
 * Maps sound cues to visual effects and textual descriptors.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 * 
 * @param {object} uiConfig - UI configuration object containing soundCues
 * @returns {object} Sound cue controller with playSoundCue function and current cue state
 */
const useSoundCue = (uiConfig) => {
  const [currentCue, setCurrentCue] = useState(null);
  const [visualEffect, setVisualEffect] = useState(null);
  const [descriptor, setDescriptor] = useState('');
  const [triggerLocation, setTriggerLocation] = useState({ x: 0, y: 0 });

  /**
   * Play a sound cue by triggering visual feedback
   * Requirements: 8.1, 8.2, 8.5
   * 
   * @param {string} cueName - Name of the sound cue (e.g., 'choice-select', 'correct-choice')
   * @param {object} options - Optional parameters
   * @param {number} options.x - X coordinate for visual effect trigger location
   * @param {number} options.y - Y coordinate for visual effect trigger location
   */
  const playSoundCue = useCallback((cueName, options = {}) => {
    // Requirement 8.5: Log the cue name
    console.log(`[Sound Cue] ${cueName}`);

    if (!uiConfig || !uiConfig.soundCues) {
      console.warn('UI config or sound cues not available');
      return;
    }

    const cueConfig = uiConfig.soundCues[cueName];

    if (!cueConfig) {
      console.warn(`Sound cue "${cueName}" not found in config`);
      return;
    }

    // Requirement 8.1: Display textual descriptor
    const cueDescriptor = cueConfig.descriptor || cueName;
    setDescriptor(cueDescriptor);

    // Requirement 8.2, 8.3: Map to visual effect
    const effect = cueConfig.visualEffect || 'ripple';
    setVisualEffect(effect);

    // Set trigger location for visual effect
    // Requirement 8.3: Render visual ripple effects at trigger locations
    const location = {
      x: options.x !== undefined ? options.x : window.innerWidth / 2,
      y: options.y !== undefined ? options.y : window.innerHeight / 2
    };
    setTriggerLocation(location);

    // Set current cue
    setCurrentCue({
      name: cueName,
      descriptor: cueDescriptor,
      visualEffect: effect,
      duration: cueConfig.duration || 500,
      timestamp: Date.now()
    });

    // Clear the cue after its duration
    const duration = cueConfig.duration || 500;
    setTimeout(() => {
      setCurrentCue(null);
      setVisualEffect(null);
      setDescriptor('');
    }, duration);
  }, [uiConfig]);

  /**
   * Clear current sound cue manually
   */
  const clearSoundCue = useCallback(() => {
    setCurrentCue(null);
    setVisualEffect(null);
    setDescriptor('');
  }, []);

  /**
   * Get CSS class for current visual effect
   * Requirements: 8.2, 8.3
   */
  const getVisualEffectClass = useCallback(() => {
    if (!visualEffect) {
      return '';
    }

    // Map visual effects to CSS classes
    const effectMap = {
      'ripple': 'sound-effect-ripple',
      'pulse': 'sound-effect-pulse',
      'shake': 'sound-effect-shake',
      'fade': 'sound-effect-fade',
      'burst': 'sound-effect-burst'
    };

    return effectMap[visualEffect] || 'sound-effect-ripple';
  }, [visualEffect]);

  return {
    // State
    currentCue,
    visualEffect,
    descriptor,
    triggerLocation,
    
    // Actions
    playSoundCue,
    clearSoundCue,
    getVisualEffectClass
  };
};

export default useSoundCue;

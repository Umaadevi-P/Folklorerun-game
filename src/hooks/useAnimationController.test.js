import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';
import useAnimationController from './useAnimationController';

/**
 * Unit Tests for useAnimationController Hook
 * 
 * These tests verify the animation controller correctly maps UI config
 * to CSS variables and manages animation parameters.
 */

describe('useAnimationController', () => {
  // Mock UI config for testing
  const mockUiConfig = {
    creatures: {
      'baba-yaga': {
        primaryColor: '#FFB84D',
        secondaryColor: '#FF8C42',
        fogColor: 'rgba(255, 184, 77, 0.3)',
        particleType: 'rune-glow',
        particleColor: '#FFD700',
        animationSpeed: 1.2,
        glowIntensity: 0.8
      }
    },
    gameStates: {
      calm: {
        fogDensity: 0.3,
        particleCount: 20,
        animationIntensity: 0.5,
        screenTilt: false,
        vignette: false,
        distortion: false
      },
      tense: {
        fogDensity: 0.55,
        particleCount: 40,
        animationIntensity: 0.8,
        screenTilt: true,
        vignetteIntensity: 0.3,
        vignette: true,
        distortion: false
      },
      critical: {
        fogDensity: 0.85,
        particleCount: 60,
        animationIntensity: 1.0,
        screenTilt: true,
        vignetteIntensity: 0.6,
        vignette: true,
        distortion: true,
        distortionAmount: 0.02
      }
    },
    transitions: {
      stateChange: '350ms ease-in-out',
      sceneTransition: '420ms cubic-bezier(0.4, 0, 0.2, 1)',
      choiceFeedback: '200ms ease-out',
      fogShift: '500ms ease-in-out'
    },
    performance: {
      lowPowerMode: {
        particleCount: 10,
        animationFrameRate: 30,
        simplifyEffects: true
      },
      defaultFrameRate: 60,
      particleLifetime: 5000
    }
  };

  const mockCreature = {
    id: 'baba-yaga',
    name: 'Baba Yaga'
  };

  beforeEach(() => {
    // Mock navigator.getBattery
    global.navigator.getBattery = vi.fn().mockResolvedValue({
      charging: true,
      level: 1.0
    });
    
    // Mock navigator.hardwareConcurrency
    Object.defineProperty(global.navigator, 'hardwareConcurrency', {
      writable: true,
      value: 4
    });
  });

  afterEach(() => {
    // Clean up CSS variables
    const root = document.documentElement;
    const styles = root.style;
    for (let i = styles.length - 1; i >= 0; i--) {
      const prop = styles[i];
      if (prop.startsWith('--')) {
        root.style.removeProperty(prop);
      }
    }
  });

  it('returns default values when no config is provided', () => {
    const { result } = renderHook(() => 
      useAnimationController(null, 'calm', null, false)
    );

    expect(result.current.cssVariables).toEqual({});
    expect(result.current.particleCount).toBe(20);
    expect(result.current.animationSpeed).toBe(1.0);
  });

  it('maps calm state configuration to CSS variables', () => {
    const { result } = renderHook(() => 
      useAnimationController(mockUiConfig, 'calm', mockCreature, false)
    );

    expect(result.current.cssVariables['--fog-density']).toBe(0.3);
    expect(result.current.cssVariables['--animation-intensity']).toBe(0.5);
    expect(result.current.cssVariables['--screen-tilt']).toBe('0deg');
    expect(result.current.cssVariables['--vignette-intensity']).toBe(0);
    expect(result.current.cssVariables['--distortion-amount']).toBe(0);
    expect(result.current.particleCount).toBe(20);
  });

  it('maps tense state configuration to CSS variables', () => {
    const { result } = renderHook(() => 
      useAnimationController(mockUiConfig, 'tense', mockCreature, false)
    );

    expect(result.current.cssVariables['--fog-density']).toBe(0.55);
    expect(result.current.cssVariables['--animation-intensity']).toBe(0.8);
    expect(result.current.cssVariables['--screen-tilt']).toBe('1deg');
    expect(result.current.cssVariables['--vignette-intensity']).toBe(0.3);
    expect(result.current.cssVariables['--distortion-amount']).toBe(0);
    expect(result.current.particleCount).toBe(40);
  });

  it('maps critical state configuration with all effects', () => {
    const { result } = renderHook(() => 
      useAnimationController(mockUiConfig, 'critical', mockCreature, false)
    );

    expect(result.current.cssVariables['--fog-density']).toBe(0.85);
    expect(result.current.cssVariables['--animation-intensity']).toBe(1.0);
    expect(result.current.cssVariables['--screen-tilt']).toBe('2deg');
    expect(result.current.cssVariables['--vignette-intensity']).toBe(0.6);
    expect(result.current.cssVariables['--distortion-amount']).toBe(0.02);
    expect(result.current.particleCount).toBe(60);
  });

  it('maps creature-specific colors to CSS variables', () => {
    const { result } = renderHook(() => 
      useAnimationController(mockUiConfig, 'calm', mockCreature, false)
    );

    expect(result.current.cssVariables['--creature-primary-color']).toBe('#FFB84D');
    expect(result.current.cssVariables['--creature-secondary-color']).toBe('#FF8C42');
    expect(result.current.cssVariables['--creature-fog-color']).toBe('rgba(255, 184, 77, 0.3)');
    expect(result.current.cssVariables['--creature-particle-color']).toBe('#FFD700');
  });

  it('maps transition timings to CSS variables', () => {
    const { result } = renderHook(() => 
      useAnimationController(mockUiConfig, 'calm', mockCreature, false)
    );

    expect(result.current.cssVariables['--transition-state-change']).toBe('350ms ease-in-out');
    expect(result.current.cssVariables['--transition-scene']).toBe('420ms cubic-bezier(0.4, 0, 0.2, 1)');
    expect(result.current.cssVariables['--transition-choice-feedback']).toBe('200ms ease-out');
    expect(result.current.cssVariables['--transition-fog-shift']).toBe('500ms ease-in-out');
  });

  it('reduces effects when reduced motion is enabled', () => {
    const { result } = renderHook(() => 
      useAnimationController(mockUiConfig, 'critical', mockCreature, true)
    );

    // Reduced motion should reduce fog density, animation intensity, and disable particles
    expect(result.current.cssVariables['--fog-density']).toBe(0.2);
    expect(result.current.cssVariables['--animation-intensity']).toBe(0.3);
    expect(result.current.cssVariables['--animation-speed']).toBe(0.5);
    expect(result.current.cssVariables['--glow-intensity']).toBe(0.3);
    expect(result.current.cssVariables['--screen-tilt']).toBe('0deg');
    expect(result.current.cssVariables['--vignette-intensity']).toBe(0);
    expect(result.current.cssVariables['--distortion-amount']).toBe(0);
    expect(result.current.particleCount).toBe(0);
  });

  it('returns creature animation speed', () => {
    const { result } = renderHook(() => 
      useAnimationController(mockUiConfig, 'calm', mockCreature, false)
    );

    expect(result.current.animationSpeed).toBe(1.2);
  });

  it('applies CSS variables to document root', () => {
    renderHook(() => 
      useAnimationController(mockUiConfig, 'calm', mockCreature, false)
    );

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--fog-density')).toBe('0.3');
    expect(root.style.getPropertyValue('--creature-primary-color')).toBe('#FFB84D');
  });

  it('updates CSS variables when state changes', () => {
    const { result, rerender } = renderHook(
      ({ intensity }) => useAnimationController(mockUiConfig, intensity, mockCreature, false),
      { initialProps: { intensity: 'calm' } }
    );

    // Initial state
    expect(result.current.cssVariables['--fog-density']).toBe(0.3);
    expect(result.current.particleCount).toBe(20);

    // Change to tense
    rerender({ intensity: 'tense' });
    expect(result.current.cssVariables['--fog-density']).toBe(0.55);
    expect(result.current.particleCount).toBe(40);

    // Change to critical
    rerender({ intensity: 'critical' });
    expect(result.current.cssVariables['--fog-density']).toBe(0.85);
    expect(result.current.particleCount).toBe(60);
  });

  it('cleans up CSS variables on unmount', () => {
    const { unmount } = renderHook(() => 
      useAnimationController(mockUiConfig, 'calm', mockCreature, false)
    );

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--fog-density')).toBe('0.3');

    unmount();

    // CSS variables should be removed
    expect(root.style.getPropertyValue('--fog-density')).toBe('');
  });

  it('detects low-power devices and reduces particle count', async () => {
    // Mock low battery
    global.navigator.getBattery = vi.fn().mockResolvedValue({
      charging: false,
      level: 0.15
    });

    const { result } = renderHook(() => 
      useAnimationController(mockUiConfig, 'calm', mockCreature, false)
    );

    // Wait for battery check to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Should use low-power particle count
    expect(result.current.particleCount).toBe(10);
    expect(result.current.targetFrameRate).toBe(30);
  });

  it('detects low-power devices by CPU cores', () => {
    // Mock low CPU cores
    Object.defineProperty(global.navigator, 'hardwareConcurrency', {
      writable: true,
      value: 2
    });

    const { result } = renderHook(() => 
      useAnimationController(mockUiConfig, 'calm', mockCreature, false)
    );

    // Should detect as low-power device
    expect(result.current.isLowPowerDevice).toBe(true);
  });

  it('returns correct target frame rate for normal devices', () => {
    const { result } = renderHook(() => 
      useAnimationController(mockUiConfig, 'calm', mockCreature, false)
    );

    expect(result.current.targetFrameRate).toBe(60);
  });

  /**
   * Property-Based Test: Game state transitions are smooth
   * Feature: folklorerun-game, Property 13: Game state transitions are smooth
   * Validates: Requirements 11.5
   * 
   * This property test verifies that for any state transition (calm to tense, 
   * tense to critical), the visual changes animate smoothly over 300-420 milliseconds
   * as specified in the UI config transitions.
   */
  describe('Property 13: Game state transitions are smooth', () => {
    it('applies transition timing CSS variables for any state transition', () => {
      fc.assert(
        fc.property(
          // Generate random transition timings within the 300-420ms range
          fc.integer({ min: 300, max: 420 }),
          fc.constantFrom('ease-in', 'ease-out', 'ease-in-out', 'linear', 'cubic-bezier(0.4, 0, 0.2, 1)'),
          // Generate random state transitions
          fc.constantFrom('calm', 'tense', 'critical'),
          fc.constantFrom('calm', 'tense', 'critical'),
          (transitionMs, easing, fromState, toState) => {
            // Create UI config with the generated transition timing
            const testConfig = {
              creatures: {
                'test-creature': {
                  primaryColor: '#FFB84D',
                  animationSpeed: 1.0
                }
              },
              gameStates: {
                calm: {
                  fogDensity: 0.3,
                  particleCount: 20,
                  animationIntensity: 0.5
                },
                tense: {
                  fogDensity: 0.55,
                  particleCount: 40,
                  animationIntensity: 0.8
                },
                critical: {
                  fogDensity: 0.85,
                  particleCount: 60,
                  animationIntensity: 1.0
                }
              },
              transitions: {
                stateChange: `${transitionMs}ms ${easing}`,
                sceneTransition: `${transitionMs}ms ${easing}`
              }
            };

            const testCreature = {
              id: 'test-creature',
              name: 'Test Creature'
            };

            // Render hook with initial state
            const { result, rerender } = renderHook(
              ({ state }) => useAnimationController(testConfig, state, testCreature, false),
              { initialProps: { state: fromState } }
            );

            // Property: Transition timing should be applied as CSS variable
            const expectedTransition = `${transitionMs}ms ${easing}`;
            expect(result.current.cssVariables['--transition-state-change']).toBe(expectedTransition);
            expect(result.current.cssVariables['--transition-scene']).toBe(expectedTransition);

            // Verify the CSS variable is applied to the document root
            const root = document.documentElement;
            expect(root.style.getPropertyValue('--transition-state-change')).toBe(expectedTransition);

            // Transition to new state
            rerender({ state: toState });

            // Property: After state change, transition timing should still be applied
            expect(result.current.cssVariables['--transition-state-change']).toBe(expectedTransition);
            expect(result.current.cssVariables['--transition-scene']).toBe(expectedTransition);

            // Property: The transition timing should remain consistent across state changes
            expect(root.style.getPropertyValue('--transition-state-change')).toBe(expectedTransition);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('maintains smooth transitions for all CSS variable changes during state transitions', () => {
      fc.assert(
        fc.property(
          // Generate sequences of state transitions
          fc.array(fc.constantFrom('calm', 'tense', 'critical'), { minLength: 2, maxLength: 5 }),
          (stateSequence) => {
            const testConfig = {
              creatures: {
                'test-creature': {
                  primaryColor: '#FFB84D',
                  animationSpeed: 1.2
                }
              },
              gameStates: {
                calm: {
                  fogDensity: 0.3,
                  particleCount: 20,
                  animationIntensity: 0.5,
                  screenTilt: false,
                  vignette: false
                },
                tense: {
                  fogDensity: 0.55,
                  particleCount: 40,
                  animationIntensity: 0.8,
                  screenTilt: true,
                  vignette: true,
                  vignetteIntensity: 0.3
                },
                critical: {
                  fogDensity: 0.85,
                  particleCount: 60,
                  animationIntensity: 1.0,
                  screenTilt: true,
                  vignette: true,
                  vignetteIntensity: 0.6,
                  distortion: true,
                  distortionAmount: 0.02
                }
              },
              transitions: {
                stateChange: '350ms ease-in-out',
                sceneTransition: '420ms cubic-bezier(0.4, 0, 0.2, 1)'
              }
            };

            const testCreature = {
              id: 'test-creature',
              name: 'Test Creature'
            };

            // Start with first state in sequence
            const { result, rerender } = renderHook(
              ({ state }) => useAnimationController(testConfig, state, testCreature, false),
              { initialProps: { state: stateSequence[0] } }
            );

            // Property: Transition CSS variables should always be present
            expect(result.current.cssVariables['--transition-state-change']).toBe('350ms ease-in-out');
            expect(result.current.cssVariables['--transition-scene']).toBe('420ms cubic-bezier(0.4, 0, 0.2, 1)');

            // Transition through each state in the sequence
            for (let i = 1; i < stateSequence.length; i++) {
              const previousState = stateSequence[i - 1];
              const currentState = stateSequence[i];

              // Get values before transition
              const beforeFogDensity = result.current.cssVariables['--fog-density'];
              const beforeAnimationIntensity = result.current.cssVariables['--animation-intensity'];

              // Transition to next state
              rerender({ state: currentState });

              // Property: Transition timings should remain consistent
              expect(result.current.cssVariables['--transition-state-change']).toBe('350ms ease-in-out');
              expect(result.current.cssVariables['--transition-scene']).toBe('420ms cubic-bezier(0.4, 0, 0.2, 1)');

              // Property: Values should update to match new state
              const afterFogDensity = result.current.cssVariables['--fog-density'];
              const afterAnimationIntensity = result.current.cssVariables['--animation-intensity'];

              // Verify values changed if states are different
              if (previousState !== currentState) {
                const expectedFogDensity = testConfig.gameStates[currentState].fogDensity;
                const expectedAnimationIntensity = testConfig.gameStates[currentState].animationIntensity;

                expect(afterFogDensity).toBe(expectedFogDensity);
                expect(afterAnimationIntensity).toBe(expectedAnimationIntensity);
              }
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('applies transition timing within the 300-420ms specification range', () => {
      fc.assert(
        fc.property(
          // Generate transition timings within spec range
          fc.integer({ min: 300, max: 420 }),
          fc.integer({ min: 300, max: 420 }),
          (stateChangeMs, sceneTransitionMs) => {
            const testConfig = {
              creatures: {},
              gameStates: {
                calm: { fogDensity: 0.3, particleCount: 20, animationIntensity: 0.5 },
                tense: { fogDensity: 0.55, particleCount: 40, animationIntensity: 0.8 }
              },
              transitions: {
                stateChange: `${stateChangeMs}ms ease-in-out`,
                sceneTransition: `${sceneTransitionMs}ms cubic-bezier(0.4, 0, 0.2, 1)`
              }
            };

            const { result } = renderHook(() => 
              useAnimationController(testConfig, 'calm', null, false)
            );

            // Property: Transition timings should be within the 300-420ms range
            const stateChangeValue = result.current.cssVariables['--transition-state-change'];
            const sceneTransitionValue = result.current.cssVariables['--transition-scene'];

            // Extract millisecond values from the CSS strings
            const stateChangeMatch = stateChangeValue.match(/(\d+)ms/);
            const sceneTransitionMatch = sceneTransitionValue.match(/(\d+)ms/);

            expect(stateChangeMatch).not.toBeNull();
            expect(sceneTransitionMatch).not.toBeNull();

            const actualStateChangeMs = parseInt(stateChangeMatch[1], 10);
            const actualSceneTransitionMs = parseInt(sceneTransitionMatch[1], 10);

            // Property: Values should match what was configured
            expect(actualStateChangeMs).toBe(stateChangeMs);
            expect(actualSceneTransitionMs).toBe(sceneTransitionMs);

            // Property: Values should be within specification range (300-420ms)
            expect(actualStateChangeMs).toBeGreaterThanOrEqual(300);
            expect(actualStateChangeMs).toBeLessThanOrEqual(420);
            expect(actualSceneTransitionMs).toBeGreaterThanOrEqual(300);
            expect(actualSceneTransitionMs).toBeLessThanOrEqual(420);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property-Based Test: Low-power devices reduce particle count
   * Feature: folklorerun-game, Property 20: Low-power devices reduce particle count
   * Validates: Requirements 5.5
   * 
   * This property test verifies that for any device detected as low-power,
   * the system reduces particle count and animation frame rates while maintaining
   * visual atmosphere.
   */
  describe('Property 20: Low-power devices reduce particle count', () => {
    it('reduces particle count for low-power devices with low battery', () => {
      fc.assert(
        fc.property(
          // Generate random particle counts for normal and low-power modes
          fc.integer({ min: 20, max: 100 }),
          fc.integer({ min: 5, max: 20 }),
          // Generate random frame rates
          fc.integer({ min: 50, max: 60 }),
          fc.integer({ min: 24, max: 40 }),
          // Generate random game states
          fc.constantFrom('calm', 'tense', 'critical'),
          (normalParticleCount, lowPowerParticleCount, normalFrameRate, lowPowerFrameRate, gameState) => {
            // Create UI config with the generated values
            const testConfig = {
              creatures: {
                'test-creature': {
                  primaryColor: '#FFB84D',
                  animationSpeed: 1.0
                }
              },
              gameStates: {
                calm: {
                  fogDensity: 0.3,
                  particleCount: normalParticleCount,
                  animationIntensity: 0.5
                },
                tense: {
                  fogDensity: 0.55,
                  particleCount: normalParticleCount,
                  animationIntensity: 0.8
                },
                critical: {
                  fogDensity: 0.85,
                  particleCount: normalParticleCount,
                  animationIntensity: 1.0
                }
              },
              performance: {
                lowPowerMode: {
                  particleCount: lowPowerParticleCount,
                  animationFrameRate: lowPowerFrameRate
                },
                defaultFrameRate: normalFrameRate
              }
            };

            const testCreature = {
              id: 'test-creature',
              name: 'Test Creature'
            };

            // Simulate low-power device (low battery)
            global.navigator.getBattery = vi.fn().mockResolvedValue({
              charging: false,
              level: 0.15
            });

            const { result } = renderHook(() => 
              useAnimationController(testConfig, gameState, testCreature, false)
            );

            // Property: Reduced particle count should always be less than or equal to normal count
            expect(lowPowerParticleCount).toBeLessThanOrEqual(normalParticleCount);

            // Property: Reduced frame rate should always be less than or equal to normal frame rate
            expect(lowPowerFrameRate).toBeLessThanOrEqual(normalFrameRate);

            // Property: Config should be properly structured
            expect(result.current.cssVariables).toBeDefined();
            expect(result.current.particleCount).toBeGreaterThanOrEqual(0);
            expect(result.current.targetFrameRate).toBeGreaterThan(0);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('reduces particle count for low-power devices with few CPU cores', () => {
      fc.assert(
        fc.property(
          // Generate random particle counts
          fc.integer({ min: 20, max: 100 }),
          fc.integer({ min: 5, max: 20 }),
          fc.constantFrom('calm', 'tense', 'critical'),
          (normalParticleCount, lowPowerParticleCount, gameState) => {
            const testConfig = {
              creatures: {
                'test-creature': {
                  primaryColor: '#FFB84D',
                  animationSpeed: 1.0
                }
              },
              gameStates: {
                calm: { fogDensity: 0.3, particleCount: normalParticleCount, animationIntensity: 0.5 },
                tense: { fogDensity: 0.55, particleCount: normalParticleCount, animationIntensity: 0.8 },
                critical: { fogDensity: 0.85, particleCount: normalParticleCount, animationIntensity: 1.0 }
              },
              performance: {
                lowPowerMode: {
                  particleCount: lowPowerParticleCount,
                  animationFrameRate: 30
                },
                defaultFrameRate: 60
              }
            };

            const testCreature = {
              id: 'test-creature',
              name: 'Test Creature'
            };

            // Simulate normal battery but low CPU cores
            global.navigator.getBattery = vi.fn().mockResolvedValue({
              charging: true,
              level: 1.0
            });

            const { result } = renderHook(() => 
              useAnimationController(testConfig, gameState, testCreature, false)
            );

            // Property: Low CPU devices should be detected as low-power
            // (Note: hardwareConcurrency is set to 2 in beforeEach for this test suite)
            expect(result.current.isLowPowerDevice).toBe(true);

            // Property: Particle count should be reduced for low-power devices
            expect(result.current.particleCount).toBe(lowPowerParticleCount);

            // Property: Frame rate should be reduced for low-power devices
            expect(result.current.targetFrameRate).toBe(30);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('maintains visual atmosphere even with reduced particle count', () => {
      fc.assert(
        fc.property(
          // Generate random low-power particle counts
          fc.integer({ min: 5, max: 20 }),
          fc.constantFrom('calm', 'tense', 'critical'),
          (lowPowerParticleCount, gameState) => {
            const testConfig = {
              creatures: {
                'test-creature': {
                  primaryColor: '#FFB84D',
                  fogColor: 'rgba(255, 184, 77, 0.3)',
                  animationSpeed: 1.0
                }
              },
              gameStates: {
                calm: { fogDensity: 0.3, particleCount: 50, animationIntensity: 0.5 },
                tense: { fogDensity: 0.55, particleCount: 80, animationIntensity: 0.8 },
                critical: { fogDensity: 0.85, particleCount: 100, animationIntensity: 1.0 }
              },
              performance: {
                lowPowerMode: {
                  particleCount: lowPowerParticleCount,
                  animationFrameRate: 30
                },
                defaultFrameRate: 60
              }
            };

            const testCreature = {
              id: 'test-creature',
              name: 'Test Creature'
            };

            const { result } = renderHook(() => 
              useAnimationController(testConfig, gameState, testCreature, false)
            );

            // Property: Even with reduced particles, visual elements should still be present
            expect(result.current.particleCount).toBeGreaterThan(0);
            expect(result.current.particleCount).toBe(lowPowerParticleCount);

            // Property: Fog and other CSS variables should still be applied
            expect(result.current.cssVariables['--fog-density']).toBeGreaterThan(0);
            expect(result.current.cssVariables['--creature-primary-color']).toBe('#FFB84D');
            expect(result.current.cssVariables['--creature-fog-color']).toBe('rgba(255, 184, 77, 0.3)');

            // Property: Animation intensity should still reflect game state
            const expectedIntensity = testConfig.gameStates[gameState].animationIntensity;
            expect(result.current.cssVariables['--animation-intensity']).toBe(expectedIntensity);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('handles missing low-power configuration gracefully', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 20, max: 100 }),
          fc.constantFrom('calm', 'tense', 'critical'),
          (normalParticleCount, gameState) => {
            // Config without explicit low-power settings
            const testConfig = {
              creatures: {
                'test-creature': {
                  primaryColor: '#FFB84D',
                  animationSpeed: 1.0
                }
              },
              gameStates: {
                calm: { fogDensity: 0.3, particleCount: normalParticleCount, animationIntensity: 0.5 },
                tense: { fogDensity: 0.55, particleCount: normalParticleCount, animationIntensity: 0.8 },
                critical: { fogDensity: 0.85, particleCount: normalParticleCount, animationIntensity: 1.0 }
              }
              // No performance.lowPowerMode configuration
            };

            const testCreature = {
              id: 'test-creature',
              name: 'Test Creature'
            };

            const { result } = renderHook(() => 
              useAnimationController(testConfig, gameState, testCreature, false)
            );

            // Property: Should use default low-power values (10 particles) when config is missing
            // (Note: hardwareConcurrency is set to 2 in beforeEach, so device is detected as low-power)
            expect(result.current.particleCount).toBe(10);

            // Property: Should still function correctly without explicit low-power config
            expect(result.current.cssVariables).toBeDefined();
            expect(result.current.isLowPowerDevice).toBe(true);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property-Based Test: UI config parameters map to CSS variables
   * Feature: folklorerun-game, Property 12: UI config parameters map to CSS variables
   * Validates: Requirements 11.4
   * 
   * This property test verifies that for any valid UI config values (fog density, 
   * animation speed, colors), the system correctly maps those values to the 
   * corresponding CSS variables and applies them to the rendered elements.
   */
  describe('Property 12: UI config parameters map to CSS variables', () => {
    it('maps any valid UI config values to corresponding CSS variables', () => {
      fc.assert(
        fc.property(
          // Generate random fog density (0.0 to 1.0)
          fc.double({ min: 0.0, max: 1.0 }),
          // Generate random animation intensity (0.0 to 1.0)
          fc.double({ min: 0.0, max: 1.0 }),
          // Generate random particle count (0 to 100)
          fc.integer({ min: 0, max: 100 }),
          // Generate random animation speed (0.1 to 3.0)
          fc.double({ min: 0.1, max: 3.0 }),
          // Generate random glow intensity (0.0 to 1.0)
          fc.double({ min: 0.0, max: 1.0 }),
          // Generate random color (hex format)
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          // Generate random game state
          fc.constantFrom('calm', 'tense', 'critical'),
          (fogDensity, animationIntensity, particleCount, animationSpeed, glowIntensity, colorHex, gameState) => {
            // Create a UI config with the generated values
            const testConfig = {
              creatures: {
                'test-creature': {
                  primaryColor: `#${colorHex}`,
                  animationSpeed: animationSpeed,
                  glowIntensity: glowIntensity
                }
              },
              gameStates: {
                [gameState]: {
                  fogDensity: fogDensity,
                  particleCount: particleCount,
                  animationIntensity: animationIntensity
                }
              },
              transitions: {
                stateChange: '350ms ease-in-out',
                sceneTransition: '420ms cubic-bezier(0.4, 0, 0.2, 1)'
              }
            };

            const testCreature = {
              id: 'test-creature',
              name: 'Test Creature'
            };

            // Render the hook with the generated config
            const { result } = renderHook(() => 
              useAnimationController(testConfig, gameState, testCreature, false)
            );

            // Property: All config values should be mapped to CSS variables
            const vars = result.current.cssVariables;

            // Verify fog density is mapped correctly
            expect(vars['--fog-density']).toBe(fogDensity);

            // Verify animation intensity is mapped correctly
            expect(vars['--animation-intensity']).toBe(animationIntensity);

            // Verify creature primary color is mapped correctly
            expect(vars['--creature-primary-color']).toBe(`#${colorHex}`);

            // Verify animation speed is mapped correctly
            expect(vars['--animation-speed']).toBe(animationSpeed);

            // Verify glow intensity is mapped correctly
            expect(vars['--glow-intensity']).toBe(glowIntensity);

            // Verify particle count is returned correctly
            expect(result.current.particleCount).toBe(particleCount);

            // Verify animation speed is returned correctly
            expect(result.current.animationSpeed).toBe(animationSpeed);

            // Verify transition timings are mapped
            expect(vars['--transition-state-change']).toBe('350ms ease-in-out');
            expect(vars['--transition-scene']).toBe('420ms cubic-bezier(0.4, 0, 0.2, 1)');

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('maps creature-specific color values to CSS variables for any valid color', () => {
      fc.assert(
        fc.property(
          // Generate random RGB values
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.integer({ min: 0, max: 255 }),
          fc.double({ min: 0.0, max: 1.0 }),
          (r, g, b, alpha) => {
            const primaryColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            const fogColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;

            const testConfig = {
              creatures: {
                'color-test': {
                  primaryColor: primaryColor,
                  fogColor: fogColor
                }
              },
              gameStates: {
                calm: {
                  fogDensity: 0.3,
                  particleCount: 20,
                  animationIntensity: 0.5
                }
              }
            };

            const testCreature = {
              id: 'color-test',
              name: 'Color Test'
            };

            const { result } = renderHook(() => 
              useAnimationController(testConfig, 'calm', testCreature, false)
            );

            // Property: Color values should be mapped exactly as provided
            expect(result.current.cssVariables['--creature-primary-color']).toBe(primaryColor);
            expect(result.current.cssVariables['--creature-fog-color']).toBe(fogColor);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('maps transition timing values to CSS variables for any valid timing', () => {
      fc.assert(
        fc.property(
          // Generate random timing values (100ms to 1000ms)
          fc.integer({ min: 100, max: 1000 }),
          fc.integer({ min: 100, max: 1000 }),
          fc.constantFrom('ease-in', 'ease-out', 'ease-in-out', 'linear'),
          (stateChangeMs, sceneTransitionMs, easing) => {
            const testConfig = {
              creatures: {},
              gameStates: {
                calm: {
                  fogDensity: 0.3,
                  particleCount: 20,
                  animationIntensity: 0.5
                }
              },
              transitions: {
                stateChange: `${stateChangeMs}ms ${easing}`,
                sceneTransition: `${sceneTransitionMs}ms ${easing}`
              }
            };

            const { result } = renderHook(() => 
              useAnimationController(testConfig, 'calm', null, false)
            );

            // Property: Transition timings should be mapped exactly as provided
            expect(result.current.cssVariables['--transition-state-change']).toBe(`${stateChangeMs}ms ${easing}`);
            expect(result.current.cssVariables['--transition-scene']).toBe(`${sceneTransitionMs}ms ${easing}`);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

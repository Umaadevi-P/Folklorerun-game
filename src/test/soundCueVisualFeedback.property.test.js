import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';
import useSoundCue from '../hooks/useSoundCue';

/**
 * Property-Based Tests for Sound Cue Visual Feedback
 * 
 * Feature: folklorerun-game, Property 17: Sound cues trigger visual feedback
 * Validates: Requirements 8.2, 8.5
 * 
 * Property: For any sound cue call, the system should log the cue name 
 * and trigger the corresponding visual effect (ripple, pulse, shake).
 */

describe('Property 17: Sound cues trigger visual feedback', () => {
  let consoleLogSpy;

  // Mock UI config with sound cues
  const mockUiConfig = {
    soundCues: {
      'choice-select': {
        descriptor: 'soft-neon-chime',
        visualEffect: 'ripple',
        duration: 300
      },
      'correct-choice': {
        descriptor: 'warm-glow-hum',
        visualEffect: 'pulse',
        duration: 500
      },
      'incorrect-choice': {
        descriptor: 'hollow-echo',
        visualEffect: 'shake',
        duration: 400
      },
      'level-complete': {
        descriptor: 'ascending-shimmer',
        visualEffect: 'ripple',
        duration: 600
      },
      'game-over': {
        descriptor: 'descending-drone',
        visualEffect: 'fade',
        duration: 800
      },
      'victory': {
        descriptor: 'triumphant-chime',
        visualEffect: 'burst',
        duration: 1000
      }
    }
  };

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    vi.useRealTimers();
  });

  // Generator for valid sound cue names from the config
  const soundCueNameArbitrary = fc.constantFrom(
    'choice-select',
    'correct-choice',
    'incorrect-choice',
    'level-complete',
    'game-over',
    'victory'
  );

  // Generator for trigger locations
  const triggerLocationArbitrary = fc.record({
    x: fc.integer({ min: 0, max: 1920 }),
    y: fc.integer({ min: 0, max: 1080 })
  });

  it('property: any sound cue logs the cue name', () => {
    fc.assert(
      fc.property(soundCueNameArbitrary, (cueName) => {
        // Clear previous calls
        consoleLogSpy.mockClear();

        const { result } = renderHook(() => useSoundCue(mockUiConfig));

        act(() => {
          result.current.playSoundCue(cueName);
        });

        // Requirement 8.5: Log the cue name
        expect(consoleLogSpy).toHaveBeenCalledWith(`[Sound Cue] ${cueName}`);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('property: any sound cue triggers corresponding visual effect', () => {
    fc.assert(
      fc.property(soundCueNameArbitrary, (cueName) => {
        const { result } = renderHook(() => useSoundCue(mockUiConfig));

        act(() => {
          result.current.playSoundCue(cueName);
        });

        // Requirement 8.2: Map to visual effects
        const expectedEffect = mockUiConfig.soundCues[cueName].visualEffect;
        expect(result.current.visualEffect).toBe(expectedEffect);

        // Verify currentCue is set with correct data
        expect(result.current.currentCue).not.toBeNull();
        expect(result.current.currentCue.name).toBe(cueName);
        expect(result.current.currentCue.visualEffect).toBe(expectedEffect);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('property: any sound cue sets correct descriptor', () => {
    fc.assert(
      fc.property(soundCueNameArbitrary, (cueName) => {
        const { result } = renderHook(() => useSoundCue(mockUiConfig));

        act(() => {
          result.current.playSoundCue(cueName);
        });

        // Requirement 8.1: Display textual descriptor
        const expectedDescriptor = mockUiConfig.soundCues[cueName].descriptor;
        expect(result.current.descriptor).toBe(expectedDescriptor);
        expect(result.current.currentCue.descriptor).toBe(expectedDescriptor);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('property: any sound cue with location sets trigger location', () => {
    fc.assert(
      fc.property(
        soundCueNameArbitrary,
        triggerLocationArbitrary,
        (cueName, location) => {
          const { result } = renderHook(() => useSoundCue(mockUiConfig));

          act(() => {
            result.current.playSoundCue(cueName, location);
          });

          // Requirement 8.3: Render at trigger locations
          expect(result.current.triggerLocation).toEqual(location);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('property: any sound cue returns correct CSS class for visual effect', () => {
    fc.assert(
      fc.property(soundCueNameArbitrary, (cueName) => {
        const { result } = renderHook(() => useSoundCue(mockUiConfig));

        act(() => {
          result.current.playSoundCue(cueName);
        });

        const visualEffect = mockUiConfig.soundCues[cueName].visualEffect;
        const cssClass = result.current.getVisualEffectClass();

        // Map visual effects to expected CSS classes
        const expectedClassMap = {
          'ripple': 'sound-effect-ripple',
          'pulse': 'sound-effect-pulse',
          'shake': 'sound-effect-shake',
          'fade': 'sound-effect-fade',
          'burst': 'sound-effect-burst'
        };

        expect(cssClass).toBe(expectedClassMap[visualEffect]);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('property: any sound cue clears after its duration', () => {
    fc.assert(
      fc.property(soundCueNameArbitrary, (cueName) => {
        const { result } = renderHook(() => useSoundCue(mockUiConfig));

        act(() => {
          result.current.playSoundCue(cueName);
        });

        // Verify cue is active
        expect(result.current.currentCue).not.toBeNull();
        expect(result.current.visualEffect).not.toBeNull();

        // Advance time by the cue's duration
        const duration = mockUiConfig.soundCues[cueName].duration;
        act(() => {
          vi.advanceTimersByTime(duration);
        });

        // Verify cue is cleared
        expect(result.current.currentCue).toBeNull();
        expect(result.current.visualEffect).toBeNull();
        expect(result.current.descriptor).toBe('');

        return true;
      }),
      { numRuns: 100 }
    );
  });
});

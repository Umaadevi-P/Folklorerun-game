import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useSoundCue from './useSoundCue';

describe('useSoundCue Hook', () => {
  let consoleLogSpy;
  let consoleWarnSpy;

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
      }
    }
  };

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    vi.useRealTimers();
  });

  // Requirement 8.5: Log cue names
  it('should log sound cue name when playSoundCue is called', () => {
    const { result } = renderHook(() => useSoundCue(mockUiConfig));

    act(() => {
      result.current.playSoundCue('choice-select');
    });

    expect(consoleLogSpy).toHaveBeenCalledWith('[Sound Cue] choice-select');
  });

  // Requirement 8.1: Display textual descriptor
  it('should set descriptor from config when playing sound cue', () => {
    const { result } = renderHook(() => useSoundCue(mockUiConfig));

    act(() => {
      result.current.playSoundCue('correct-choice');
    });

    expect(result.current.descriptor).toBe('warm-glow-hum');
  });

  // Requirement 8.2, 8.3: Map to visual effects
  it('should set visual effect from config', () => {
    const { result } = renderHook(() => useSoundCue(mockUiConfig));

    act(() => {
      result.current.playSoundCue('incorrect-choice');
    });

    expect(result.current.visualEffect).toBe('shake');
  });

  // Requirement 8.3: Render at trigger locations
  it('should set trigger location from options', () => {
    const { result } = renderHook(() => useSoundCue(mockUiConfig));

    act(() => {
      result.current.playSoundCue('choice-select', { x: 100, y: 200 });
    });

    expect(result.current.triggerLocation).toEqual({ x: 100, y: 200 });
  });

  it('should use default center location when no coordinates provided', () => {
    const { result } = renderHook(() => useSoundCue(mockUiConfig));

    // Mock window dimensions
    global.innerWidth = 1024;
    global.innerHeight = 768;

    act(() => {
      result.current.playSoundCue('choice-select');
    });

    expect(result.current.triggerLocation).toEqual({ x: 512, y: 384 });
  });

  it('should set currentCue with all relevant data', () => {
    const { result } = renderHook(() => useSoundCue(mockUiConfig));

    act(() => {
      result.current.playSoundCue('choice-select');
    });

    expect(result.current.currentCue).toMatchObject({
      name: 'choice-select',
      descriptor: 'soft-neon-chime',
      visualEffect: 'ripple',
      duration: 300
    });
    expect(result.current.currentCue.timestamp).toBeDefined();
  });

  it('should clear cue after duration', () => {
    const { result } = renderHook(() => useSoundCue(mockUiConfig));

    act(() => {
      result.current.playSoundCue('choice-select');
    });

    expect(result.current.currentCue).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.currentCue).toBeNull();
    expect(result.current.visualEffect).toBeNull();
    expect(result.current.descriptor).toBe('');
  });

  it('should handle missing UI config gracefully', () => {
    const { result } = renderHook(() => useSoundCue(null));

    act(() => {
      result.current.playSoundCue('choice-select');
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith('UI config or sound cues not available');
    expect(result.current.currentCue).toBeNull();
  });

  it('should handle unknown sound cue gracefully', () => {
    const { result } = renderHook(() => useSoundCue(mockUiConfig));

    act(() => {
      result.current.playSoundCue('unknown-cue');
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith('Sound cue "unknown-cue" not found in config');
    expect(result.current.currentCue).toBeNull();
  });

  it('should clear sound cue manually', () => {
    const { result } = renderHook(() => useSoundCue(mockUiConfig));

    act(() => {
      result.current.playSoundCue('choice-select');
    });

    expect(result.current.currentCue).not.toBeNull();

    act(() => {
      result.current.clearSoundCue();
    });

    expect(result.current.currentCue).toBeNull();
    expect(result.current.visualEffect).toBeNull();
    expect(result.current.descriptor).toBe('');
  });

  it('should return correct CSS class for visual effects', () => {
    const { result } = renderHook(() => useSoundCue(mockUiConfig));

    act(() => {
      result.current.playSoundCue('choice-select');
    });

    expect(result.current.getVisualEffectClass()).toBe('sound-effect-ripple');

    act(() => {
      result.current.clearSoundCue();
      result.current.playSoundCue('correct-choice');
    });

    expect(result.current.getVisualEffectClass()).toBe('sound-effect-pulse');

    act(() => {
      result.current.clearSoundCue();
      result.current.playSoundCue('incorrect-choice');
    });

    expect(result.current.getVisualEffectClass()).toBe('sound-effect-shake');
  });

  it('should return empty string when no visual effect is active', () => {
    const { result } = renderHook(() => useSoundCue(mockUiConfig));

    expect(result.current.getVisualEffectClass()).toBe('');
  });

  it('should use default duration if not specified in config', () => {
    const configWithoutDuration = {
      soundCues: {
        'test-cue': {
          descriptor: 'test',
          visualEffect: 'ripple'
        }
      }
    };

    const { result } = renderHook(() => useSoundCue(configWithoutDuration));

    act(() => {
      result.current.playSoundCue('test-cue');
    });

    expect(result.current.currentCue.duration).toBe(500);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.currentCue).toBeNull();
  });
});

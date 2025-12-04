import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useReducedMotion from './useReducedMotion';

describe('useReducedMotion', () => {
  let matchMediaMock;

  beforeEach(() => {
    // Mock window.matchMedia
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    };

    window.matchMedia = vi.fn(() => matchMediaMock);
  });

  it('should initialize with system preference', () => {
    matchMediaMock.matches = true;
    const { result } = renderHook(() => useReducedMotion());
    
    expect(result.current.reducedMotion).toBe(true);
  });

  it('should initialize with false when system preference is not set', () => {
    matchMediaMock.matches = false;
    const { result } = renderHook(() => useReducedMotion());
    
    expect(result.current.reducedMotion).toBe(false);
  });

  it('should toggle reduced motion when toggleReducedMotion is called', () => {
    const { result } = renderHook(() => useReducedMotion());
    
    expect(result.current.reducedMotion).toBe(false);
    
    act(() => {
      result.current.toggleReducedMotion();
    });
    
    expect(result.current.reducedMotion).toBe(true);
    
    act(() => {
      result.current.toggleReducedMotion();
    });
    
    expect(result.current.reducedMotion).toBe(false);
  });

  it('should listen for changes to system preference', () => {
    const { result } = renderHook(() => useReducedMotion());
    
    expect(matchMediaMock.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('should update state when system preference changes', () => {
    const { result } = renderHook(() => useReducedMotion());
    
    expect(result.current.reducedMotion).toBe(false);
    
    // Simulate system preference change
    const changeHandler = matchMediaMock.addEventListener.mock.calls[0][1];
    act(() => {
      changeHandler({ matches: true });
    });
    
    expect(result.current.reducedMotion).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const { unmount } = renderHook(() => useReducedMotion());
    
    unmount();
    
    expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('should use fallback for older browsers without addEventListener', () => {
    matchMediaMock.addEventListener = undefined;
    
    const { result } = renderHook(() => useReducedMotion());
    
    expect(matchMediaMock.addListener).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });
});

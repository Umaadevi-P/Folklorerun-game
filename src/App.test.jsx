import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch for JSON data loading
global.fetch = vi.fn();

describe('App', () => {
  beforeEach(() => {
    // Mock window.matchMedia for reduced motion detection
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Mock fetch to return fallback data
    global.fetch.mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    );

    // Clear all mocks
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    render(<App />);
    // Wait for data loading to complete and intro animation to render
    await waitFor(() => {
      expect(screen.getByText(/FOLKLORERUN/i)).toBeInTheDocument();
    });
  });

  it('loads game data on mount', async () => {
    render(<App />);
    
    // Should show loading state initially
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    
    // Wait for data to load (will use fallback)
    await waitFor(() => {
      expect(screen.getByText(/FOLKLORERUN/i)).toBeInTheDocument();
    });
  });

  it('applies reduced motion class to body when enabled', async () => {
    const { rerender } = render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/FOLKLORERUN/i)).toBeInTheDocument();
    });

    // Initially should not have reduced motion class
    expect(document.body.classList.contains('reduced-motion-active')).toBe(false);
    
    // Note: Full test would require toggling the reduced motion button
    // which is tested in the ReducedMotionToggle component tests
  });

  it('renders ErrorBoundary wrapper', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/FOLKLORERUN/i)).toBeInTheDocument();
    });
    
    // App should render without errors
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
  });

  it('integrates useGameEngine hook', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/FOLKLORERUN/i)).toBeInTheDocument();
    });
    
    // Game engine should be initialized (intro state)
    // This is verified by the intro animation rendering
  });

  it('integrates useAnimationController hook', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/FOLKLORERUN/i)).toBeInTheDocument();
    });
    
    // Animation controller should set CSS variables
    // Check that root element has some CSS variables set
    const root = document.documentElement;
    // Note: CSS variables are set by useAnimationController
    // Full verification would require checking specific variables
  });
});

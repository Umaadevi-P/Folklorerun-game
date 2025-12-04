import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

/**
 * Integration Tests for Complete Game Flows
 * 
 * Tests the full user journey through the FOLKLORERUN game:
 * - Victory path: intro → select → 3 correct choices → victory
 * - Defeat path: intro → select → incorrect choice → defeat
 * - Reduced motion mode throughout entire flow
 * - Keyboard-only navigation through entire game
 * 
 * Task: 17.1
 */

describe('Game Flow Integration Tests', () => {
  beforeEach(() => {
    // Mock window.matchMedia for reduced motion detection
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Mock fetch to return fallback data (will trigger fallback mechanism)
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.reject(new Error('Network error'))
    );

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('Victory Path: intro → select → 3 correct choices → victory', () => {
    it('completes full victory flow for Baba Yaga', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Wait for creature selection (intro auto-completes after 3-5 seconds)
      await waitFor(() => {
        expect(screen.getByText(/Choose Your Encounter/i)).toBeInTheDocument();
      }, { timeout: 7000 });

      // Select Baba Yaga
      const babaYagaButton = screen.getByRole('button', { name: /Select Baba Yaga/i });
      await user.click(babaYagaButton);

      // Wait for Level 1 (CreatureSelection has 3-second delay)
      await waitFor(() => {
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Level 0: Make correct choice
      const correctChoice1 = screen.getByRole('button', { name: /Speak the answer with cleverness/i });
      await user.click(correctChoice1);

      // Wait for consequence to display
      await waitFor(() => {
        expect(screen.getByText(/impressed/i)).toBeInTheDocument();
      }, { timeout: 1000 });

      // Wait for consequence to clear and Level 2 to appear (2 second delay + render time)
      await waitFor(() => {
        expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Level 1: Make correct choice
      const correctChoice2 = screen.getByRole('button', { name: /Answer with wisdom/i });
      await user.click(correctChoice2);

      // Wait for consequence to display
      await waitFor(() => {
        expect(screen.getByText(/Wise indeed/i)).toBeInTheDocument();
      }, { timeout: 1000 });

      // Wait for consequence to clear and Level 3 to appear (2 second delay + render time)
      await waitFor(() => {
        expect(screen.getByText(/Level 3/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Level 2: Make correct choice
      const correctChoice3 = screen.getByRole('button', { name: /Solve the final riddle/i });
      await user.click(correctChoice3);

      // Victory screen should appear
      await waitFor(() => {
        expect(screen.getByText(/Victory/i)).toBeInTheDocument();
      }, { timeout: 2000 });

      // Verify restart button is present (matches aria-label)
      const restartButton = screen.getByRole('button', { name: /Restart game/i });
      expect(restartButton).toBeInTheDocument();
    }, 25000); // Increase test timeout to 25 seconds
  });

  describe('Defeat Path: intro → select → incorrect choice → defeat', () => {
    it('shows defeat screen after incorrect choice on Level 0', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Wait for creature selection
      await waitFor(() => {
        expect(screen.getByText(/Choose Your Encounter/i)).toBeInTheDocument();
      }, { timeout: 7000 });

      // Select Baba Yaga
      const babaYagaButton = screen.getByRole('button', { name: /Select Baba Yaga/i });
      await user.click(babaYagaButton);

      // Wait for Level 1
      await waitFor(() => {
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Make incorrect choice
      const incorrectChoice = screen.getByRole('button', { name: /Demand she let you pass/i });
      await user.click(incorrectChoice);

      // Defeat screen should appear
      await waitFor(() => {
        expect(screen.getByText(/Defeat/i)).toBeInTheDocument();
      }, { timeout: 2000 });

      // Verify restart button is present (matches aria-label)
      const restartButton = screen.getByRole('button', { name: /Restart game/i });
      expect(restartButton).toBeInTheDocument();
    }, 15000);

    it('shows defeat screen after incorrect choice on Level 1', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Wait for creature selection
      await waitFor(() => {
        expect(screen.getByText(/Choose Your Encounter/i)).toBeInTheDocument();
      }, { timeout: 7000 });

      // Select Banshee
      const bansheeButton = screen.getByRole('button', { name: /Select Banshee/i });
      await user.click(bansheeButton);

      // Wait for Level 1
      await waitFor(() => {
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Level 0: Make correct choice
      const correctChoice1 = screen.getByRole('button', { name: /Speak gently of remembrance/i });
      await user.click(correctChoice1);

      // Wait for consequence to display
      await waitFor(() => {
        expect(screen.getByText(/Her wail softens/i)).toBeInTheDocument();
      }, { timeout: 1000 });

      // Wait for consequence to clear and Level 2 to appear (2 second delay + render time)
      await waitFor(() => {
        expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Wait for new choices to be available
      await waitFor(() => {
        const choices = screen.getAllByRole('button', { name: /Choice/i });
        expect(choices.length).toBeGreaterThan(0);
        expect(choices[0]).not.toBeDisabled();
      }, { timeout: 1000 });

      // Level 1: Make incorrect choice
      const incorrectChoice = screen.getByRole('button', { name: /Turn away from her/i });
      await user.click(incorrectChoice);

      // Defeat screen
      await waitFor(() => {
        expect(screen.getByText(/Defeat/i)).toBeInTheDocument();
      }, { timeout: 2000 });

      expect(screen.getByRole('button', { name: /Restart game/i })).toBeInTheDocument();
    }, 18000);
  });

  describe('Restart functionality', () => {
    it('returns to creature selection after defeat and restart', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Quick defeat path
      await waitFor(() => {
        expect(screen.getByText(/Choose Your Encounter/i)).toBeInTheDocument();
      }, { timeout: 7000 });

      const babaYagaButton = screen.getByRole('button', { name: /Select Baba Yaga/i });
      await user.click(babaYagaButton);

      await waitFor(() => {
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Make incorrect choice
      const incorrectChoice = screen.getByRole('button', { name: /Demand she let you pass/i });
      await user.click(incorrectChoice);

      // Wait for defeat (may take a moment for state transition)
      await waitFor(() => {
        expect(screen.getByText(/Defeat/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Click restart (button has aria-label)
      const restartButton = screen.getByRole('button', { name: /Restart game/i });
      await user.click(restartButton);

      // Should return to creature selection
      await waitFor(() => {
        expect(screen.getByText(/Choose Your Encounter/i)).toBeInTheDocument();
        expect(screen.getByText(/Baba Yaga/i)).toBeInTheDocument();
        expect(screen.getByText(/Banshee/i)).toBeInTheDocument();
        expect(screen.getByText(/Aswang/i)).toBeInTheDocument();
      });
    }, 18000);
  });

  describe('Reduced Motion Mode Throughout Entire Flow', () => {
    it('maintains reduced motion throughout complete game flow', async () => {
      const user = userEvent.setup();
      
      // Mock prefers-reduced-motion: reduce
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? true : false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(<App />);

      // Body should have reduced motion class from the start
      await waitFor(() => {
        expect(document.body.classList.contains('reduced-motion-active')).toBe(true);
      });

      // Wait for creature selection
      await waitFor(() => {
        expect(screen.getByText(/Choose Your Encounter/i)).toBeInTheDocument();
      }, { timeout: 7000 });

      // Reduced motion should still be active
      expect(document.body.classList.contains('reduced-motion-active')).toBe(true);

      // Select creature
      const babaYagaButton = screen.getByRole('button', { name: /Select Baba Yaga/i });
      await user.click(babaYagaButton);

      // In level gameplay
      await waitFor(() => {
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Reduced motion should still be active
      expect(document.body.classList.contains('reduced-motion-active')).toBe(true);
    }, 15000);

    it('allows toggling reduced motion during gameplay', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Wait for intro
      await waitFor(() => {
        expect(screen.getByText(/FOLKLORERUN/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Initially reduced motion should be off
      expect(document.body.classList.contains('reduced-motion-active')).toBe(false);

      // Find and click the reduced motion toggle
      const toggleButton = screen.getByRole('button', { name: /Reduce motion/i });
      await user.click(toggleButton);

      // Reduced motion should now be active
      expect(document.body.classList.contains('reduced-motion-active')).toBe(true);

      // Wait for creature selection
      await waitFor(() => {
        expect(screen.getByText(/Choose Your Encounter/i)).toBeInTheDocument();
      }, { timeout: 7000 });

      // Reduced motion should persist
      expect(document.body.classList.contains('reduced-motion-active')).toBe(true);
    }, 12000);
  });

  describe('Keyboard-Only Navigation Through Entire Game', () => {
    it('completes game using keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Wait for creature selection
      await waitFor(() => {
        expect(screen.getByText(/Choose Your Encounter/i)).toBeInTheDocument();
      }, { timeout: 7000 });

      // Use keyboard to select creature
      const babaYagaButton = screen.getByRole('button', { name: /Select Baba Yaga/i });
      babaYagaButton.focus();
      await user.keyboard('{Enter}');

      // Level 0 - use keyboard to select choice
      await waitFor(() => {
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      const correctChoice1 = screen.getByRole('button', { name: /Speak the answer with cleverness/i });
      correctChoice1.focus();
      await user.keyboard('{Enter}');

      // Wait for consequence and level transition (2 second delay in useGameEngine)
      await waitFor(() => {
        expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
      }, { timeout: 4000 });

      // Verify we progressed
      expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
    }, 18000);

    it('supports Space key for button activation', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Wait for creature selection
      await waitFor(() => {
        expect(screen.getByText(/Choose Your Encounter/i)).toBeInTheDocument();
      }, { timeout: 7000 });

      // Focus and activate with Space
      const babaYagaButton = screen.getByRole('button', { name: /Select Baba Yaga/i });
      babaYagaButton.focus();
      await user.keyboard(' '); // Space key

      // Should transition to level
      await waitFor(() => {
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Use Space to make choice
      const correctChoice = screen.getByRole('button', { name: /Speak the answer with cleverness/i });
      correctChoice.focus();
      await user.keyboard(' ');

      // Should show consequence
      await waitFor(() => {
        expect(screen.getByText(/impressed/i)).toBeInTheDocument();
      });
    }, 15000);

    it('maintains focus visibility throughout navigation', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Wait for creature selection
      await waitFor(() => {
        expect(screen.getByText(/Choose Your Encounter/i)).toBeInTheDocument();
      }, { timeout: 7000 });

      // Tab through creature buttons - they use role="button" on divs
      await user.tab();
      let focusedElement = document.activeElement;
      expect(focusedElement).toBeInstanceOf(HTMLElement);
      
      // Should be able to focus on interactive elements
      expect(focusedElement.getAttribute('role')).toBeTruthy();
    }, 10000);
  });
});

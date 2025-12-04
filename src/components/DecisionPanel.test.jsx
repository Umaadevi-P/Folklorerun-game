import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import DecisionPanel from './DecisionPanel';

describe('DecisionPanel Component', () => {
  const mockChoices = [
    {
      text: 'Answer with cleverness',
      isCorrect: true,
      consequence: 'She nods, impressed'
    },
    {
      text: 'Answer with force',
      isCorrect: false,
      consequence: 'The hut turns away'
    }
  ];

  const mockCreature = {
    id: 'baba-yaga',
    name: 'Baba Yaga'
  };

  const mockUiConfig = {
    creatures: {
      'baba-yaga': {
        primaryColor: '#FFB84D',
        secondaryColor: '#FF8C42'
      }
    }
  };

  let mockOnChoice;
  let mockPlaySoundCue;

  beforeEach(() => {
    mockOnChoice = vi.fn();
    mockPlaySoundCue = vi.fn();
  });

  // Requirement 3.1: Display two choice buttons with text
  it('should display two choice buttons', () => {
    render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    expect(screen.getByText('Answer with cleverness')).toBeInTheDocument();
    expect(screen.getByText('Answer with force')).toBeInTheDocument();
  });

  // Requirement 3.1: Add click handlers to trigger choice selection
  it('should trigger onChoice callback when a choice is clicked', async () => {
    render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    const firstChoice = screen.getByText('Answer with cleverness');
    fireEvent.click(firstChoice);

    // Wait for the callback to be triggered (after consequence display)
    await waitFor(() => {
      expect(mockOnChoice).toHaveBeenCalledWith(0);
    }, { timeout: 3000 });
  });

  // Requirement 4.1: Display consequence text within 200ms of selection
  it('should display consequence text within 200ms of selection', async () => {
    render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    const firstChoice = screen.getByText('Answer with cleverness');
    const startTime = Date.now();
    fireEvent.click(firstChoice);

    await waitFor(() => {
      const consequenceText = screen.getByText('She nods, impressed');
      expect(consequenceText).toBeInTheDocument();
      const elapsedTime = Date.now() - startTime;
      expect(elapsedTime).toBeLessThan(200);
    });
  });

  // Requirement 7.2: Keyboard navigation (Enter key)
  it('should allow selection via Enter key', async () => {
    render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    const firstChoice = screen.getByLabelText('Choice 1: Answer with cleverness');
    firstChoice.focus();
    fireEvent.keyDown(firstChoice, { key: 'Enter' });

    await waitFor(() => {
      expect(mockOnChoice).toHaveBeenCalledWith(0);
    }, { timeout: 3000 });
  });

  // Requirement 7.2: Keyboard navigation (Space key)
  it('should allow selection via Space key', async () => {
    render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    const secondChoice = screen.getByLabelText('Choice 2: Answer with force');
    secondChoice.focus();
    fireEvent.keyDown(secondChoice, { key: ' ' });

    await waitFor(() => {
      expect(mockOnChoice).toHaveBeenCalledWith(1);
    }, { timeout: 3000 });
  });

  // Requirement 7.4: ARIA labels for screen readers
  it('should include ARIA labels for accessibility', () => {
    render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    expect(screen.getByLabelText('Choice 1: Answer with cleverness')).toBeInTheDocument();
    expect(screen.getByLabelText('Choice 2: Answer with force')).toBeInTheDocument();
  });

  // Requirement 7.1: Tab navigation support
  it('should support tab navigation through choices', () => {
    render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    const firstChoice = screen.getByLabelText('Choice 1: Answer with cleverness');
    const secondChoice = screen.getByLabelText('Choice 2: Answer with force');

    expect(firstChoice).toHaveAttribute('tabIndex', '0');
    expect(secondChoice).toHaveAttribute('tabIndex', '0');
  });

  // Test disabled state
  it('should not allow interaction when disabled', () => {
    render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        disabled={true}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    const firstChoice = screen.getByText('Answer with cleverness');
    fireEvent.click(firstChoice);

    expect(mockOnChoice).not.toHaveBeenCalled();
  });

  // Test creature-specific theming
  it('should apply creature-specific theming', () => {
    const { container } = render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    const panel = container.querySelector('.decision-panel');
    expect(panel).toHaveStyle({
      '--creature-primary': '#FFB84D',
      '--creature-secondary': '#FF8C42'
    });
  });

  // Test correct choice UI reaction
  it('should show correct UI reaction for correct choice', async () => {
    render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    const correctChoice = screen.getByText('Answer with cleverness');
    fireEvent.click(correctChoice);

    await waitFor(() => {
      const consequence = screen.getByText('She nods, impressed').closest('.consequence-display');
      expect(consequence).toHaveClass('correct');
    });
  });

  // Test incorrect choice UI reaction
  it('should show incorrect UI reaction for incorrect choice', async () => {
    render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    const incorrectChoice = screen.getByText('Answer with force');
    fireEvent.click(incorrectChoice);

    await waitFor(() => {
      const consequence = screen.getByText('The hut turns away').closest('.consequence-display');
      expect(consequence).toHaveClass('incorrect');
    });
  });

  // Test that choices cannot be changed after selection
  it('should prevent selecting another choice after one is selected', async () => {
    render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={mockCreature}
        uiConfig={mockUiConfig}
        playSoundCue={mockPlaySoundCue}
      />
    );

    const firstChoice = screen.getByText('Answer with cleverness');
    const secondChoice = screen.getByText('Answer with force');

    fireEvent.click(firstChoice);

    // Try to click the second choice
    fireEvent.click(secondChoice);

    // Should only be called once with the first choice
    await waitFor(() => {
      expect(mockOnChoice).toHaveBeenCalledTimes(1);
      expect(mockOnChoice).toHaveBeenCalledWith(0);
    }, { timeout: 3000 });
  });

  // Test fallback colors when no creature config
  it('should use fallback colors when creature config is missing', () => {
    const { container } = render(
      <DecisionPanel
        choices={mockChoices}
        onChoice={mockOnChoice}
        creature={null}
        uiConfig={null}
        playSoundCue={mockPlaySoundCue}
      />
    );

    const panel = container.querySelector('.decision-panel');
    expect(panel).toHaveStyle({
      '--creature-primary': '#ffffff',
      '--creature-secondary': '#cccccc'
    });
  });
});

/**
 * Property-Based Tests for DecisionPanel Component
 * 
 * These tests verify correctness properties across all valid component states
 * using fast-check for property-based testing with 100+ iterations.
 */
describe('DecisionPanel - Property-Based Tests', () => {
  
  /**
   * Feature: folklorerun-game, Property 7: UI reactions match choice correctness
   * Validates: Requirements 4.2, 4.3
   * 
   * Property: For any choice selection, if the choice is correct, positive UI reactions
   * should trigger (correct class with pulse animation); if incorrect, negative UI reactions
   * should trigger (incorrect class with shake animation).
   */
  it('property: UI reactions match choice correctness', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate: choice index (0 or 1), choice correctness, consequence text
        fc.record({
          choiceIndex: fc.integer({ min: 0, max: 1 }),
          isCorrect: fc.boolean(),
          // Generate alphanumeric strings to avoid special characters and whitespace issues
          consequenceText: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/),
          choiceText: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/)
        }),
        async ({ choiceIndex, isCorrect, consequenceText, choiceText }) => {
          // Ensure texts are not just whitespace
          const trimmedConsequence = consequenceText.trim();
          const trimmedChoice = choiceText.trim();
          
          // Skip if either text is empty after trimming
          fc.pre(trimmedConsequence.length > 0 && trimmedChoice.length > 0);
          
          // Generate two choices where one is at choiceIndex with specified correctness
          const choices = [
            {
              text: choiceIndex === 0 ? trimmedChoice : 'Other choice',
              isCorrect: choiceIndex === 0 ? isCorrect : !isCorrect,
              consequence: choiceIndex === 0 ? trimmedConsequence : 'Other consequence'
            },
            {
              text: choiceIndex === 1 ? trimmedChoice : 'Another choice',
              isCorrect: choiceIndex === 1 ? isCorrect : !isCorrect,
              consequence: choiceIndex === 1 ? trimmedConsequence : 'Another consequence'
            }
          ];

          const mockCreature = {
            id: 'test-creature',
            name: 'Test Creature'
          };

          const mockUiConfig = {
            creatures: {
              'test-creature': {
                primaryColor: '#FFB84D',
                secondaryColor: '#FF8C42'
              }
            }
          };

          const mockOnChoice = vi.fn();
          const mockPlaySoundCue = vi.fn();

          // Render the component with cleanup
          const { unmount } = render(
            <DecisionPanel
              choices={choices}
              onChoice={mockOnChoice}
              creature={mockCreature}
              uiConfig={mockUiConfig}
              playSoundCue={mockPlaySoundCue}
            />
          );

          try {
            // Get all choice buttons and select by index
            const choiceButtons = screen.getAllByRole('button');
            const choiceButton = choiceButtons[choiceIndex];
            
            // Click the choice
            fireEvent.click(choiceButton);

            // Wait for the consequence display to appear
            await waitFor(() => {
              const consequenceDisplay = screen.getByRole('status');
              expect(consequenceDisplay).toBeInTheDocument();
              
              // Property verification: UI reaction should match choice correctness
              if (isCorrect) {
                // Requirement 4.2: Correct choice should trigger positive UI reaction
                expect(consequenceDisplay).toHaveClass('correct');
                expect(consequenceDisplay).not.toHaveClass('incorrect');
              } else {
                // Requirement 4.3: Incorrect choice should trigger negative UI reaction
                expect(consequenceDisplay).toHaveClass('incorrect');
                expect(consequenceDisplay).not.toHaveClass('correct');
              }
            }, { timeout: 250 });

            return true;
          } finally {
            // Clean up after each test run
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 30000); // 30 second timeout for 100 runs

  /**
   * Feature: folklorerun-game, Property 6: Choice feedback displays within time constraint
   * Validates: Requirements 4.1
   * 
   * Property: For any choice selection, the consequence text should appear
   * within 200 milliseconds of the selection event.
   */
  it('property: choice feedback displays within time constraint', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate: choice index (0 or 1), choice correctness, consequence text
        fc.record({
          choiceIndex: fc.integer({ min: 0, max: 1 }),
          isCorrect: fc.boolean(),
          // Generate alphanumeric strings to avoid special characters and whitespace issues
          consequenceText: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/),
          choiceText: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/)
        }),
        async ({ choiceIndex, isCorrect, consequenceText, choiceText }) => {
          // Ensure texts are not just whitespace
          const trimmedConsequence = consequenceText.trim();
          const trimmedChoice = choiceText.trim();
          
          // Skip if either text is empty after trimming
          fc.pre(trimmedConsequence.length > 0 && trimmedChoice.length > 0);
          
          // Generate two choices where one is at choiceIndex
          const choices = [
            {
              text: choiceIndex === 0 ? trimmedChoice : 'Other choice',
              isCorrect: choiceIndex === 0 ? isCorrect : !isCorrect,
              consequence: choiceIndex === 0 ? trimmedConsequence : 'Other consequence'
            },
            {
              text: choiceIndex === 1 ? trimmedChoice : 'Another choice',
              isCorrect: choiceIndex === 1 ? isCorrect : !isCorrect,
              consequence: choiceIndex === 1 ? trimmedConsequence : 'Another consequence'
            }
          ];

          const mockCreature = {
            id: 'test-creature',
            name: 'Test Creature'
          };

          const mockUiConfig = {
            creatures: {
              'test-creature': {
                primaryColor: '#FFB84D',
                secondaryColor: '#FF8C42'
              }
            }
          };

          const mockOnChoice = vi.fn();
          const mockPlaySoundCue = vi.fn();

          // Render the component with cleanup
          const { unmount } = render(
            <DecisionPanel
              choices={choices}
              onChoice={mockOnChoice}
              creature={mockCreature}
              uiConfig={mockUiConfig}
              playSoundCue={mockPlaySoundCue}
            />
          );

          try {
            // Get all choice buttons and select by index (most reliable approach)
            const choiceButtons = screen.getAllByRole('button');
            const choiceButton = choiceButtons[choiceIndex];
            
            // Record the start time
            const startTime = Date.now();
            
            // Click the choice
            fireEvent.click(choiceButton);

            // Wait for the consequence text to appear and measure the time
            await waitFor(() => {
              // Query by role to find the consequence display
              const consequenceDisplay = screen.getByRole('status');
              expect(consequenceDisplay).toBeInTheDocument();
              
              // Verify the consequence text is present (trim to handle whitespace variations)
              const consequenceText = consequenceDisplay.textContent.trim();
              const expectedText = choices[choiceIndex].consequence.trim();
              expect(consequenceText).toBe(expectedText);
              
              // Property verification: consequence should appear within 200ms
              const elapsedTime = Date.now() - startTime;
              expect(elapsedTime).toBeLessThan(200);
            }, { timeout: 250 }); // Give a bit more than 200ms for the test itself

            return true;
          } finally {
            // Clean up after each test run
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 30000); // 30 second timeout for 100 runs
});

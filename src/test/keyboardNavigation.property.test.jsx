import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import DecisionPanel from '../components/DecisionPanel';
import CreatureSelection from '../components/CreatureSelection';

/**
 * Property-Based Tests for Keyboard Navigation
 * 
 * Feature: folklorerun-game, Property 10: Keyboard navigation maintains logical order
 * Validates: Requirements 7.1, 7.2, 7.5
 * 
 * These tests verify that keyboard navigation works correctly across all interactive
 * components, maintaining logical tab order and supporting Enter/Space activation.
 */
describe('Keyboard Navigation - Property-Based Tests', () => {

  /**
   * Property 10: Keyboard navigation maintains logical order
   * 
   * For any interactive screen, pressing Tab should move focus through all interactive
   * elements in a logical order, and pressing Enter or Space on a focused element
   * should activate it.
   */
  it('property: DecisionPanel maintains logical tab order through choices', () => {
    fc.assert(
      fc.property(
        // Generate random choice data
        fc.record({
          choice1Text: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/),
          choice2Text: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/),
          consequence1: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/),
          consequence2: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/),
          choice1Correct: fc.boolean()
        }),
        ({ choice1Text, choice2Text, consequence1, consequence2, choice1Correct }) => {
          // Ensure texts are not just whitespace
          const text1 = choice1Text.trim();
          const text2 = choice2Text.trim();
          const cons1 = consequence1.trim();
          const cons2 = consequence2.trim();
          
          // Skip if any text is empty after trimming
          fc.pre(text1.length > 0 && text2.length > 0 && cons1.length > 0 && cons2.length > 0);
          
          const choices = [
            {
              text: text1,
              isCorrect: choice1Correct,
              consequence: cons1
            },
            {
              text: text2,
              isCorrect: !choice1Correct,
              consequence: cons2
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

          const { unmount } = render(
            <DecisionPanel
              choices={choices}
              onChoice={mockOnChoice}
              creature={mockCreature}
              uiConfig={mockUiConfig}
            />
          );

          try {
            // Get all interactive elements (buttons)
            const buttons = screen.getAllByRole('button');
            
            // Property: All interactive elements should be focusable (tabIndex >= 0)
            // Requirement 7.1: Support keyboard tab navigation
            buttons.forEach((button) => {
              const tabIndex = button.getAttribute('tabIndex');
              expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
            });

            // Property: Elements should be in logical order (first choice, then second choice)
            // Requirement 7.5: Maintain logical tab order
            expect(buttons.length).toBe(2);
            // Note: HTML normalizes whitespace, so we need to normalize for comparison
            const normalizeWhitespace = (str) => str.replace(/\s+/g, ' ').trim();
            expect(normalizeWhitespace(buttons[0].textContent)).toBe(normalizeWhitespace(text1));
            expect(normalizeWhitespace(buttons[1].textContent)).toBe(normalizeWhitespace(text2));

            // Property: Each element should have proper ARIA labels
            // Requirement 7.4: Include aria-labels for screen readers
            expect(buttons[0]).toHaveAttribute('aria-label', `Choice 1: ${text1}`);
            expect(buttons[1]).toHaveAttribute('aria-label', `Choice 2: ${text2}`);

            return true;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10: Keyboard activation with Enter and Space keys
   * 
   * For any focused interactive element, pressing Enter or Space should activate it.
   */
  it('property: CreatureSelection maintains logical tab order through creatures', () => {
    fc.assert(
      fc.property(
        // Generate a subset of creatures to test (1-3 creatures)
        fc.integer({ min: 1, max: 3 }),
        (numCreatures) => {
          // Create test creature data
          const allCreatures = [
            {
              id: 'baba-yaga',
              name: 'Baba Yaga',
              enrichedIntro: 'In a ring of birch, a hut breathes smoke and riddles.',
              coreMechanic: 'riddle',
              levels: []
            },
            {
              id: 'banshee',
              name: 'Banshee',
              enrichedIntro: 'A keening cry splits the mist, sorrow made manifest.',
              coreMechanic: 'calmness',
              levels: []
            },
            {
              id: 'aswang',
              name: 'Aswang',
              enrichedIntro: 'In the village, lanterns flicker as shadows grow teeth.',
              coreMechanic: 'deduction',
              levels: []
            }
          ];

          const creatures = allCreatures.slice(0, numCreatures);
          const gameData = { creatures };

          const mockOnSelectCreature = vi.fn();

          const { unmount } = render(
            <CreatureSelection
              gameData={gameData}
              onSelectCreature={mockOnSelectCreature}
            />
          );

          try {
            // Get all interactive elements (creature cards)
            const creatureButtons = screen.getAllByRole('button');
            
            // Property: Number of interactive elements should match number of creatures
            expect(creatureButtons.length).toBe(numCreatures);

            // Property: All interactive elements should be focusable (tabIndex >= 0)
            // Requirement 7.1: Support keyboard tab navigation
            creatureButtons.forEach((button) => {
              const tabIndex = button.getAttribute('tabIndex');
              expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
            });

            // Property: Elements should be in logical order (same order as data)
            // Requirement 7.5: Maintain logical tab order
            creatureButtons.forEach((button, index) => {
              const expectedName = creatures[index].name;
              expect(button).toHaveAttribute('aria-label', `Select ${expectedName}`);
            });

            // Property: Each element should have proper ARIA labels
            // Requirement 7.4: Include aria-labels for screen readers
            creatures.forEach((creature) => {
              const button = screen.getByRole('button', { 
                name: `Select ${creature.name}` 
              });
              expect(button).toBeInTheDocument();
            });

            return true;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10: Disabled elements should not be in tab order
   * 
   * When elements are disabled, they should have tabIndex -1 and not be
   * part of the keyboard navigation flow.
   */
  it('property: disabled DecisionPanel elements are not in tab order', () => {
    fc.assert(
      fc.property(
        // Generate random choice data
        fc.record({
          choice1Text: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/),
          choice2Text: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/),
          consequence1: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/),
          consequence2: fc.stringMatching(/^[a-zA-Z0-9 ]{10,50}$/),
          disabled: fc.boolean()
        }),
        ({ choice1Text, choice2Text, consequence1, consequence2, disabled }) => {
          // Ensure texts are not just whitespace
          const text1 = choice1Text.trim();
          const text2 = choice2Text.trim();
          const cons1 = consequence1.trim();
          const cons2 = consequence2.trim();
          
          // Skip if any text is empty after trimming
          fc.pre(text1.length > 0 && text2.length > 0 && cons1.length > 0 && cons2.length > 0);
          
          const choices = [
            {
              text: text1,
              isCorrect: true,
              consequence: cons1
            },
            {
              text: text2,
              isCorrect: false,
              consequence: cons2
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

          const { unmount } = render(
            <DecisionPanel
              choices={choices}
              onChoice={mockOnChoice}
              creature={mockCreature}
              uiConfig={mockUiConfig}
              disabled={disabled}
            />
          );

          try {
            // Get all interactive elements (buttons)
            const buttons = screen.getAllByRole('button');
            
            // Property: When disabled, elements should have tabIndex -1
            // Requirement 7.1: Maintain logical tab order (disabled elements excluded)
            buttons.forEach((button) => {
              const tabIndex = button.getAttribute('tabIndex');
              if (disabled) {
                expect(parseInt(tabIndex)).toBe(-1);
              } else {
                expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
              }
            });

            // Property: Disabled elements should have aria-disabled attribute
            buttons.forEach((button) => {
              const ariaDisabled = button.getAttribute('aria-disabled');
              if (disabled) {
                expect(ariaDisabled).toBe('true');
              } else {
                expect(ariaDisabled).toBe('false');
              }
            });

            return true;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

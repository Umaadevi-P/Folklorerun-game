import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import Inventory from '../components/Inventory';

/**
 * Property-Based Tests for Mechanic Indicator Updates
 * 
 * Feature: folklorerun-game, Property 16: Mechanic interactions update indicators immediately
 * Validates: Requirements 6.5
 * 
 * These tests verify that creature-specific mechanic interactions (riddle hints,
 * calmness meter, token collection) update visual indicators immediately without delay.
 */
describe('Mechanic Indicator Updates - Property-Based Tests', () => {

  const mockUIConfig = {
    creatures: {
      'baba-yaga': {
        primaryColor: '#FFB84D',
        secondaryColor: '#FF8C42'
      },
      'banshee': {
        primaryColor: '#B8D4E8',
        secondaryColor: '#7BA8C7'
      },
      'aswang': {
        primaryColor: '#D32F2F',
        secondaryColor: '#8B0000'
      }
    }
  };

  /**
   * Property 16: Banshee calmness meter updates immediately
   * 
   * For any calmness level change, the visual indicator (meter fill, percentage,
   * mood text) should update immediately to reflect the new state.
   */
  it('property: Banshee calmness meter updates immediately for any calmness level', () => {
    fc.assert(
      fc.property(
        // Generate random calmness levels (0-100)
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (initialCalmness, newCalmness) => {
          const bansheeCreature = {
            id: 'banshee',
            name: 'Banshee',
            coreMechanic: 'calmness'
          };

          const onMechanicUpdate = vi.fn();

          // Render with initial calmness level
          const { rerender, unmount, container } = render(
            <Inventory
              creature={bansheeCreature}
              mechanicState={{ calmnessLevel: initialCalmness }}
              onMechanicUpdate={onMechanicUpdate}
              levelData={null}
              uiConfig={mockUIConfig}
            />
          );

          try {
            // Verify initial state is displayed
            expect(screen.getByText(`${initialCalmness}%`)).toBeInTheDocument();
            
            // Verify initial mood indicator (use class selector to be specific)
            const initialMood = initialCalmness >= 60 ? 'Peaceful' : 
                               initialCalmness >= 30 ? 'Sorrowful' : 'Anguished';
            const initialMoodElement = container.querySelector('.mood-indicator');
            expect(initialMoodElement).toHaveTextContent(initialMood);

            // Update to new calmness level
            rerender(
              <Inventory
                creature={bansheeCreature}
                mechanicState={{ calmnessLevel: newCalmness }}
                onMechanicUpdate={onMechanicUpdate}
                levelData={null}
                uiConfig={mockUIConfig}
              />
            );

            // Property: Indicator should update immediately (no delay)
            // Requirement 6.5: Update visual indicators immediately
            expect(screen.getByText(`${newCalmness}%`)).toBeInTheDocument();
            
            // Verify mood indicator updates correctly (use class selector to be specific)
            const newMood = newCalmness >= 60 ? 'Peaceful' : 
                           newCalmness >= 30 ? 'Sorrowful' : 'Anguished';
            const newMoodElement = container.querySelector('.mood-indicator');
            expect(newMoodElement).toHaveTextContent(newMood);

            // Verify meter has correct aria attributes
            const meter = screen.getByRole('meter');
            expect(meter).toHaveAttribute('aria-valuenow', newCalmness.toString());

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
   * Property 16: Aswang token collection updates immediately
   * 
   * For any token collection/removal, the visual indicators (token count,
   * collected state, combination status) should update immediately.
   */
  it('property: Aswang token collection updates indicators immediately', () => {
    fc.assert(
      fc.property(
        // Generate random token collection states
        fc.array(
          fc.constantFrom(
            'reversed-reflection',
            'no-shadow',
            'salt-reaction',
            'garlic-aversion',
            'extended-tongue',
            'leathery-wings'
          ),
          { minLength: 0, maxLength: 6 }
        ).map(arr => [...new Set(arr)]), // Remove duplicates
        (tokensCollected) => {
          const aswangCreature = {
            id: 'aswang',
            name: 'Aswang',
            coreMechanic: 'deduction'
          };

          const onMechanicUpdate = vi.fn();

          const { unmount } = render(
            <Inventory
              creature={aswangCreature}
              mechanicState={{ tokensCollected }}
              onMechanicUpdate={onMechanicUpdate}
              levelData={null}
              uiConfig={mockUIConfig}
            />
          );

          try {
            // Property: Token count should be displayed immediately
            // Requirement 6.5: Update visual indicators immediately
            const expectedCount = tokensCollected.length;
            expect(screen.getByText(`${expectedCount} / 6 clues`)).toBeInTheDocument();

            // Property: Each collected token should show as collected
            const allTokens = [
              'reversed-reflection',
              'no-shadow',
              'salt-reaction',
              'garlic-aversion',
              'extended-tongue',
              'leathery-wings'
            ];

            allTokens.forEach(tokenId => {
              const tokenButton = screen.getByLabelText(new RegExp(tokenId.split('-').map(
                word => word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' '), 'i'));
              
              const isCollected = tokensCollected.includes(tokenId);
              expect(tokenButton).toHaveAttribute('aria-pressed', isCollected.toString());
              
              if (isCollected) {
                expect(tokenButton).toHaveClass('collected');
              }
            });

            // Property: Combination validation status should be displayed immediately
            // Valid combinations: [reversed-reflection, no-shadow], [salt-reaction, garlic-aversion], [extended-tongue, leathery-wings]
            if (tokensCollected.length >= 2) {
              const hasValidCombo = 
                (tokensCollected.includes('reversed-reflection') && tokensCollected.includes('no-shadow')) ||
                (tokensCollected.includes('salt-reaction') && tokensCollected.includes('garlic-aversion')) ||
                (tokensCollected.includes('extended-tongue') && tokensCollected.includes('leathery-wings'));

              if (hasValidCombo) {
                expect(screen.getByText(/Valid combination/i)).toBeInTheDocument();
              } else {
                expect(screen.getByText(/Keep searching/i)).toBeInTheDocument();
              }
            }

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
   * Property 16: Aswang token click triggers immediate callback
   * 
   * For any token click, the onMechanicUpdate callback should be called
   * immediately with the updated token collection.
   */
  it('property: Aswang token click triggers immediate update callback', () => {
    fc.assert(
      fc.property(
        // Generate random initial token state and a token to click
        fc.array(
          fc.constantFrom(
            'reversed-reflection',
            'no-shadow',
            'salt-reaction',
            'garlic-aversion',
            'extended-tongue',
            'leathery-wings'
          ),
          { minLength: 0, maxLength: 5 }
        ).map(arr => [...new Set(arr)]),
        fc.constantFrom(
          'reversed-reflection',
          'no-shadow',
          'salt-reaction',
          'garlic-aversion',
          'extended-tongue',
          'leathery-wings'
        ),
        (initialTokens, tokenToClick) => {
          const aswangCreature = {
            id: 'aswang',
            name: 'Aswang',
            coreMechanic: 'deduction'
          };

          const onMechanicUpdate = vi.fn();

          const { unmount } = render(
            <Inventory
              creature={aswangCreature}
              mechanicState={{ tokensCollected: initialTokens }}
              onMechanicUpdate={onMechanicUpdate}
              levelData={null}
              uiConfig={mockUIConfig}
            />
          );

          try {
            // Find and click the token
            const tokenName = tokenToClick.split('-').map(
              word => word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            const tokenButton = screen.getByLabelText(new RegExp(tokenName, 'i'));
            
            fireEvent.click(tokenButton);

            // Property: Callback should be called immediately
            // Requirement 6.5: Update visual indicators immediately
            expect(onMechanicUpdate).toHaveBeenCalledTimes(1);

            // Property: Callback should receive correct updated token list
            const wasCollected = initialTokens.includes(tokenToClick);
            const expectedTokens = wasCollected
              ? initialTokens.filter(id => id !== tokenToClick)
              : [...initialTokens, tokenToClick];

            expect(onMechanicUpdate).toHaveBeenCalledWith({
              tokensCollected: expectedTokens
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
   * Property 16: Baba Yaga hints counter updates immediately
   * 
   * For any hints revealed count, the counter should display the correct
   * value immediately.
   */
  it('property: Baba Yaga hints counter displays immediately for any count', () => {
    fc.assert(
      fc.property(
        // Generate random hints revealed count (0-10)
        fc.integer({ min: 0, max: 10 }),
        (hintsRevealed) => {
          const babaYagaCreature = {
            id: 'baba-yaga',
            name: 'Baba Yaga',
            coreMechanic: 'riddle'
          };

          const riddleLevelData = {
            riddleData: {
              riddle: 'What walks on four legs at dawn?',
              hint: 'Think of life stages',
              answerKey: 'human'
            }
          };

          const onMechanicUpdate = vi.fn();

          const { unmount } = render(
            <Inventory
              creature={babaYagaCreature}
              mechanicState={{ hintsRevealed }}
              onMechanicUpdate={onMechanicUpdate}
              levelData={riddleLevelData}
              uiConfig={mockUIConfig}
            />
          );

          try {
            // Property: Hints counter should display immediately
            // Requirement 6.5: Update visual indicators immediately
            expect(screen.getByText(`Hints revealed: ${hintsRevealed}`)).toBeInTheDocument();

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
   * Property 16: Baba Yaga hint reveal triggers immediate callback
   * 
   * For any incorrect riddle answer (when hint not yet shown), the hint should
   * be revealed and the callback should be triggered with updated hint count.
   * 
   * Note: This test verifies the callback is triggered after the 500ms delay
   * for hint reveal, which is an implementation detail. The "immediate" update
   * refers to the visual indicator (hint text) appearing without additional delay.
   */
  it('property: Baba Yaga incorrect answer triggers hint reveal callback', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random initial hints count
        fc.integer({ min: 0, max: 5 }),
        async (initialHints) => {
          const babaYagaCreature = {
            id: 'baba-yaga',
            name: 'Baba Yaga',
            coreMechanic: 'riddle'
          };

          const riddleLevelData = {
            riddleData: {
              riddle: 'What walks on four legs at dawn?',
              hint: 'Think of life stages',
              answerKey: 'human'
            }
          };

          const onMechanicUpdate = vi.fn();

          const { unmount, container } = render(
            <Inventory
              creature={babaYagaCreature}
              mechanicState={{ hintsRevealed: initialHints }}
              onMechanicUpdate={onMechanicUpdate}
              levelData={riddleLevelData}
              uiConfig={mockUIConfig}
            />
          );

          try {
            // Use container.querySelector to avoid multiple element issues
            const input = container.querySelector('input[placeholder="Speak your answer..."]');
            const submitButton = container.querySelector('button[type="submit"]');

            // Submit wrong answer
            fireEvent.change(input, { target: { value: 'wronganswer' } });
            fireEvent.click(submitButton);

            // Wait for hint to be revealed (has 500ms delay in implementation)
            await waitFor(() => {
              expect(onMechanicUpdate).toHaveBeenCalled();
            }, { timeout: 1500 });

            // Property: Callback should be called with incremented hint count
            // Requirement 6.5: Update visual indicators immediately (after hint reveal)
            expect(onMechanicUpdate).toHaveBeenCalledWith({
              hintsRevealed: initialHints + 1
            });

            return true;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20 }
    );
  }, 30000); // Increase timeout to 30 seconds for 20 async runs

  /**
   * Property 16: Calmness meter visual fill matches percentage
   * 
   * For any calmness level, the meter fill width should match the percentage value.
   */
  it('property: Banshee calmness meter fill width matches percentage', () => {
    fc.assert(
      fc.property(
        // Generate random calmness levels including edge cases
        fc.integer({ min: -10, max: 110 }),
        (rawCalmness) => {
          const bansheeCreature = {
            id: 'banshee',
            name: 'Banshee',
            coreMechanic: 'calmness'
          };

          const onMechanicUpdate = vi.fn();

          const { container, unmount } = render(
            <Inventory
              creature={bansheeCreature}
              mechanicState={{ calmnessLevel: rawCalmness }}
              onMechanicUpdate={onMechanicUpdate}
              levelData={null}
              uiConfig={mockUIConfig}
            />
          );

          try {
            // Property: Calmness should be clamped to 0-100 range
            // Requirement 6.4: Validate inputs against creature-specific rules
            const expectedCalmness = Math.max(0, Math.min(100, rawCalmness));
            
            // Property: Displayed percentage should match clamped value
            // Requirement 6.5: Update visual indicators immediately
            expect(screen.getByText(`${expectedCalmness}%`)).toBeInTheDocument();

            // Property: Meter fill width should match percentage
            const meterFill = container.querySelector('.meter-fill');
            expect(meterFill).toHaveStyle({ width: `${expectedCalmness}%` });

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

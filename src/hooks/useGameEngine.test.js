import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import useGameEngine from './useGameEngine';
import { fallbackCreatureData } from '../fallbackData';

/**
 * Property-Based Tests for useGameEngine Hook
 * 
 * These tests verify correctness properties across all valid game states
 * using fast-check for property-based testing with 100+ iterations.
 */

describe('useGameEngine - Property-Based Tests', () => {
  
  /**
   * Feature: folklorerun-game, Property 3: Level progression maintains sequence
   * Validates: Requirements 3.3
   * 
   * Property: For any level completion, if the current level is less than 2,
   * the system should increment to the next level; if the current level is 2,
   * the system should transition to the end state.
   */
  it('property: level progression maintains sequence', async () => {
    // Mock timers to avoid waiting for real delays
    vi.useFakeTimers();
    
    await fc.assert(
      fc.asyncProperty(
        // Generate: creature index (0-2), starting level (0-2)
        fc.record({
          creatureIndex: fc.integer({ min: 0, max: 2 }),
          startLevel: fc.integer({ min: 0, max: 2 })
        }),
        async ({ creatureIndex, startLevel }) => {
          // Setup: Create hook with fallback data
          const { result } = renderHook(() => useGameEngine(fallbackCreatureData));
          
          // Select a creature
          const creature = fallbackCreatureData.creatures[creatureIndex];
          act(() => {
            result.current.selectCreature(creature.id);
          });
          
          // Complete animation sequence to reach level phase
          act(() => {
            result.current.completeEntranceAnimation();
          });
          act(() => {
            result.current.completeCloseUpAnimation();
          });
          
          // Complete story bubbles to reach level phase
          const totalBubbles = creature.id === 'aswang' ? 5 : 4;
          for (let i = 0; i < totalBubbles; i++) {
            act(() => {
              result.current.advanceStoryBubble();
            });
          }
          
          // Progress through levels to reach startLevel
          for (let i = 0; i < startLevel; i++) {
            const levelData = creature.levels[i];
            // Find a correct choice to progress
            const correctChoiceIndex = levelData.choices.findIndex(c => c.isCorrect);
            
            act(() => {
              result.current.makeChoice(correctChoiceIndex);
            });
            
            // Fast-forward through the 2 second delay
            await act(async () => {
              vi.advanceTimersByTime(2000);
            });
          }
          
          // Now we're at startLevel, verify it
          expect(result.current.currentLevel).toBe(startLevel);
          expect(result.current.gameState).toBe('level');
          
          // Get the level data and find a correct choice
          const currentLevelData = creature.levels[startLevel];
          const correctChoiceIndex = currentLevelData.choices.findIndex(c => c.isCorrect);
          
          // Make the correct choice
          act(() => {
            result.current.makeChoice(correctChoiceIndex);
          });
          
          // Property verification:
          // If startLevel < 2, should progress to next level
          // If startLevel === 2, should transition to end state with victory
          if (startLevel < 2) {
            // Should progress to next level after delay
            await act(async () => {
              vi.advanceTimersByTime(2000);
            });
            
            expect(result.current.currentLevel).toBe(startLevel + 1);
            expect(result.current.gameState).toBe('level');
            expect(result.current.outcome).toBeNull();
          } else {
            // startLevel === 2, should transition to end state immediately
            expect(result.current.gameState).toBe('end');
            expect(result.current.outcome).toBe('victory');
            expect(result.current.currentLevel).toBe(2); // Level doesn't increment past 2
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
    
    vi.useRealTimers();
  }, 30000); // 30 second timeout for 100 runs

  /**
   * Feature: folklorerun-game, Property 4: Correct choices lead to progression
   * Validates: Requirements 3.4
   * 
   * Property: For any level with two choices, selecting the choice marked as
   * isCorrect: true should advance the player to the next level or victory screen.
   */
  it('property: correct choices lead to progression', async () => {
    // Mock timers to avoid waiting for real delays
    vi.useFakeTimers();
    
    await fc.assert(
      fc.asyncProperty(
        // Generate: creature index (0-2), level to test (0-2)
        fc.record({
          creatureIndex: fc.integer({ min: 0, max: 2 }),
          levelToTest: fc.integer({ min: 0, max: 2 })
        }),
        async ({ creatureIndex, levelToTest }) => {
          // Setup: Create hook with fallback data
          const { result } = renderHook(() => useGameEngine(fallbackCreatureData));
          
          // Select a creature
          const creature = fallbackCreatureData.creatures[creatureIndex];
          act(() => {
            result.current.selectCreature(creature.id);
          });
          
          // Complete animation sequence to reach level phase
          act(() => {
            result.current.completeEntranceAnimation();
          });
          act(() => {
            result.current.completeCloseUpAnimation();
          });
          
          // Complete story bubbles to reach level phase
          const totalBubbles = creature.id === 'aswang' ? 5 : 4;
          for (let i = 0; i < totalBubbles; i++) {
            act(() => {
              result.current.advanceStoryBubble();
            });
          }
          
          // Progress through levels to reach levelToTest
          for (let i = 0; i < levelToTest; i++) {
            const levelData = creature.levels[i];
            const correctChoiceIndex = levelData.choices.findIndex(c => c.isCorrect);
            
            act(() => {
              result.current.makeChoice(correctChoiceIndex);
            });
            
            // Fast-forward through the 2 second delay
            await act(async () => {
              vi.advanceTimersByTime(2000);
            });
          }
          
          // Now we're at levelToTest, verify state before making choice
          expect(result.current.currentLevel).toBe(levelToTest);
          expect(result.current.gameState).toBe('level');
          expect(result.current.outcome).toBeNull();
          
          // Get the level data and find the correct choice
          const currentLevelData = creature.levels[levelToTest];
          const correctChoiceIndex = currentLevelData.choices.findIndex(c => c.isCorrect);
          
          // Verify that we actually have a correct choice
          expect(correctChoiceIndex).toBeGreaterThanOrEqual(0);
          expect(currentLevelData.choices[correctChoiceIndex].isCorrect).toBe(true);
          
          // Make the correct choice
          act(() => {
            result.current.makeChoice(correctChoiceIndex);
          });
          
          // Property verification:
          // Correct choice should lead to progression
          if (levelToTest < 2) {
            // Should progress to next level after delay
            await act(async () => {
              vi.advanceTimersByTime(2000);
            });
            
            // Verify progression to next level
            expect(result.current.currentLevel).toBe(levelToTest + 1);
            expect(result.current.gameState).toBe('level');
            expect(result.current.outcome).toBeNull();
          } else {
            // levelToTest === 2 (final level), should transition to victory
            expect(result.current.gameState).toBe('end');
            expect(result.current.outcome).toBe('victory');
            expect(result.current.currentLevel).toBe(2);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
    
    vi.useRealTimers();
  }, 30000); // 30 second timeout for 100 runs

  /**
   * Feature: folklorerun-game, Property 5: Incorrect choices lead to defeat
   * Validates: Requirements 3.5
   * 
   * Property: For any level with two choices, selecting the choice marked as
   * isCorrect: false should transition the player to the defeat end screen.
   */
  it('property: incorrect choices lead to defeat', async () => {
    // Mock timers to avoid waiting for real delays
    vi.useFakeTimers();
    
    await fc.assert(
      fc.asyncProperty(
        // Generate: creature index (0-2), level to test (0-2)
        fc.record({
          creatureIndex: fc.integer({ min: 0, max: 2 }),
          levelToTest: fc.integer({ min: 0, max: 2 })
        }),
        async ({ creatureIndex, levelToTest }) => {
          // Setup: Create hook with fallback data
          const { result } = renderHook(() => useGameEngine(fallbackCreatureData));
          
          // Select a creature
          const creature = fallbackCreatureData.creatures[creatureIndex];
          act(() => {
            result.current.selectCreature(creature.id);
          });
          
          // Complete animation sequence to reach level phase
          act(() => {
            result.current.completeEntranceAnimation();
          });
          act(() => {
            result.current.completeCloseUpAnimation();
          });
          
          // Complete story bubbles to reach level phase
          const totalBubbles = creature.id === 'aswang' ? 5 : 4;
          for (let i = 0; i < totalBubbles; i++) {
            act(() => {
              result.current.advanceStoryBubble();
            });
          }
          
          // Progress through levels to reach levelToTest using correct choices
          for (let i = 0; i < levelToTest; i++) {
            const levelData = creature.levels[i];
            const correctChoiceIndex = levelData.choices.findIndex(c => c.isCorrect);
            
            act(() => {
              result.current.makeChoice(correctChoiceIndex);
            });
            
            // Fast-forward through the 2 second delay
            await act(async () => {
              vi.advanceTimersByTime(2000);
            });
          }
          
          // Now we're at levelToTest, verify state before making choice
          expect(result.current.currentLevel).toBe(levelToTest);
          expect(result.current.gameState).toBe('level');
          expect(result.current.outcome).toBeNull();
          
          // Get the level data and find the incorrect choice
          const currentLevelData = creature.levels[levelToTest];
          const incorrectChoiceIndex = currentLevelData.choices.findIndex(c => !c.isCorrect);
          
          // Verify that we actually have an incorrect choice
          expect(incorrectChoiceIndex).toBeGreaterThanOrEqual(0);
          expect(currentLevelData.choices[incorrectChoiceIndex].isCorrect).toBe(false);
          
          // Make the incorrect choice
          act(() => {
            result.current.makeChoice(incorrectChoiceIndex);
          });
          
          // Property verification:
          // Incorrect choice should immediately lead to defeat end screen
          // (no delay, unlike correct choices which have a 2 second delay)
          expect(result.current.gameState).toBe('end');
          expect(result.current.outcome).toBe('defeat');
          // Level should remain at the level where defeat occurred
          expect(result.current.currentLevel).toBe(levelToTest);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
    
    vi.useRealTimers();
  }, 30000); // 30 second timeout for 100 runs

  /**
   * Feature: folklorerun-game, Property 14: Restart resets to creature selection
   * Validates: Requirements 13.5
   * 
   * Property: For any end screen (victory or defeat), clicking the restart button
   * should reset the game state and return to the creature selection screen.
   */
  it('property: restart resets to creature selection', async () => {
    // Mock timers to avoid waiting for real delays
    vi.useFakeTimers();
    
    await fc.assert(
      fc.asyncProperty(
        // Generate: creature index (0-2), outcome type (victory or defeat)
        fc.record({
          creatureIndex: fc.integer({ min: 0, max: 2 }),
          shouldWin: fc.boolean() // true = victory path, false = defeat path
        }),
        async ({ creatureIndex, shouldWin }) => {
          // Setup: Create hook with fallback data
          const { result } = renderHook(() => useGameEngine(fallbackCreatureData));
          
          // Select a creature
          const creature = fallbackCreatureData.creatures[creatureIndex];
          act(() => {
            result.current.selectCreature(creature.id);
          });
          
          // Complete animation sequence to reach level phase
          act(() => {
            result.current.completeEntranceAnimation();
          });
          act(() => {
            result.current.completeCloseUpAnimation();
          });
          
          // Complete story bubbles to reach level phase
          const totalBubbles = creature.id === 'aswang' ? 5 : 4;
          for (let i = 0; i < totalBubbles; i++) {
            act(() => {
              result.current.advanceStoryBubble();
            });
          }
          
          // Record initial state after selection
          const initialCreatureId = result.current.selectedCreature.id;
          expect(result.current.gameState).toBe('level');
          expect(result.current.currentLevel).toBe(0);
          
          if (shouldWin) {
            // Victory path: Complete all 3 levels with correct choices
            for (let i = 0; i < 3; i++) {
              const levelData = creature.levels[i];
              const correctChoiceIndex = levelData.choices.findIndex(c => c.isCorrect);
              
              act(() => {
                result.current.makeChoice(correctChoiceIndex);
              });
              
              // Only advance time if not the final level
              if (i < 2) {
                await act(async () => {
                  vi.advanceTimersByTime(2000);
                });
              }
            }
            
            // Verify we reached victory end state
            expect(result.current.gameState).toBe('end');
            expect(result.current.outcome).toBe('victory');
          } else {
            // Defeat path: Make an incorrect choice at level 0
            const levelData = creature.levels[0];
            const incorrectChoiceIndex = levelData.choices.findIndex(c => !c.isCorrect);
            
            act(() => {
              result.current.makeChoice(incorrectChoiceIndex);
            });
            
            // Verify we reached defeat end state
            expect(result.current.gameState).toBe('end');
            expect(result.current.outcome).toBe('defeat');
          }
          
          // Now we're at an end screen (either victory or defeat)
          // Record state before restart
          const preRestartLevel = result.current.currentLevel;
          const preRestartOutcome = result.current.outcome;
          
          // Call restartGame
          act(() => {
            result.current.restartGame();
          });
          
          // Property verification:
          // After restart, game should return to creature selection screen
          expect(result.current.gameState).toBe('select');
          expect(result.current.selectedCreature).toBeNull();
          expect(result.current.currentLevel).toBe(0);
          expect(result.current.outcome).toBeNull();
          expect(result.current.consequenceText).toBe('');
          
          // Mechanic state should be reset to defaults
          expect(result.current.mechanicState).toEqual({
            hintsRevealed: 0,
            calmnessLevel: 100,
            tokensCollected: []
          });
          
          // Verify we can select a creature again after restart
          act(() => {
            result.current.selectCreature(creature.id);
          });
          
          // After selecting a creature, should be in characterReveal state
          expect(result.current.gameState).toBe('characterReveal');
          expect(result.current.selectedCreature).not.toBeNull();
          expect(result.current.selectedCreature.id).toBe(initialCreatureId);
          expect(result.current.currentLevel).toBe(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
    
    vi.useRealTimers();
  }, 30000); // 30 second timeout for 100 runs
});

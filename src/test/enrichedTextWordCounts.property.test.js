/**
 * Property-based test for enriched text word count constraints
 * Feature: folklorerun-game, Property 19: Enriched text maintains word count constraints
 * Validates: Requirements 10.1, 10.2, 10.3, 10.4
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { fallbackCreatureData } from '../fallbackData.js';

/**
 * Count words in a text string
 * @param {string} text - The text to count words in
 * @returns {number} - The number of words
 */
function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

describe('Property 19: Enriched text maintains word count constraints', () => {
  /**
   * Property: For any enriched intro text, the word count should be between 12-45 words
   * Validates: Requirements 10.1
   */
  it('enriched intro texts should be 12-45 words', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...fallbackCreatureData.creatures),
        (creature) => {
          // Check enrichedIntros array
          if (creature.enrichedIntros && Array.isArray(creature.enrichedIntros)) {
            return creature.enrichedIntros.every(intro => {
              const wordCount = countWords(intro);
              return wordCount >= 12 && wordCount <= 45;
            });
          }
          // Check single enrichedIntro field (legacy support)
          if (creature.enrichedIntro) {
            const wordCount = countWords(creature.enrichedIntro);
            return wordCount >= 12 && wordCount <= 45;
          }
          // If no enriched intro exists, skip this creature
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any enriched scene text, the word count should be between 12-45 words
   * Validates: Requirements 10.2
   */
  it('enriched scene texts should be 12-45 words', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...fallbackCreatureData.creatures),
        (creature) => {
          // Check all levels for enrichedScene text
          if (creature.levels && Array.isArray(creature.levels)) {
            return creature.levels.every(level => {
              if (level.enrichedScene) {
                const wordCount = countWords(level.enrichedScene);
                return wordCount >= 12 && wordCount <= 45;
              }
              return true;
            });
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any victory text, the word count should be between 12-30 words
   * Validates: Requirements 10.3
   */
  it('victory texts should be 12-30 words', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...fallbackCreatureData.creatures),
        (creature) => {
          // Check victoryTexts array
          if (creature.victoryTexts && Array.isArray(creature.victoryTexts)) {
            return creature.victoryTexts.every(victoryText => {
              const wordCount = countWords(victoryText);
              return wordCount >= 12 && wordCount <= 30;
            });
          }
          // Check single victoryText field (legacy support)
          if (creature.victoryText) {
            const wordCount = countWords(creature.victoryText);
            return wordCount >= 12 && wordCount <= 30;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any defeat text, the word count should be between 12-30 words
   * Validates: Requirements 10.4
   */
  it('defeat texts should be 12-30 words', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...fallbackCreatureData.creatures),
        (creature) => {
          // Check defeatTexts array
          if (creature.defeatTexts && Array.isArray(creature.defeatTexts)) {
            return creature.defeatTexts.every(defeatText => {
              const wordCount = countWords(defeatText);
              return wordCount >= 12 && wordCount <= 30;
            });
          }
          // Check single defeatText field (legacy support)
          if (creature.defeatText) {
            const wordCount = countWords(creature.defeatText);
            return wordCount >= 12 && wordCount <= 30;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Combined property: All enriched text across all creatures maintains word count constraints
   * This is a comprehensive test that validates all text types at once
   */
  it('all enriched text maintains appropriate word count constraints', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...fallbackCreatureData.creatures),
        (creature) => {
          const violations = [];

          // Check intro texts (12-45 words)
          if (creature.enrichedIntros && Array.isArray(creature.enrichedIntros)) {
            creature.enrichedIntros.forEach((intro, idx) => {
              const wordCount = countWords(intro);
              if (wordCount < 12 || wordCount > 45) {
                violations.push(`${creature.name} intro ${idx + 1}: ${wordCount} words (expected 12-45)`);
              }
            });
          }

          // Check scene texts (12-45 words)
          if (creature.levels && Array.isArray(creature.levels)) {
            creature.levels.forEach((level, idx) => {
              if (level.enrichedScene) {
                const wordCount = countWords(level.enrichedScene);
                if (wordCount < 12 || wordCount > 45) {
                  violations.push(`${creature.name} level ${idx} scene: ${wordCount} words (expected 12-45)`);
                }
              }
            });
          }

          // Check victory texts (12-30 words)
          if (creature.victoryTexts && Array.isArray(creature.victoryTexts)) {
            creature.victoryTexts.forEach((victoryText, idx) => {
              const wordCount = countWords(victoryText);
              if (wordCount < 12 || wordCount > 30) {
                violations.push(`${creature.name} victory ${idx + 1}: ${wordCount} words (expected 12-30)`);
              }
            });
          }

          // Check defeat texts (12-30 words)
          if (creature.defeatTexts && Array.isArray(creature.defeatTexts)) {
            creature.defeatTexts.forEach((defeatText, idx) => {
              const wordCount = countWords(defeatText);
              if (wordCount < 12 || wordCount > 30) {
                violations.push(`${creature.name} defeat ${idx + 1}: ${wordCount} words (expected 12-30)`);
              }
            });
          }

          // If there are violations, fail with detailed message
          if (violations.length > 0) {
            expect(violations).toEqual([]);
            return false;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

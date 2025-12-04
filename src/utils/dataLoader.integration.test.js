/**
 * Integration tests for data loading
 * Tests the complete data loading flow with real fallback data
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadAllGameData } from './dataLoader';
import { fallbackCreatureData, fallbackUIConfig } from '../fallbackData';

describe('dataLoader integration', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('should successfully load all game data and provide usable structure', async () => {
    // This test simulates a real scenario where JSON files fail to load
    // and the system falls back to embedded content
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { creatureData, uiConfig } = await loadAllGameData();

    // Verify creature data structure
    expect(creatureData).toBeDefined();
    expect(creatureData.creatures).toBeInstanceOf(Array);
    expect(creatureData.creatures.length).toBeGreaterThan(0);

    // Verify each creature has required fields
    creatureData.creatures.forEach(creature => {
      expect(creature.id).toBeDefined();
      expect(creature.name).toBeDefined();
      // Check for either enrichedIntros (new format) or enrichedIntro (old format)
      expect(creature.enrichedIntros || creature.enrichedIntro).toBeDefined();
      expect(creature.coreMechanic).toBeDefined();
      expect(creature.levels).toBeInstanceOf(Array);
      expect(creature.levels.length).toBeGreaterThan(0);
      // Check for either victoryTexts (new format) or victoryText (old format)
      expect(creature.victoryTexts || creature.victoryText).toBeDefined();
      expect(creature.defeatTexts || creature.defeatText).toBeDefined();

      // Verify each level has required fields
      creature.levels.forEach(level => {
        expect(level.levelIndex).toBeDefined();
        expect(level.sceneText).toBeDefined();
        expect(level.choices).toBeInstanceOf(Array);
        expect(level.choices.length).toBeGreaterThan(0);

        // Verify each choice has required fields
        level.choices.forEach(choice => {
          expect(choice.text).toBeDefined();
          expect(typeof choice.isCorrect).toBe('boolean');
          expect(choice.consequence).toBeDefined();
        });
      });
    });

    // Verify UI config structure
    expect(uiConfig).toBeDefined();
    expect(uiConfig.creatures).toBeDefined();
    expect(uiConfig.gameStates).toBeDefined();
    expect(uiConfig.gameStates.calm).toBeDefined();
    expect(uiConfig.gameStates.tense).toBeDefined();
    expect(uiConfig.gameStates.critical).toBeDefined();

    // Verify game states have required fields
    ['calm', 'tense', 'critical'].forEach(state => {
      expect(uiConfig.gameStates[state].fogDensity).toBeDefined();
      expect(uiConfig.gameStates[state].particleCount).toBeDefined();
      expect(uiConfig.gameStates[state].animationIntensity).toBeDefined();
    });
  });

  it('should provide creature-specific UI config for all creatures', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { creatureData, uiConfig } = await loadAllGameData();

    // Verify that each creature has corresponding UI config
    creatureData.creatures.forEach(creature => {
      const creatureConfig = uiConfig.creatures[creature.id];
      expect(creatureConfig).toBeDefined();
      expect(creatureConfig.primaryColor).toBeDefined();
      expect(creatureConfig.fogColor).toBeDefined();
      expect(creatureConfig.particleType).toBeDefined();
    });
  });

  it('should handle partial data gracefully', async () => {
    // Mock a scenario where creature data loads but UI config fails
    const mockCreatureData = {
      creatures: [
        {
          id: 'test',
          name: 'Test',
          levels: [
            {
              levelIndex: 0,
              choices: [{ text: 'Test', isCorrect: true, consequence: 'Test' }]
            }
          ]
        }
      ]
    };

    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // First call (creature data) succeeds
        return Promise.resolve({
          ok: true,
          json: async () => mockCreatureData
        });
      } else {
        // Second call (UI config) fails
        return Promise.resolve({
          ok: false,
          status: 404
        });
      }
    });

    const { creatureData, uiConfig } = await loadAllGameData();

    // Creature data should be loaded
    expect(creatureData.creatures[0].id).toBe('test');
    
    // UI config should fall back
    expect(uiConfig).toEqual(fallbackUIConfig);
  });
});

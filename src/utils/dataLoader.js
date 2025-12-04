/**
 * Data Loading Utility for FOLKLORERUN
 * 
 * This module handles loading game data from external JSON files with comprehensive
 * error handling and graceful fallback to embedded content.
 * 
 * Data Integration Strategy:
 * 1. Attempt to fetch JSON files from public directory (Requirements 9.1, 9.2)
 * 2. Validate data structure to ensure required fields exist (Requirement 9.3)
 * 3. Apply safe defaults for any missing optional fields (Requirement 9.5)
 * 4. Fall back to embedded content if loading fails (Requirement 9.4)
 * 
 * This approach ensures the game remains playable even if:
 * - JSON files are missing or corrupted
 * - Network requests fail
 * - Data structure is incomplete
 * - Browser blocks fetch requests
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

import { fallbackCreatureData, fallbackUIConfig } from '../fallbackData';

/**
 * Validates creature data structure
 * 
 * Ensures the loaded JSON has the minimum required structure for the game to function.
 * Checks for:
 * - Top-level 'creatures' array
 * - Each creature has id, name, and at least one level
 * - Levels array is properly formatted
 * 
 * This validation prevents runtime errors from malformed data.
 * 
 * @param {object} data - The data to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateCreatureData(data) {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.creatures)) return false;
  
  // Check that each creature has required fields
  return data.creatures.every(creature => 
    creature.id &&
    creature.name &&
    Array.isArray(creature.levels) &&
    creature.levels.length > 0
  );
}

/**
 * Validates UI config structure
 * @param {object} config - The config to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateUIConfig(config) {
  if (!config || typeof config !== 'object') return false;
  
  // Check for required top-level keys
  return (
    config.creatures &&
    config.gameStates &&
    typeof config.creatures === 'object' &&
    typeof config.gameStates === 'object'
  );
}

/**
 * Applies safe defaults to creature data for missing fields
 * 
 * This function ensures that even if the JSON is incomplete, the game can still run
 * by providing sensible defaults for all optional fields. This implements Requirement 9.5.
 * 
 * Default Strategy:
 * - Empty strings for missing text fields
 * - 'unknown' for missing IDs
 * - Empty arrays for missing collections
 * - false for missing boolean flags
 * - Generic fallback text for victory/defeat
 * 
 * This prevents null/undefined errors throughout the application.
 * 
 * @param {object} data - The creature data
 * @returns {object} - Data with safe defaults applied
 */
function applySafeDefaultsToCreatureData(data) {
  if (!data || !data.creatures) return fallbackCreatureData;
  
  const creatures = data.creatures.map(creature => ({
    id: creature.id || 'unknown',
    name: creature.name || 'Unknown Creature',
    enrichedIntro: creature.enrichedIntro || '',
    coreMechanic: creature.coreMechanic || 'none',
    levels: (creature.levels || []).map(level => ({
      levelIndex: level.levelIndex ?? 0,
      sceneText: level.sceneText || '',
      enrichedScene: level.enrichedScene || level.sceneText || '',
      choices: (level.choices || []).map(choice => ({
        text: choice.text || 'Continue',
        isCorrect: choice.isCorrect ?? false,
        consequence: choice.consequence || ''
      })),
      riddleData: level.riddleData ? {
        riddle: level.riddleData.riddle || '',
        hint: level.riddleData.hint || '',
        answerKey: level.riddleData.answerKey || ''
      } : undefined
    })),
    victoryText: creature.victoryText || 'You have succeeded.',
    defeatText: creature.defeatText || 'You have failed.'
  }));
  
  return { creatures };
}

/**
 * Applies safe defaults to UI config for missing fields
 * @param {object} config - The UI config
 * @returns {object} - Config with safe defaults applied
 */
function applySafeDefaultsToUIConfig(config) {
  if (!config) return fallbackUIConfig;
  
  return {
    creatures: config.creatures || fallbackUIConfig.creatures,
    gameStates: config.gameStates || fallbackUIConfig.gameStates,
    soundCues: config.soundCues || fallbackUIConfig.soundCues || {},
    transitions: config.transitions || fallbackUIConfig.transitions || {},
    accessibility: config.accessibility || fallbackUIConfig.accessibility || {},
    performance: config.performance || fallbackUIConfig.performance || {}
  };
}

/**
 * Loads creature data from JSON file with fallback
 * 
 * Data Loading Flow:
 * 1. Fetch creatures_game_data.json from public directory (Requirement 9.1)
 * 2. Check HTTP response status
 * 3. Parse JSON content (Requirement 9.3)
 * 4. Validate data structure
 * 5. Apply safe defaults for missing fields (Requirement 9.5)
 * 6. Return fallback content if any step fails (Requirement 9.4)
 * 
 * Error Handling:
 * - Network errors (fetch fails)
 * - HTTP errors (404, 500, etc.)
 * - JSON parse errors (malformed JSON)
 * - Validation errors (missing required fields)
 * 
 * All errors are logged to console for debugging but don't crash the app.
 * 
 * @returns {Promise<object>} - Creature data object with all three creatures
 */
export async function loadCreatureData() {
  try {
    // Attempt to fetch from public directory (Requirement 9.1)
    const response = await fetch(`${import.meta.env.BASE_URL}creatures_game_data.json`);
    
    if (!response.ok) {
      console.warn('Failed to fetch creatures_game_data.json, using fallback content');
      return fallbackCreatureData;
    }
    
    // Parse JSON (Requirement 9.3)
    const data = await response.json();
    
    // Validate structure
    if (!validateCreatureData(data)) {
      console.warn('Invalid creature data structure, using fallback content');
      return fallbackCreatureData;
    }
    
    // Apply safe defaults for any missing fields (Requirement 9.5)
    return applySafeDefaultsToCreatureData(data);
    
  } catch (error) {
    // Graceful fallback for any error (Requirement 9.4)
    console.warn('Error loading creature data:', error.message);
    console.warn('Using embedded fallback content');
    return fallbackCreatureData;
  }
}

/**
 * Loads UI config from JSON file with fallback
 * @returns {Promise<object>} - UI config object
 */
export async function loadUIConfig() {
  try {
    // Attempt to fetch from public directory
    const response = await fetch(`${import.meta.env.BASE_URL}ui_dynamic_config.json`);
    
    if (!response.ok) {
      console.warn('Failed to fetch ui_dynamic_config.json, using fallback content');
      return fallbackUIConfig;
    }
    
    // Parse JSON
    const config = await response.json();
    
    // Validate structure
    if (!validateUIConfig(config)) {
      console.warn('Invalid UI config structure, using fallback content');
      return fallbackUIConfig;
    }
    
    // Apply safe defaults for any missing fields
    return applySafeDefaultsToUIConfig(config);
    
  } catch (error) {
    console.warn('Error loading UI config:', error.message);
    console.warn('Using embedded fallback content');
    return fallbackUIConfig;
  }
}

/**
 * Loads all game data (creature data and UI config)
 * @returns {Promise<{creatureData: object, uiConfig: object}>}
 */
export async function loadAllGameData() {
  const [creatureData, uiConfig] = await Promise.all([
    loadCreatureData(),
    loadUIConfig()
  ]);
  
  return {
    creatureData,
    uiConfig
  };
}

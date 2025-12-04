import { useState, useCallback } from 'react';

/**
 * useGameEngine Hook
 * 
 * Central state management for FOLKLORERUN game logic.
 * Manages game phases, creature selection, animation sequencing, level progression, and choice validation.
 * 
 * Game Phases:
 * - intro: Opening video animation
 * - select: Creature selection screen
 * - characterReveal: Creature image entrance and close-up animations
 * - story: Sequential story bubbles (4-5 bubbles)
 * - level: Active gameplay with choices
 * - end: Victory or defeat screen
 * 
 * Requirements: 2.3, 2.4, 2.5, 3.1, 3.6, 4.4, 4.5, 4.6
 */
const useGameEngine = (creatureData) => {
  // Game state management
  const [gameState, setGameState] = useState('intro'); // intro | select | characterReveal | story | level | levelTransition | end
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0); // 0-2
  const [outcome, setOutcome] = useState(null); // victory | defeat | null
  const [consequenceText, setConsequenceText] = useState('');
  const [transitionFrom, setTransitionFrom] = useState(0); // For level transitions
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track correct answers (need 2/3 to win)
  
  // Animation state tracking (Requirements: 2.4, 2.5)
  const [animationState, setAnimationState] = useState({
    entranceComplete: false,
    closeUpComplete: false,
    storyComplete: false
  });
  
  // Story bubble progression tracking (Requirements: 3.1)
  const [storyBubbleIndex, setStoryBubbleIndex] = useState(0); // 0-4 (or 0-5 for Aswang)
  
  // Creature-specific mechanic state
  const [mechanicState, setMechanicState] = useState({
    hintsRevealed: 0,
    calmnessLevel: 100,
    tokensCollected: []
  });

  /**
   * Transition from intro animation to creature selection
   * Requirements: 1.3
   */
  const startGame = useCallback(() => {
    setGameState('select');
  }, []);

  /**
   * Select a creature and begin their story with character reveal animation
   * Requirements: 2.3, 2.4
   * 
   * @param {string} creatureId - ID of the selected creature (baba-yaga, banshee, aswang)
   */
  const selectCreature = useCallback((creatureId) => {
    if (!creatureData || !creatureData.creatures) {
      console.error('Creature data not available');
      return;
    }

    const creature = creatureData.creatures.find(c => c.id === creatureId);
    
    if (!creature) {
      console.error(`Creature with id ${creatureId} not found`);
      return;
    }

    setSelectedCreature(creature);
    setCurrentLevel(0);
    setOutcome(null);
    setConsequenceText('');
    setStoryBubbleIndex(0);
    setCorrectAnswers(0);
    
    // Reset animation state
    setAnimationState({
      entranceComplete: false,
      closeUpComplete: false,
      storyComplete: false
    });
    
    // Reset mechanic state based on creature type
    if (creature.coreMechanic === 'riddle') {
      setMechanicState({ hintsRevealed: 0 });
    } else if (creature.coreMechanic === 'calmness') {
      setMechanicState({ calmnessLevel: 100 });
    } else if (creature.coreMechanic === 'deduction') {
      setMechanicState({ tokensCollected: [] });
    }
    
    // Transition to character reveal phase for entrance animation
    setGameState('characterReveal');
  }, [creatureData]);

  /**
   * Mark entrance animation as complete
   * Requirements: 2.4
   */
  const completeEntranceAnimation = useCallback(() => {
    setAnimationState(prev => ({
      ...prev,
      entranceComplete: true
    }));
  }, []);

  /**
   * Mark close-up animation as complete and transition to story bubbles
   * Requirements: 2.5, 3.1
   */
  const completeCloseUpAnimation = useCallback(() => {
    setAnimationState(prev => ({
      ...prev,
      closeUpComplete: true
    }));
    // Transition to story bubble phase
    setGameState('story');
  }, []);

  /**
   * Advance to the next story bubble
   * Requirements: 3.1
   */
  const advanceStoryBubble = useCallback(() => {
    if (!selectedCreature) return;
    
    // Determine total number of story bubbles based on creature
    // Baba Yaga and Banshee have 4 bubbles, Aswang has 5
    const totalBubbles = selectedCreature.id === 'aswang' ? 5 : 4;
    
    if (storyBubbleIndex < totalBubbles - 1) {
      // Move to next bubble
      setStoryBubbleIndex(prev => prev + 1);
    } else {
      // All bubbles shown, mark story as complete and transition to level
      setAnimationState(prev => ({
        ...prev,
        storyComplete: true
      }));
      setGameState('level');
    }
  }, [selectedCreature, storyBubbleIndex]);

  /**
   * Get canonical story lines for the selected creature
   * Requirements: 3.1, 12.1, 12.2, 12.3
   * 
   * @returns {array} Array of story text lines
   */
  const getStoryLines = useCallback(() => {
    if (!selectedCreature) return [];
    
    // Canonical story text hardcoded as per design document
    const storyLines = {
      'baba-yaga': [
        "In a ring of birch the hut wanders on spindly legs; it eats the footprints of those who pass.",
        "Baba Yaga asks riddles and tests manners — those who offer the right thing may be spared, those who are crude often pay.",
        "She is neither wholly guardian nor villain; she values cunning, gifts, and correct ritual.",
        "Speak carefully. Offer without arrogance. Even a small talisman or a clever answer may sway her."
      ],
      'banshee': [
        "By hedgerow and stream she walks, a quiet light in moon-damp air.",
        "Her cry is a thread that sometimes warns families of coming loss; it is a sound to be honored, not mocked.",
        "To soothe her is to acknowledge memory — names, laces, ribbons tied with care.",
        "Listen and answer with reverence; the wrong noise draws the wail closer."
      ],
      'aswang': [
        "In the small lanes the night moves with extra eyes; a neighbor's shadow may not be what it seems.",
        "The Aswang wears faces, eats the quiet, and slips under lantern light.",
        "Salt burns paths, ember reveals truth, and the spoken name pins the thing.",
        "Watch reflections and odd slips of movement — the clues are small and deadly.",
        "Act in sequence: reveal, bind, and speak — or the night remembers you."
      ]
    };
    
    return storyLines[selectedCreature.id] || [];
  }, [selectedCreature]);

  /**
   * Handle player choice selection
   * Requirements: 3.2, 3.4, 3.5
   * 
   * @param {number} choiceIndex - Index of the selected choice (0 or 1)
   */
  const makeChoice = useCallback((choiceIndex) => {
    if (!selectedCreature || gameState !== 'level') {
      return;
    }

    const levelData = selectedCreature.levels[currentLevel];
    
    if (!levelData || !levelData.choices || !levelData.choices[choiceIndex]) {
      console.error('Invalid choice or level data');
      return;
    }

    const choice = levelData.choices[choiceIndex];
    
    // Display consequence text (Requirement 4.1: within 200ms)
    setConsequenceText(choice.consequence);

    // Update Banshee's calmness level if wrong choice
    if (selectedCreature.coreMechanic === 'calmness' && !choice.isCorrect) {
      // Decrease calmness based on level: Level 0: -25%, Level 1: -30%, Level 2: -35%
      const decreaseAmount = currentLevel === 0 ? 25 : currentLevel === 1 ? 30 : 35;
      setMechanicState(prev => ({
        ...prev,
        calmnessLevel: Math.max(0, prev.calmnessLevel - decreaseAmount)
      }));
    }

    // Validate choice and determine outcome
    if (choice.isCorrect) {
      // Increment correct answers
      const newCorrectCount = correctAnswers + 1;
      setCorrectAnswers(newCorrectCount);
      
      // Check if this was the final level
      if (currentLevel === 2) {
        // Final level completed - check if player won (need 2/3 correct)
        if (newCorrectCount >= 2) {
          setOutcome('victory');
        } else {
          setOutcome('defeat');
        }
        setGameState('end');
      } else {
        // Progress to next level with transition animation
        setTimeout(() => {
          setTransitionFrom(currentLevel);
          setGameState('levelTransition');
          setConsequenceText('');
        }, 2000); // Brief delay to show consequence
      }
    } else {
      // Incorrect choice - continue to next level but track failure
      if (currentLevel === 2) {
        // Final level - check if player has enough correct answers (need 2/3)
        if (correctAnswers >= 2) {
          setOutcome('victory');
        } else {
          setOutcome('defeat');
        }
        setGameState('end');
      } else {
        // Progress to next level even with wrong answer
        setTimeout(() => {
          setTransitionFrom(currentLevel);
          setGameState('levelTransition');
          setConsequenceText('');
        }, 2000);
      }
    }
  }, [selectedCreature, currentLevel, gameState, correctAnswers]);

  /**
   * Get current level data for rendering
   * 
   * @returns {object|null} Current level data or null
   */
  const getCurrentLevelData = useCallback(() => {
    if (!selectedCreature || !selectedCreature.levels) {
      return null;
    }
    
    return selectedCreature.levels[currentLevel] || null;
  }, [selectedCreature, currentLevel]);

  /**
   * Restart the game with the same creature
   * Requirements: 13.5
   */
  const restartGame = useCallback(() => {
    console.log('🔄 restartGame called - keeping creature, going to characterReveal');
    // Keep selected creature, restart from character reveal
    setGameState('characterReveal');
    setCurrentLevel(0);
    setOutcome(null);
    setCorrectAnswers(0);
    setConsequenceText('');
    setStoryBubbleIndex(0);
    setAnimationState({
      entranceComplete: false,
      closeUpComplete: false,
      storyComplete: false
    });
    setMechanicState({
      hintsRevealed: 0,
      calmnessLevel: 100,
      tokensCollected: []
    });
  }, []);

  /**
   * Return to creature selection (home button)
   * Requirements: 15.2
   */
  const goHome = useCallback(() => {
    console.log('🏠 goHome called - clearing creature, going to select');
    // Reset everything including creature
    setSelectedCreature(null);
    setGameState('select');
    setCurrentLevel(0);
    setOutcome(null);
    setCorrectAnswers(0);
    setConsequenceText('');
    setStoryBubbleIndex(0);
    setAnimationState({
      entranceComplete: false,
      closeUpComplete: false,
      storyComplete: false
    });
    setMechanicState({
      hintsRevealed: 0,
      calmnessLevel: 100,
      tokensCollected: []
    });
  }, []);

  /**
   * Complete level transition and move to next level
   */
  const completeLevelTransition = useCallback(() => {
    setCurrentLevel(prev => prev + 1);
    setGameState('level');
  }, []);

  /**
   * Update creature-specific mechanic state
   * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
   * 
   * @param {object} updates - Partial mechanic state updates
   */
  const updateMechanicState = useCallback((updates) => {
    setMechanicState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  return {
    // State
    gameState,
    selectedCreature,
    currentLevel,
    outcome,
    consequenceText,
    mechanicState,
    animationState,
    storyBubbleIndex,
    transitionFrom,
    correctAnswers,
    
    // Actions
    startGame,
    selectCreature,
    completeEntranceAnimation,
    completeCloseUpAnimation,
    advanceStoryBubble,
    completeLevelTransition,
    getStoryLines,
    makeChoice,
    getCurrentLevelData,
    restartGame,
    goHome,
    updateMechanicState
  };
};

export default useGameEngine;

import React, { useState, useEffect } from 'react';
import './Inventory.css';

/**
 * Inventory Component
 * 
 * Displays creature-specific interactive mechanics:
 * - Baba Yaga: Riddle interface with hint reveal after incorrect attempt
 * - Banshee: Calmness meter with visual indicator
 * - Aswang: Token-based deduction system with combination validation
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 * 
 * @param {Object} props
 * @param {Object} props.creature - Current creature object
 * @param {Object} props.mechanicState - Current state of creature mechanic
 * @param {Function} props.onMechanicUpdate - Callback for mechanic interactions
 * @param {Object} props.levelData - Current level data (for riddles)
 * @param {Object} props.uiConfig - UI configuration for theming
 */
const Inventory = ({ creature, mechanicState, onMechanicUpdate, levelData, uiConfig }) => {
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState('');

  // Reset state when level changes
  useEffect(() => {
    setRiddleAnswer('');
    setShowHint(false);
    setAnswerFeedback('');
  }, [levelData]);

  if (!creature) {
    return null;
  }

  // Get creature-specific colors from UI config
  const getCreatureColors = () => {
    if (!uiConfig?.creatures) {
      return {
        primary: '#ffffff',
        secondary: '#cccccc'
      };
    }

    const creatureConfig = uiConfig.creatures[creature.id];
    return {
      primary: creatureConfig?.primaryColor || '#ffffff',
      secondary: creatureConfig?.secondaryColor || '#cccccc'
    };
  };

  const colors = getCreatureColors();

  /**
   * Baba Yaga Riddle Interface
   * Requirements: 6.1, 6.4, 6.5
   * 
   * Displays riddle, allows answer submission, reveals hint after incorrect attempt
   */
  const renderRiddleInterface = () => {
    if (!levelData?.riddleData) {
      return null;
    }

    const { riddle, hint, answerKey } = levelData.riddleData;

    const handleSubmitAnswer = (e) => {
      e.preventDefault();
      
      const normalizedAnswer = riddleAnswer.trim().toLowerCase();
      const normalizedKey = answerKey.toLowerCase();

      // Requirement 6.4: Validate inputs against creature-specific rules
      if (normalizedAnswer === normalizedKey) {
        setAnswerFeedback('Correct! The witch is pleased.');
      } else {
        setAnswerFeedback('Incorrect. The witch frowns.');
        
        // Requirement 6.1: Reveal hint after incorrect attempt
        // Requirement 6.5: Update visual indicators immediately
        if (!showHint) {
          setTimeout(() => {
            setShowHint(true);
            onMechanicUpdate({ hintsRevealed: (mechanicState.hintsRevealed || 0) + 1 });
          }, 500);
        }
      }
    };

    return (
      <div className="riddle-interface">
        <div className="riddle-header">
          <h3 className="mechanic-title">Baba Yaga's Riddle</h3>
        </div>
        
        <div className="riddle-content">
          <p className="riddle-text">{riddle}</p>
          
          <form onSubmit={handleSubmitAnswer} className="riddle-form">
            <input
              type="text"
              value={riddleAnswer}
              onChange={(e) => setRiddleAnswer(e.target.value)}
              placeholder="Speak your answer..."
              className="riddle-input"
              aria-label="Riddle answer input"
            />
            <button 
              type="submit" 
              className="riddle-submit"
              disabled={!riddleAnswer.trim()}
              aria-label="Submit riddle answer"
            >
              Answer
            </button>
          </form>

          {answerFeedback && (
            <div 
              className={`answer-feedback ${answerFeedback.includes('Correct') ? 'correct' : 'incorrect'}`}
              role="status"
              aria-live="polite"
            >
              {answerFeedback}
            </div>
          )}

          {/* Requirement 6.1, 6.5: Hint reveal after incorrect attempt */}
          {showHint && (
            <div className="riddle-hint" role="status" aria-live="polite">
              <span className="hint-label">Hint:</span> {hint}
            </div>
          )}

          <div className="hints-counter">
            Hints revealed: {mechanicState.hintsRevealed || 0}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Banshee Calmness Meter
   * Requirements: 6.2, 6.4, 6.5
   * 
   * Displays visual indicator of calmness level (0-100)
   */
  const renderCalmnessMeter = () => {
    const calmnessLevel = mechanicState.calmnessLevel ?? 100;
    
    // Requirement 6.4: Validate against creature-specific rules (0-100 range)
    const normalizedCalmness = Math.max(0, Math.min(100, calmnessLevel));
    
    // Determine mood based on calmness level
    let moodText = 'Peaceful';
    let moodClass = 'peaceful';
    
    if (normalizedCalmness < 30) {
      moodText = 'Anguished';
      moodClass = 'anguished';
    } else if (normalizedCalmness < 60) {
      moodText = 'Sorrowful';
      moodClass = 'sorrowful';
    }

    return (
      <div className="calmness-meter">
        <div className="calmness-header">
          <h3 className="mechanic-title">Banshee's Sorrow</h3>
          <span className={`mood-indicator ${moodClass}`}>{moodText}</span>
        </div>
        
        {/* Requirement 6.2, 6.5: Visual indicator with immediate updates */}
        <div className="meter-container" role="meter" aria-valuenow={normalizedCalmness} aria-valuemin="0" aria-valuemax="100" aria-label="Calmness level">
          <div className="meter-background">
            <div 
              className="meter-fill"
              style={{ 
                width: `${normalizedCalmness}%`,
                backgroundColor: colors.primary,
                transition: 'width 0.3s ease-out'
              }}
            >
              <span className="meter-glow"></span>
            </div>
          </div>
          <div className="meter-labels">
            <span className="meter-label-min">Anguished</span>
            <span className="meter-value">{normalizedCalmness}%</span>
            <span className="meter-label-max">Peaceful</span>
          </div>
        </div>

        <p className="calmness-description">
          Speak gently to ease her sorrow. Harsh words will deepen her anguish.
        </p>
      </div>
    );
  };

  /**
   * Aswang Token-Based Deduction System
   * Requirements: 6.3, 6.4, 6.5
   * 
   * Displays collected tokens/clues and validates combinations
   */
  const renderDeductionSystem = () => {
    const tokensCollected = mechanicState.tokensCollected || [];
    
    // Available clues/tokens for Aswang deduction
    const availableTokens = [
      { id: 'reversed-reflection', name: 'Reversed Reflection', description: 'Mirror shows wrong image' },
      { id: 'no-shadow', name: 'No Shadow', description: 'Casts no shadow in moonlight' },
      { id: 'salt-reaction', name: 'Salt Reaction', description: 'Recoils from salt' },
      { id: 'garlic-aversion', name: 'Garlic Aversion', description: 'Avoids garlic' },
      { id: 'extended-tongue', name: 'Extended Tongue', description: 'Impossibly long tongue' },
      { id: 'leathery-wings', name: 'Leathery Wings', description: 'Hidden wings visible' }
    ];

    const handleTokenClick = (tokenId) => {
      // Requirement 6.4: Validate inputs against creature-specific rules
      // Toggle token collection
      const newTokens = tokensCollected.includes(tokenId)
        ? tokensCollected.filter(id => id !== tokenId)
        : [...tokensCollected, tokenId];
      
      // Requirement 6.5: Update visual indicators immediately
      onMechanicUpdate({ tokensCollected: newTokens });
    };

    // Requirement 6.3, 6.4: Combination validation
    const validateCombination = () => {
      // Valid combinations that reveal the Aswang
      const validCombinations = [
        ['reversed-reflection', 'no-shadow'],
        ['salt-reaction', 'garlic-aversion'],
        ['extended-tongue', 'leathery-wings']
      ];

      const isValid = validCombinations.some(combo => 
        combo.every(token => tokensCollected.includes(token))
      );

      return isValid;
    };

    const isValidCombination = validateCombination();

    return (
      <div className="deduction-system">
        <div className="deduction-header">
          <h3 className="mechanic-title">Aswang Deduction</h3>
          <span className="tokens-count">{tokensCollected.length} / 6 clues</span>
        </div>

        <p className="deduction-description">
          Collect clues to identify the Aswang. Find matching signs to reveal its true nature.
        </p>

        {/* Requirement 6.3, 6.5: Token display with immediate visual updates */}
        <div className="tokens-grid">
          {availableTokens.map(token => {
            const isCollected = tokensCollected.includes(token.id);
            
            return (
              <button
                key={token.id}
                className={`token-card ${isCollected ? 'collected' : ''}`}
                onClick={() => handleTokenClick(token.id)}
                aria-pressed={isCollected}
                aria-label={`${token.name}: ${token.description}`}
              >
                <div className="token-icon">
                  {isCollected ? '✓' : '?'}
                </div>
                <div className="token-info">
                  <h4 className="token-name">{token.name}</h4>
                  {isCollected && (
                    <p className="token-description">{token.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Requirement 6.3, 6.4: Combination validation feedback */}
        {tokensCollected.length >= 2 && (
          <div 
            className={`combination-status ${isValidCombination ? 'valid' : 'invalid'}`}
            role="status"
            aria-live="polite"
          >
            {isValidCombination 
              ? '✓ Valid combination! The Aswang is revealed.' 
              : 'Keep searching for matching clues...'}
          </div>
        )}
      </div>
    );
  };

  // Render appropriate interface based on creature type
  return (
    <div 
      className="inventory"
      style={{
        '--creature-primary': colors.primary,
        '--creature-secondary': colors.secondary
      }}
    >
      {creature.coreMechanic === 'riddle' && renderRiddleInterface()}
      {creature.coreMechanic === 'calmness' && renderCalmnessMeter()}
      {creature.coreMechanic === 'deduction' && renderDeductionSystem()}
    </div>
  );
};

export default Inventory;

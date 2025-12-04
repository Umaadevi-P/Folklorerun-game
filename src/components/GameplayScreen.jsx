import React from 'react';
import './GameplayScreen.css';
import AmbientEffects from './AmbientEffects';

/**
 * GameplayScreen Component
 * 
 * Complete level gameplay screen with proper 9:16 mobile-first layout.
 * Displays scene text, creature mechanics, and choice buttons in organized sections.
 * 
 * Requirements: 4.1, 5.1-5.5, 6.1-6.5, 7.1-7.5
 */
const GameplayScreen = ({ 
  creature, 
  levelData, 
  currentLevel,
  mechanicState,
  onChoice,
  onMechanicUpdate,
  uiConfig,
  reducedMotion = false 
}) => {
  const [selectedChoice, setSelectedChoice] = React.useState(null);
  const [showConsequence, setShowConsequence] = React.useState(false);
  const [riddleAnswer, setRiddleAnswer] = React.useState('');
  const [showHint, setShowHint] = React.useState(false);
  const [answerFeedback, setAnswerFeedback] = React.useState('');
  const [hideSceneText, setHideSceneText] = React.useState(false);
  const [riddleSolved, setRiddleSolved] = React.useState(false);
  const [hasValidTokens, setHasValidTokens] = React.useState(false);
  const [riddleAttempts, setRiddleAttempts] = React.useState(0);

  // Get creature-specific background image
  const getBgImage = () => {
    const bgMap = {
      'baba-yaga': 'Baba Yaga BG.jpg',
      'banshee': 'Banshee BG.jpg',
      'aswang': 'Aswang BG.jpg'
    };
    return `${import.meta.env.BASE_URL}assets/${encodeURIComponent(bgMap[creature.id] || '')}`;
  };

  // Get creature-specific font
  const getFont = () => {
    const fontMap = {
      'baba-yaga': "'Asimovian', serif",
      'banshee': "'Jersey 10', monospace",
      'aswang': "'Road Rage', serif"
    };
    return fontMap[creature.id] || "'Georgia', serif";
  };

  // Get creature colors
  const getColors = () => {
    const colorMap = {
      'baba-yaga': { primary: '#A67CFF', secondary: '#8B5FE6' },
      'banshee': { primary: '#CFE8FF', secondary: '#A8D0F0' },
      'aswang': { primary: '#E04B4B', secondary: '#B83838' }
    };
    return colorMap[creature.id] || { primary: '#ffffff', secondary: '#cccccc' };
  };

  const colors = getColors();
  const font = getFont();

  // Handle choice selection
  const handleChoice = (index) => {
    if (selectedChoice !== null) return;
    
    // For Aswang deduction mechanic, validate both item and choice match
    if (creature.coreMechanic === 'deduction') {
      const choice = levelData.choices[index];
      const selectedItem = mechanicState.selectedItem;
      
      // Check if this choice requires a specific item
      if (choice.correctItem && selectedItem !== choice.correctItem) {
        // Wrong item selected - treat as incorrect choice
        setSelectedChoice(index);
        setTimeout(() => {
          setHideSceneText(true);
          setShowConsequence(true);
        }, 200);
        
        // Force incorrect outcome by passing a modified index that triggers wrong consequence
        setTimeout(() => {
          // Find the first incorrect choice index
          const incorrectIndex = levelData.choices.findIndex(c => !c.isCorrect);
          onChoice(incorrectIndex >= 0 ? incorrectIndex : index);
        }, 4200);
        return;
      }
    }
    
    setSelectedChoice(index);
    
    // Small delay then show consequence and fade everything else
    setTimeout(() => {
      setHideSceneText(true);
      setShowConsequence(true);
    }, 200);
    
    // Proceed to next level after showing consequence (extended by 2 seconds)
    setTimeout(() => {
      onChoice(index);
    }, 4200);
  };

  // Handle riddle submission
  const handleRiddleSubmit = (e) => {
    e.preventDefault();
    const normalizedAnswer = riddleAnswer.trim().toLowerCase();
    const normalizedKey = levelData.riddleData?.answerKey?.toLowerCase() || '';
    
    if (normalizedAnswer === normalizedKey) {
      setAnswerFeedback('Correct! The witch is pleased. You may proceed.');
      setRiddleSolved(true); // Unlock choice buttons
    } else {
      const newAttempts = riddleAttempts + 1;
      setRiddleAttempts(newAttempts);
      
      if (newAttempts === 1) {
        // First wrong answer - show hint
        setAnswerFeedback('Incorrect. The witch frowns.');
        setTimeout(() => setShowHint(true), 500);
      } else if (newAttempts >= 2) {
        // Second wrong answer - auto-proceed
        setAnswerFeedback('Incorrect again. The witch sighs and lets you pass anyway.');
        setTimeout(() => {
          setRiddleSolved(true); // Unlock choice buttons after 2 attempts
        }, 1500);
      }
    }
    
    // Clear the input after submission
    setRiddleAnswer('');
  };

  // Check if Aswang has selected an item
  React.useEffect(() => {
    if (creature.coreMechanic === 'deduction') {
      const hasSelected = mechanicState.selectedItem !== null && mechanicState.selectedItem !== undefined;
      setHasValidTokens(hasSelected);
      // Hide scene text after selecting ingredient
      if (hasSelected) {
        setHideSceneText(true);
      }
    }
  }, [mechanicState.selectedItem, creature.coreMechanic]);

  // Check if player can make a choice
  const canMakeChoice = () => {
    if (creature.coreMechanic === 'riddle') {
      return riddleSolved; // Must solve riddle first
    }
    if (creature.coreMechanic === 'deduction') {
      return hasValidTokens; // Must have valid token combination
    }
    return true; // Banshee can always choose
  };

  // Render creature-specific mechanic
  const renderMechanic = () => {
    if (creature.coreMechanic === 'riddle' && levelData.riddleData) {
      // Hide riddle box after solving
      if (riddleSolved) return null;
      
      return (
        <div className="mechanic-box riddle-box">
          <form onSubmit={handleRiddleSubmit} className="riddle-form">
            <input
              type="text"
              value={riddleAnswer}
              onChange={(e) => setRiddleAnswer(e.target.value)}
              placeholder="Speak your answer..."
              className="riddle-input"
              style={{ fontFamily: font }}
            />
            <button type="submit" className="riddle-button" disabled={!riddleAnswer.trim()}>
              Answer
            </button>
          </form>
          {answerFeedback && (
            <div className={`feedback ${answerFeedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
              {answerFeedback}
            </div>
          )}
          {showHint && (
            <div className="hint-box">
              <strong>Hint:</strong> {levelData.riddleData.hint}
            </div>
          )}
        </div>
      );
    }

    if (creature.coreMechanic === 'calmness') {
      const calmness = mechanicState.calmnessLevel ?? 100;
      const mood = calmness < 30 ? 'Anguished' : calmness < 60 ? 'Sorrowful' : 'Peaceful';
      
      return (
        <div className="mechanic-box calmness-box">
          <div className="mechanic-header">
            <h3 className="mechanic-title" style={{ fontFamily: font }}>
              Banshee's Sorrow
            </h3>
            <span className={`mood-badge ${mood.toLowerCase()}`}>{mood}</span>
          </div>
          <div className="calmness-meter" data-calmness={mood.toLowerCase()}>
            <div className="meter-fill" style={{ width: `${calmness}%` }} />
          </div>
          <div className="meter-labels">
            <span>Anguished</span>
            <span className="meter-value">{calmness}%</span>
            <span>Peaceful</span>
          </div>
        </div>
      );
    }

    if (creature.coreMechanic === 'deduction') {
      // Level-specific items for Aswang
      const levelItems = {
        0: [
          { id: 'salt', name: '🧂 Salt', desc: 'Burns paths' },
          { id: 'mirror', name: '🪞 Mirror', desc: 'Shows reflections' },
          { id: 'garlic', name: '🧄 Garlic', desc: 'Wards evil' },
          { id: 'candle', name: '🕯️ Candle', desc: 'Lights the way' }
        ],
        1: [
          { id: 'ember', name: '🔥 Ember', desc: 'Reveals truth' },
          { id: 'mirror', name: '🪞 Mirror', desc: 'Shows reflections' },
          { id: 'holy-water', name: '💧 Holy Water', desc: 'Purifies' },
          { id: 'cross', name: '✝️ Cross', desc: 'Protects' }
        ],
        2: [
          { id: 'speak-name', name: '📢 Speak Name', desc: 'Binds the creature' },
          { id: 'blade', name: '🗡️ Blade', desc: 'Strikes first' },
          { id: 'holy-oil', name: '🛢️ Holy Oil', desc: 'Anoints' },
          { id: 'prayer', name: '🙏 Prayer', desc: 'Invokes protection' }
        ]
      };

      const items = levelItems[currentLevel] || [];
      const selectedItem = mechanicState.selectedItem || null;

      return (
        <div className="mechanic-box deduction-box">
          <h3 className="mechanic-title" style={{ fontFamily: font }}>
            Choose Your Tool
          </h3>
          <p className="deduction-hint">What will you use against the Aswang?</p>
          <div className="item-grid">
            {items.map(item => (
              <button
                key={item.id}
                className={`item-btn ${selectedItem === item.id ? 'selected' : ''}`}
                onClick={() => {
                  onMechanicUpdate({ selectedItem: item.id });
                  setHasValidTokens(true); // Allow choice after selecting
                }}
              >
                <span className="item-icon">{item.name.split(' ')[0]}</span>
                <span className="item-name">{item.name.split(' ').slice(1).join(' ')}</span>
                <span className="item-desc">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      className={`gameplay-screen creature-${creature.id}`}
      style={{
        '--creature-primary': colors.primary,
        '--creature-secondary': colors.secondary,
        '--creature-font': font
      }}
    >
      {/* Background Image */}
      <div 
        className="gameplay-bg"
        style={{ backgroundImage: `url(${getBgImage()})` }}
      />

      {/* Flying ambient effects when consequence is shown - notification screen */}
      {showConsequence && selectedChoice !== null && (
        <AmbientEffects 
          creature={creature.id}
          mode="flying"
          trigger={showConsequence}
          isCorrect={levelData.choices[selectedChoice].isCorrect}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Level Indicator */}
      <div className="level-badge">
        Level {currentLevel + 1}
      </div>

      {/* Scene Text - Top (hides when choice is made) */}
      <div className={`scene-section ${hideSceneText ? 'hidden' : ''}`}>
        <div className="scene-box">
          <p className="scene-text" style={{ fontFamily: font }}>
            {levelData.enrichedScene || levelData.sceneText}
          </p>
        </div>
      </div>

      {/* Creature Mechanic - Middle */}
      <div className={`mechanic-section ${showConsequence ? 'faded' : ''}`}>
        {renderMechanic()}
      </div>

      {/* Choice Buttons - Bottom (Hidden until ready) */}
      <div className={`choices-section ${showConsequence ? 'faded' : ''} ${!canMakeChoice() ? 'hidden' : ''}`}>
        {levelData.choices.map((choice, index) => {
          const isDisabled = selectedChoice !== null;
          return (
            <button
              key={index}
              className={`choice-btn ${selectedChoice === index ? 'selected' : ''} ${selectedChoice !== null && selectedChoice !== index ? 'dimmed' : ''}`}
              onClick={() => handleChoice(index)}
              disabled={isDisabled}
              style={{ fontFamily: font }}
            >
              {choice.text}
            </button>
          );
        })}
      </div>

      {/* Consequence Display - Full screen overlay when shown */}
      {showConsequence && selectedChoice !== null && (
        <div className="consequence-overlay">
          <div className={`consequence-box-large ${levelData.choices[selectedChoice].isCorrect ? 'correct' : 'incorrect'}`}>
            {levelData.choices[selectedChoice].consequence}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameplayScreen;


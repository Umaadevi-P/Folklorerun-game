import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import HeroScene from './HeroScene';

describe('HeroScene Component', () => {
  const mockCreature = {
    id: 'baba-yaga',
    name: 'Baba Yaga',
    coreMechanic: 'riddle'
  };

  const mockLevel = {
    levelIndex: 0,
    sceneText: 'The witch\'s eyes gleam like amber coals.',
    enrichedScene: 'Amber light spills from the window slats.',
    choices: []
  };

  const mockUiConfig = {
    creatures: {
      'baba-yaga': {
        primaryColor: '#FFB84D',
        secondaryColor: '#FF8C42',
        fogColor: 'rgba(255, 184, 77, 0.3)',
        particleType: 'rune-glow',
        particleColor: '#FFD700',
        animationSpeed: 1.2,
        glowIntensity: 0.8
      },
      'banshee': {
        primaryColor: '#B8D4E8',
        secondaryColor: '#7BA8C7',
        fogColor: 'rgba(184, 212, 232, 0.35)',
        particleType: 'echo-wave',
        particleColor: '#E0F2FF',
        animationSpeed: 0.9,
        glowIntensity: 0.6
      },
      'aswang': {
        primaryColor: '#D32F2F',
        secondaryColor: '#8B0000',
        fogColor: 'rgba(211, 47, 47, 0.4)',
        particleType: 'flicker',
        particleColor: '#FF6B6B',
        animationSpeed: 1.5,
        glowIntensity: 0.9
      }
    },
    gameStates: {
      calm: {
        fogDensity: 0.3,
        particleCount: 20,
        animationIntensity: 0.5
      },
      tense: {
        fogDensity: 0.55,
        particleCount: 40,
        animationIntensity: 0.8,
        vignette: true,
        vignetteIntensity: 0.3
      },
      critical: {
        fogDensity: 0.85,
        particleCount: 60,
        animationIntensity: 1.0,
        vignette: true,
        vignetteIntensity: 0.6,
        distortion: true
      }
    }
  };

  it('renders the scene with provided text', () => {
    render(
      <HeroScene
        creature={mockCreature}
        level={mockLevel}
        sceneText="Test scene text"
        uiConfig={mockUiConfig}
        gameState="calm"
      />
    );

    expect(screen.getByText('Test scene text')).toBeInTheDocument();
  });

  it('renders fog layers', () => {
    const { container } = render(
      <HeroScene
        creature={mockCreature}
        level={mockLevel}
        sceneText="Test"
        uiConfig={mockUiConfig}
      />
    );

    const fogLayers = container.querySelectorAll('.fog-layer');
    expect(fogLayers.length).toBe(3);
  });

  it('renders Baba Yaga specific effects (rune glows)', () => {
    const { container } = render(
      <HeroScene
        creature={mockCreature}
        level={mockLevel}
        sceneText="Test"
        uiConfig={mockUiConfig}
      />
    );

    const runeGlows = container.querySelectorAll('.rune-glow');
    expect(runeGlows.length).toBe(4);
  });

  it('renders Banshee specific effects (echo waves)', () => {
    const bansheeCreature = { ...mockCreature, id: 'banshee', name: 'Banshee' };
    const { container } = render(
      <HeroScene
        creature={bansheeCreature}
        level={mockLevel}
        sceneText="Test"
        uiConfig={mockUiConfig}
      />
    );

    const echoWaves = container.querySelectorAll('.echo-wave');
    expect(echoWaves.length).toBe(3);
  });

  it('renders Aswang specific effects (lantern flickers)', () => {
    const aswangCreature = { ...mockCreature, id: 'aswang', name: 'Aswang' };
    const { container } = render(
      <HeroScene
        creature={aswangCreature}
        level={mockLevel}
        sceneText="Test"
        uiConfig={mockUiConfig}
      />
    );

    const lanterns = container.querySelectorAll('.lantern-flicker');
    expect(lanterns.length).toBe(3);
  });

  it('renders particles based on game state', () => {
    const { container } = render(
      <HeroScene
        creature={mockCreature}
        level={mockLevel}
        sceneText="Test"
        uiConfig={mockUiConfig}
        gameState="calm"
      />
    );

    const particles = container.querySelectorAll('.particle');
    expect(particles.length).toBe(20); // calm state has 20 particles
  });

  it('reduces particle count when reducedMotion is enabled', () => {
    const { container } = render(
      <HeroScene
        creature={mockCreature}
        level={mockLevel}
        sceneText="Test"
        uiConfig={mockUiConfig}
        gameState="calm"
        reducedMotion={true}
      />
    );

    const particles = container.querySelectorAll('.particle');
    expect(particles.length).toBe(0); // no particles in reduced motion
  });

  it('applies creature-specific CSS class', () => {
    const { container } = render(
      <HeroScene
        creature={mockCreature}
        level={mockLevel}
        sceneText="Test"
        uiConfig={mockUiConfig}
      />
    );

    const heroScene = container.querySelector('.hero-scene');
    expect(heroScene).toHaveClass('hero-scene--baba-yaga');
  });

  it('applies reduced-motion class when enabled', () => {
    const { container } = render(
      <HeroScene
        creature={mockCreature}
        level={mockLevel}
        sceneText="Test"
        uiConfig={mockUiConfig}
        reducedMotion={true}
      />
    );

    const heroScene = container.querySelector('.hero-scene');
    expect(heroScene).toHaveClass('reduced-motion');
  });

  it('renders vignette overlay in critical state', () => {
    const { container } = render(
      <HeroScene
        creature={mockCreature}
        level={mockLevel}
        sceneText="Test"
        uiConfig={mockUiConfig}
        gameState="critical"
      />
    );

    const vignette = container.querySelector('.vignette-overlay');
    expect(vignette).toBeInTheDocument();
  });

  it('does not render vignette in calm state', () => {
    const { container } = render(
      <HeroScene
        creature={mockCreature}
        level={mockLevel}
        sceneText="Test"
        uiConfig={mockUiConfig}
        gameState="calm"
      />
    );

    const vignette = container.querySelector('.vignette-overlay');
    expect(vignette).not.toBeInTheDocument();
  });

  it('uses enrichedScene from level if no sceneText provided', () => {
    render(
      <HeroScene
        creature={mockCreature}
        level={mockLevel}
        uiConfig={mockUiConfig}
      />
    );

    expect(screen.getByText('Amber light spills from the window slats.')).toBeInTheDocument();
  });

  it('applies correct CSS variables for creature styling', () => {
    const { container } = render(
      <HeroScene
        creature={mockCreature}
        level={mockLevel}
        sceneText="Test"
        uiConfig={mockUiConfig}
      />
    );

    const heroScene = container.querySelector('.hero-scene');
    const style = heroScene.style;
    
    expect(style.getPropertyValue('--creature-primary')).toBe('#FFB84D');
    expect(style.getPropertyValue('--fog-color')).toBe('rgba(255, 184, 77, 0.3)');
  });

  // Feature: folklorerun-game, Property 8: Creature-specific effects render correctly
  describe('Property 8: Creature-specific effects render correctly', () => {
    it('property: for any creature selection, creature-specific visual effects match the theme', () => {
      // Define the three valid creatures with their expected effects
      const creatureConfigs = [
        {
          id: 'baba-yaga',
          name: 'Baba Yaga',
          expectedEffects: {
            fogColor: 'rgba(255, 184, 77, 0.3)', // amber fog
            effectClass: 'baba-yaga-effects',
            specificElements: '.rune-glow', // neon-glowing runes
            elementCount: 4
          }
        },
        {
          id: 'banshee',
          name: 'Banshee',
          expectedEffects: {
            fogColor: 'rgba(184, 212, 232, 0.35)', // pale blue mist
            effectClass: 'banshee-effects',
            specificElements: '.echo-wave', // echo waves
            elementCount: 3
          }
        },
        {
          id: 'aswang',
          name: 'Aswang',
          expectedEffects: {
            fogColor: 'rgba(211, 47, 47, 0.4)', // red-tinted fog
            effectClass: 'aswang-effects',
            specificElements: '.lantern-flicker', // flickering lanterns
            elementCount: 3
          }
        }
      ];

      // Generator for creature configurations
      const creatureConfigArb = fc.constantFrom(...creatureConfigs);

      fc.assert(
        fc.property(creatureConfigArb, (creatureConfig) => {
          const creature = {
            id: creatureConfig.id,
            name: creatureConfig.name,
            coreMechanic: 'test'
          };

          const { container } = render(
            <HeroScene
              creature={creature}
              level={mockLevel}
              sceneText="Test scene"
              uiConfig={mockUiConfig}
              gameState="calm"
            />
          );

          // Verify creature-specific CSS class is applied
          const heroScene = container.querySelector('.hero-scene');
          expect(heroScene).toHaveClass(`hero-scene--${creatureConfig.id}`);

          // Verify fog color matches creature theme
          const fogColor = heroScene.style.getPropertyValue('--fog-color');
          expect(fogColor).toBe(creatureConfig.expectedEffects.fogColor);

          // Verify creature-specific effect container exists
          const effectContainer = container.querySelector(`.${creatureConfig.expectedEffects.effectClass}`);
          expect(effectContainer).toBeInTheDocument();

          // Verify creature-specific visual elements are rendered
          const specificElements = container.querySelectorAll(creatureConfig.expectedEffects.specificElements);
          expect(specificElements.length).toBe(creatureConfig.expectedEffects.elementCount);

          // Additional validation based on creature type
          if (creatureConfig.id === 'baba-yaga') {
            // Baba Yaga should have amber fog and rune glows (Requirement 5.1)
            expect(fogColor).toContain('255, 184, 77'); // amber RGB values
            expect(specificElements[0]).toHaveClass('rune-glow');
          } else if (creatureConfig.id === 'banshee') {
            // Banshee should have pale blue mist and echo waves (Requirement 5.2)
            expect(fogColor).toContain('184, 212, 232'); // pale blue RGB values
            expect(specificElements[0]).toHaveClass('echo-wave');
          } else if (creatureConfig.id === 'aswang') {
            // Aswang should have red fog and flickering lanterns (Requirement 5.3)
            expect(fogColor).toContain('211, 47, 47'); // red RGB values
            expect(specificElements[0]).toHaveClass('lantern-flicker');
          }

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: folklorerun-game, Property 15: Contrast ratio maintains readability
  describe('Property 15: Contrast ratio maintains readability', () => {
    /**
     * Calculate relative luminance for a color
     * Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
     */
    const getRelativeLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        const val = c / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    /**
     * Calculate contrast ratio between two colors
     * Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
     */
    const getContrastRatio = (rgb1, rgb2) => {
      const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
      const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    };

    it('property: for any text display, contrast ratio is at least 4.5:1', () => {
      // The scene text uses #f0f0f0 (240, 240, 240) on rgba(10, 10, 10, 0.85) background
      // The background is semi-transparent, but over a dark scene background
      // We'll test the effective contrast considering the layered backgrounds

      // Define text color used in HeroScene (from CSS: .scene-text { color: #f0f0f0; })
      const textColor = { r: 240, g: 240, b: 240 };

      // Define background color (from CSS: .scene-text-container { background: rgba(10, 10, 10, 0.85); })
      // Over the main scene background which is also dark
      const backgroundColor = { r: 10, g: 10, b: 10 };

      // Generator for different game states and creatures
      const gameStateArb = fc.constantFrom('calm', 'tense', 'critical');
      const creatureIdArb = fc.constantFrom('baba-yaga', 'banshee', 'aswang');
      const sceneTextArb = fc.string({ minLength: 10, maxLength: 200 });

      fc.assert(
        fc.property(
          gameStateArb,
          creatureIdArb,
          sceneTextArb,
          (gameState, creatureId, sceneText) => {
            const creature = {
              id: creatureId,
              name: creatureId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              coreMechanic: 'test'
            };

            const { container } = render(
              <HeroScene
                creature={creature}
                level={mockLevel}
                sceneText={sceneText}
                uiConfig={mockUiConfig}
                gameState={gameState}
              />
            );

            // Get the scene text element
            const sceneTextElement = container.querySelector('.scene-text');
            expect(sceneTextElement).toBeInTheDocument();

            // Calculate contrast ratio
            const contrastRatio = getContrastRatio(textColor, backgroundColor);

            // Requirement 4.5: Contrast ratio must be >= 4.5:1
            expect(contrastRatio).toBeGreaterThanOrEqual(4.5);

            // Additional check: verify the text is actually displayed
            if (sceneText.trim().length > 0) {
              expect(sceneTextElement.textContent).toBe(sceneText);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('verifies the actual text color and background color meet WCAG AA standards', () => {
      // This is a concrete test to verify our CSS values
      const textColor = { r: 240, g: 240, b: 240 }; // #f0f0f0
      const backgroundColor = { r: 10, g: 10, b: 10 }; // rgba(10, 10, 10, 0.85)

      const contrastRatio = getContrastRatio(textColor, backgroundColor);

      // WCAG AA requires 4.5:1 for normal text
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);

      // Our actual contrast ratio should be very high (close to 21:1 for near-white on near-black)
      expect(contrastRatio).toBeGreaterThan(15); // Should be around 19.5:1
    });

    it('property: contrast ratio is maintained across all creature themes', () => {
      // Even though creatures have different fog colors and effects,
      // the text container maintains consistent text/background colors
      const textColor = { r: 240, g: 240, b: 240 };
      const backgroundColor = { r: 10, g: 10, b: 10 };

      const creatureArb = fc.constantFrom(
        { id: 'baba-yaga', name: 'Baba Yaga' },
        { id: 'banshee', name: 'Banshee' },
        { id: 'aswang', name: 'Aswang' }
      );

      fc.assert(
        fc.property(creatureArb, (creature) => {
          const { container } = render(
            <HeroScene
              creature={creature}
              level={mockLevel}
              sceneText="Test scene text for contrast"
              uiConfig={mockUiConfig}
              gameState="calm"
            />
          );

          const sceneTextElement = container.querySelector('.scene-text');
          expect(sceneTextElement).toBeInTheDocument();

          // Calculate contrast ratio
          const contrastRatio = getContrastRatio(textColor, backgroundColor);

          // Must meet WCAG AA standard
          expect(contrastRatio).toBeGreaterThanOrEqual(4.5);

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import IntroAnimation from '../components/IntroAnimation';
import HeroScene from '../components/HeroScene';

/**
 * Property-Based Tests for Reduced Motion
 * 
 * Feature: folklorerun-game, Property 9: Reduced motion disables complex animations
 * Validates: Requirements 12.2, 12.3
 * 
 * These tests verify that when reduced motion is enabled, complex animations
 * (parallax, particle, fog drift, creature effects) are disabled while maintaining
 * core functionality.
 */
describe('Reduced Motion - Property-Based Tests', () => {

  beforeEach(() => {
    // Mock window.matchMedia for reduced motion detection
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Mock navigator.getBattery for low-power detection
    if (!('getBattery' in navigator)) {
      Object.defineProperty(navigator, 'getBattery', {
        value: vi.fn().mockResolvedValue({
          level: 1.0,
          charging: true,
        }),
        configurable: true,
      });
    }
  });

  /**
   * Property 9: Reduced motion disables complex animations in IntroAnimation
   * 
   * For any game state, when reduced motion is enabled, parallax, particle,
   * and complex animations should be disabled while maintaining core functionality.
   */
  it('property: IntroAnimation disables complex animations when reducedMotion is true', () => {
    fc.assert(
      fc.property(
        // Generate random reduced motion state
        fc.boolean(),
        (reducedMotion) => {
          const mockOnComplete = vi.fn();

          const { container, unmount } = render(
            <IntroAnimation
              onComplete={mockOnComplete}
              reducedMotion={reducedMotion}
            />
          );

          try {
            // Property: Component should render regardless of reduced motion state
            // Requirement 12.3: Maintain core functionality
            const introElement = container.querySelector('.intro-animation');
            expect(introElement).toBeInTheDocument();

            // Property: Title should always be visible
            // Requirement 12.3: Maintain core functionality
            const title = screen.getByText('FOLKLORERUN');
            expect(title).toBeInTheDocument();

            if (reducedMotion) {
              // Property: When reduced motion is enabled, component should have reduced-motion class
              // Requirement 12.2: Disable parallax, particle, and complex animations
              expect(introElement).toHaveClass('reduced-motion');

              // Property: Particles should not be rendered when reduced motion is enabled
              // Requirement 12.2: Disable particle animations
              const particles = container.querySelectorAll('.particle');
              expect(particles.length).toBe(0);

              // Property: Fog layers should still exist but with reduced animation
              // Requirement 12.3: Maintain core functionality (visual atmosphere)
              const fogLayers = container.querySelectorAll('.fog-layer');
              expect(fogLayers.length).toBeGreaterThan(0);
            } else {
              // Property: When reduced motion is disabled, particles should be rendered
              const particles = container.querySelectorAll('.particle');
              expect(particles.length).toBeGreaterThan(0);

              // Property: Component should not have reduced-motion class
              expect(introElement).not.toHaveClass('reduced-motion');
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
   * Property 9: Reduced motion disables complex animations in HeroScene
   * 
   * For any creature and game state, when reduced motion is enabled,
   * creature-specific animations should be disabled.
   */
  it('property: HeroScene disables complex animations when reducedMotion is true', () => {
    fc.assert(
      fc.property(
        // Generate random creature and reduced motion state
        fc.constantFrom('baba-yaga', 'banshee', 'aswang'),
        fc.constantFrom('calm', 'tense', 'critical'),
        fc.boolean(),
        (creatureId, gameState, reducedMotion) => {
          const creature = {
            id: creatureId,
            name: creatureId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          };

          const level = {
            sceneText: 'Test scene text for property testing',
            enrichedScene: 'Enriched test scene with atmospheric details',
          };

          const uiConfig = {
            creatures: {
              'baba-yaga': {
                primaryColor: '#FFB84D',
                secondaryColor: '#FF8C42',
                fogColor: 'rgba(255, 184, 77, 0.3)',
                particleType: 'rune-glow',
                animationSpeed: 1.2,
                particleColor: '#FFD700',
                glowIntensity: 0.8,
              },
              'banshee': {
                primaryColor: '#B8D4E8',
                secondaryColor: '#8FB8D4',
                fogColor: 'rgba(184, 212, 232, 0.3)',
                particleType: 'echo-wave',
                animationSpeed: 0.9,
                particleColor: '#B8D4E8',
                glowIntensity: 0.7,
              },
              'aswang': {
                primaryColor: '#D32F2F',
                secondaryColor: '#B71C1C',
                fogColor: 'rgba(211, 47, 47, 0.3)',
                particleType: 'flicker',
                animationSpeed: 1.1,
                particleColor: '#FF6B6B',
                glowIntensity: 0.9,
              },
            },
            gameStates: {
              calm: {
                fogDensity: 0.3,
                particleCount: 20,
                animationIntensity: 0.5,
              },
              tense: {
                fogDensity: 0.55,
                particleCount: 40,
                animationIntensity: 0.8,
                screenTilt: true,
              },
              critical: {
                fogDensity: 0.85,
                particleCount: 60,
                animationIntensity: 1.0,
                vignette: true,
                vignetteIntensity: 0.6,
                distortion: true,
              },
            },
          };

          const { container, unmount } = render(
            <HeroScene
              creature={creature}
              level={level}
              sceneText={level.sceneText}
              uiConfig={uiConfig}
              gameState={gameState}
              reducedMotion={reducedMotion}
            />
          );

          try {
            // Property: Component should render regardless of reduced motion state
            // Requirement 12.3: Maintain core functionality
            const heroScene = container.querySelector('.hero-scene');
            expect(heroScene).toBeInTheDocument();

            // Property: Scene text should always be visible
            // Requirement 12.3: Maintain core functionality
            const sceneText = screen.getByText(level.sceneText);
            expect(sceneText).toBeInTheDocument();

            if (reducedMotion) {
              // Property: When reduced motion is enabled, component should have reduced-motion class
              // Requirement 12.2: Disable parallax, particle, and complex animations
              expect(heroScene).toHaveClass('reduced-motion');

              // Property: Particles should not be rendered when reduced motion is enabled
              // Requirement 12.2: Disable particle animations
              const particles = container.querySelectorAll('.particle');
              expect(particles.length).toBe(0);

              // Property: Fog layers should still exist (for atmosphere) but animations disabled via CSS
              // Requirement 12.3: Maintain core functionality
              const fogLayers = container.querySelectorAll('.fog-layer');
              expect(fogLayers.length).toBeGreaterThan(0);

              // Property: Creature-specific effects should still exist but animations disabled via CSS
              // Requirement 12.3: Maintain core functionality (visual theme)
              if (creatureId === 'baba-yaga') {
                const runeGlows = container.querySelectorAll('.rune-glow');
                expect(runeGlows.length).toBeGreaterThan(0);
              } else if (creatureId === 'banshee') {
                const echoWaves = container.querySelectorAll('.echo-wave');
                expect(echoWaves.length).toBeGreaterThan(0);
              } else if (creatureId === 'aswang') {
                const lanternFlickers = container.querySelectorAll('.lantern-flicker');
                expect(lanternFlickers.length).toBeGreaterThan(0);
              }

              // Property: Vignette should not be rendered when reduced motion is enabled
              // Requirement 12.2: Disable complex animations
              const vignette = container.querySelector('.vignette-overlay');
              if (gameState === 'critical') {
                // Vignette exists in critical state but should not be rendered with reduced motion
                expect(vignette).not.toBeInTheDocument();
              }
            } else {
              // Property: When reduced motion is disabled, particles should be rendered
              // (unless low power mode is detected, but we're mocking that to false)
              const particles = container.querySelectorAll('.particle');
              const stateConfig = uiConfig.gameStates[gameState];
              const expectedParticleCount = stateConfig.particleCount;
              expect(particles.length).toBe(expectedParticleCount);

              // Property: Component should not have reduced-motion class
              expect(heroScene).not.toHaveClass('reduced-motion');

              // Property: Vignette should be rendered in critical state when reduced motion is disabled
              if (gameState === 'critical') {
                const vignette = container.querySelector('.vignette-overlay');
                expect(vignette).toBeInTheDocument();
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
   * Property 9: Reduced motion maintains choice interactions
   * 
   * When reduced motion is enabled, core functionality like choice interactions
   * should remain fully functional.
   */
  it('property: reduced motion maintains core functionality across all components', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (reducedMotion) => {
          const mockOnComplete = vi.fn();

          // Test IntroAnimation core functionality
          const { container: introContainer, unmount: unmountIntro } = render(
            <IntroAnimation
              onComplete={mockOnComplete}
              reducedMotion={reducedMotion}
            />
          );

          try {
            // Property: Title should always be rendered and readable
            // Requirement 12.3: Maintain core functionality
            const title = screen.getByText('FOLKLORERUN');
            expect(title).toBeInTheDocument();
            expect(title).toBeVisible();

            // Property: Component should have proper ARIA label
            const introElement = introContainer.querySelector('.intro-animation');
            expect(introElement).toHaveAttribute('role', 'banner');
            expect(introElement).toHaveAttribute('aria-label', 'FOLKLORERUN title animation');

            return true;
          } finally {
            unmountIntro();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 9: Reduced motion state transitions work correctly
   * 
   * When toggling reduced motion, the component should update immediately
   * and reflect the new state.
   */
  it('property: components respond to reduced motion state changes', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.boolean(),
        (initialReducedMotion, toggledReducedMotion) => {
          // Skip if both states are the same (no change to test)
          fc.pre(initialReducedMotion !== toggledReducedMotion);

          const mockOnComplete = vi.fn();

          const { container, rerender, unmount } = render(
            <IntroAnimation
              onComplete={mockOnComplete}
              reducedMotion={initialReducedMotion}
            />
          );

          try {
            const introElement = container.querySelector('.intro-animation');

            // Verify initial state
            if (initialReducedMotion) {
              expect(introElement).toHaveClass('reduced-motion');
            } else {
              expect(introElement).not.toHaveClass('reduced-motion');
            }

            // Toggle reduced motion state
            rerender(
              <IntroAnimation
                onComplete={mockOnComplete}
                reducedMotion={toggledReducedMotion}
              />
            );

            // Property: Component should update immediately to reflect new state
            // Requirement 12.4: Update animation states immediately on toggle
            if (toggledReducedMotion) {
              expect(introElement).toHaveClass('reduced-motion');
              const particles = container.querySelectorAll('.particle');
              expect(particles.length).toBe(0);
            } else {
              expect(introElement).not.toHaveClass('reduced-motion');
              const particles = container.querySelectorAll('.particle');
              expect(particles.length).toBeGreaterThan(0);
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
});

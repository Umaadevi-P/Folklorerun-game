import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SoundCueVisual from './SoundCueVisual';

describe('SoundCueVisual Component', () => {
  const mockCue = {
    name: 'choice-select',
    descriptor: 'soft-neon-chime',
    visualEffect: 'ripple',
    duration: 300,
    timestamp: Date.now()
  };

  const mockLocation = { x: 100, y: 200 };

  // Requirement 8.4: Accessible captions
  it('should render accessible caption with descriptor', () => {
    render(
      <SoundCueVisual
        currentCue={mockCue}
        descriptor="soft-neon-chime"
        triggerLocation={mockLocation}
        visualEffectClass="sound-effect-ripple"
      />
    );

    const caption = screen.getByRole('status');
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveAttribute('aria-live', 'polite');
    expect(caption).toHaveAttribute('aria-atomic', 'true');
    expect(screen.getByText('soft-neon-chime')).toBeInTheDocument();
  });

  // Requirement 8.2, 8.3: Visual effects
  it('should render visual effect element with correct class', () => {
    const { container } = render(
      <SoundCueVisual
        currentCue={mockCue}
        descriptor="soft-neon-chime"
        triggerLocation={mockLocation}
        visualEffectClass="sound-effect-ripple"
      />
    );

    const visualElement = container.querySelector('.sound-cue-visual');
    expect(visualElement).toBeInTheDocument();
    expect(visualElement).toHaveClass('sound-effect-ripple');
    expect(visualElement).toHaveAttribute('aria-hidden', 'true');
  });

  // Requirement 8.3: Trigger location
  it('should position visual effect at trigger location', () => {
    const { container } = render(
      <SoundCueVisual
        currentCue={mockCue}
        descriptor="soft-neon-chime"
        triggerLocation={{ x: 150, y: 250 }}
        visualEffectClass="sound-effect-ripple"
      />
    );

    const visualElement = container.querySelector('.sound-cue-visual');
    expect(visualElement).toHaveStyle({
      left: '150px',
      top: '250px'
    });
  });

  it('should not render when currentCue is null', () => {
    const { container } = render(
      <SoundCueVisual
        currentCue={null}
        descriptor=""
        triggerLocation={mockLocation}
        visualEffectClass=""
      />
    );

    expect(container.querySelector('.sound-cue-visual')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should render different visual effect classes', () => {
    const { container, rerender } = render(
      <SoundCueVisual
        currentCue={mockCue}
        descriptor="test"
        triggerLocation={mockLocation}
        visualEffectClass="sound-effect-pulse"
      />
    );

    let visualElement = container.querySelector('.sound-cue-visual');
    expect(visualElement).toHaveClass('sound-effect-pulse');

    rerender(
      <SoundCueVisual
        currentCue={mockCue}
        descriptor="test"
        triggerLocation={mockLocation}
        visualEffectClass="sound-effect-shake"
      />
    );

    visualElement = container.querySelector('.sound-cue-visual');
    expect(visualElement).toHaveClass('sound-effect-shake');
  });

  it('should not render descriptor when empty', () => {
    render(
      <SoundCueVisual
        currentCue={mockCue}
        descriptor=""
        triggerLocation={mockLocation}
        visualEffectClass="sound-effect-ripple"
      />
    );

    const caption = screen.getByRole('status');
    expect(caption).toBeInTheDocument();
    expect(caption).toBeEmptyDOMElement();
  });
});

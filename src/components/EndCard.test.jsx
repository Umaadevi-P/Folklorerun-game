import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EndCard from './EndCard';

describe('EndCard Component', () => {
  const mockCreature = {
    id: 'baba-yaga',
    name: 'Baba Yaga',
    victoryText: 'The witch grants you passage. Her blessing burns warm in your chest, a gift of old magic.',
    defeatText: 'The forest swallows your path. Baba Yaga\'s laughter echoes through the birch trees, fading into mist.'
  };

  const mockUIConfig = {
    creatures: {
      'baba-yaga': {
        primaryColor: '#FFB84D',
        secondaryColor: '#FF8C42',
        fogColor: 'rgba(255, 184, 77, 0.3)'
      }
    }
  };

  const mockOnRestart = vi.fn();

  it('renders victory card with creature-specific blessing text', async () => {
    render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
      />
    );

    // Wait for animation to complete and content to appear
    await waitFor(() => {
      expect(screen.getByText('Defeated!')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(screen.getByText(mockCreature.victoryText)).toBeInTheDocument();
  });

  it('renders defeat card with creature-specific consequence text', async () => {
    render(
      <EndCard
        outcome="defeat"
        creature={mockCreature}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
      />
    );

    // Wait for animation to complete and content to appear
    await waitFor(() => {
      expect(screen.getByText('You Died')).toBeInTheDocument();
    }, { timeout: 1000 });
    
    expect(screen.getByText(mockCreature.defeatText)).toBeInTheDocument();
  });

  it('displays custom outcome text when provided', async () => {
    const customText = 'Custom ending text for testing purposes.';
    render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        outcomeText={customText}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
      />
    );

    // Wait for animation to complete
    await waitFor(() => {
      expect(screen.getByText(customText)).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(screen.queryByText(mockCreature.victoryText)).not.toBeInTheDocument();
  });

  it('renders restart button with click handler', async () => {
    const mockRestart = vi.fn();
    render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        onRestart={mockRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
      />
    );

    // Wait for animation to complete and buttons to appear
    const playAgainButton = await waitFor(() => {
      return screen.getByRole('button', { name: /play again/i });
    }, { timeout: 2000 });
    
    expect(playAgainButton).toBeInTheDocument();

    fireEvent.click(playAgainButton);
    expect(mockRestart).toHaveBeenCalledTimes(1);
  });

  it('applies creature-specific CSS classes', () => {
    const { container } = render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
      />
    );

    const endCard = container.querySelector('.end-card');
    expect(endCard).toHaveClass('end-card--victory');
    expect(endCard).toHaveClass('end-card--baba-yaga');
  });

  it('renders creature image with victory dissolve animation', () => {
    const { container } = render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
      />
    );

    expect(container.querySelector('.end-card-creature-image')).toBeInTheDocument();
    expect(container.querySelector('.victory-dissolve')).toBeInTheDocument();
    expect(container.querySelector('.victory-dissolve-overlay')).toBeInTheDocument();
  });

  it('renders defeat zoom animation with vignette', () => {
    const { container } = render(
      <EndCard
        outcome="defeat"
        creature={mockCreature}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
      />
    );

    expect(container.querySelector('.defeat-zoom')).toBeInTheDocument();
    expect(container.querySelector('.defeat-vignette')).toBeInTheDocument();
  });

  it('renders Aswang defeated image for victory', () => {
    const aswangCreature = {
      id: 'aswang',
      name: 'Aswang',
      victoryText: 'Victory text',
      defeatText: 'Defeat text'
    };

    const { container } = render(
      <EndCard
        outcome="victory"
        creature={aswangCreature}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
      />
    );

    const image = container.querySelector('.end-card-creature-image');
    expect(image).toHaveAttribute('src', '/assets/Aswang_defeated.jpg');
  });

  it('applies reduced motion class when reducedMotion is true', () => {
    const { container } = render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
        reducedMotion={true}
      />
    );

    const endCard = container.querySelector('.end-card');
    expect(endCard).toHaveClass('reduced-motion');
  });

  it('renders creature image for reduced motion', () => {
    const { container } = render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
        reducedMotion={true}
      />
    );

    // Image should still be rendered
    expect(container.querySelector('.end-card-creature-image')).toBeInTheDocument();
  });

  it('renders victory dissolve overlay', () => {
    const { container } = render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
        reducedMotion={false}
      />
    );

    expect(container.querySelector('.victory-dissolve-overlay')).toBeInTheDocument();
  });

  it('uses different animations for victory vs defeat', () => {
    const { container: victoryContainer } = render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
      />
    );

    const { container: defeatContainer } = render(
      <EndCard
        outcome="defeat"
        creature={mockCreature}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
      />
    );

    expect(victoryContainer.querySelector('.victory-dissolve')).toBeInTheDocument();
    expect(defeatContainer.querySelector('.defeat-zoom')).toBeInTheDocument();
  });

  it('returns null when creature is not provided', () => {
    const { container } = render(
      <EndCard
        outcome="victory"
        creature={null}
        onRestart={mockOnRestart}
        onHome={vi.fn()}
        uiConfig={mockUIConfig}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('returns null when outcome is not provided', () => {
    const { container } = render(
      <EndCard
        outcome={null}
        creature={mockCreature}
        onRestart={mockOnRestart}
        uiConfig={mockUIConfig}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('has proper ARIA attributes for accessibility', async () => {
    render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        onRestart={mockOnRestart}
        uiConfig={mockUIConfig}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'end-card-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'end-card-text');

    // Wait for animation to complete and buttons to appear
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    }, { timeout: 2000 });

    const playAgainButton = screen.getByRole('button', { name: /play again/i });
    expect(playAgainButton).toBeInTheDocument();
  });

  it('applies CSS variables from UI config', () => {
    const { container } = render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        onRestart={mockOnRestart}
        uiConfig={mockUIConfig}
      />
    );

    const endCard = container.querySelector('.end-card');
    const style = endCard.style;

    // New implementation uses fire color from creature-specific mapping
    expect(style.getPropertyValue('--fire-color')).toBe('#A67CFF'); // Baba Yaga purple
    expect(style.getPropertyValue('--creature-font')).toContain('Asimovian');
  });

  it('uses creature-specific fire colors', () => {
    const { container } = render(
      <EndCard
        outcome="victory"
        creature={mockCreature}
        onRestart={mockOnRestart}
        uiConfig={null}
      />
    );

    const endCard = container.querySelector('.end-card');
    const style = endCard.style;

    // Should use creature-specific fire color (Baba Yaga = purple)
    expect(style.getPropertyValue('--fire-color')).toBe('#A67CFF');
  });
});

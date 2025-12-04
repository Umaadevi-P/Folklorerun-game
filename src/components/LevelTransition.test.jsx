import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LevelTransition from './LevelTransition';

describe('LevelTransition', () => {
  const mockCreature = {
    id: 'baba-yaga',
    name: 'Baba Yaga'
  };

  it('renders level transition with correct level numbers', () => {
    const onComplete = vi.fn();
    render(
      <LevelTransition
        creature={mockCreature}
        fromLevel={0}
        toLevel={1}
        onComplete={onComplete}
      />
    );

    expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
  });

  it('calls onComplete after animation', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    
    render(
      <LevelTransition
        creature={mockCreature}
        fromLevel={0}
        toLevel={1}
        onComplete={onComplete}
      />
    );

    // Fast-forward through animation
    vi.advanceTimersByTime(4000);
    
    expect(onComplete).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('skips animation with reduced motion', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    
    render(
      <LevelTransition
        creature={mockCreature}
        fromLevel={0}
        toLevel={1}
        onComplete={onComplete}
        reducedMotion={true}
      />
    );

    // Should complete quickly with reduced motion
    vi.advanceTimersByTime(500);
    
    expect(onComplete).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('renders creature-specific obstacle for Baba Yaga', () => {
    render(
      <LevelTransition
        creature={mockCreature}
        fromLevel={0}
        toLevel={1}
        onComplete={vi.fn()}
      />
    );

    const obstacle = document.querySelector('.obstacle-branch');
    expect(obstacle).toBeInTheDocument();
  });

  it('renders creature-specific obstacle for Banshee', () => {
    const bansheeCreature = { id: 'banshee', name: 'Banshee' };
    
    render(
      <LevelTransition
        creature={bansheeCreature}
        fromLevel={0}
        toLevel={1}
        onComplete={vi.fn()}
      />
    );

    const obstacle = document.querySelector('.obstacle-ice');
    expect(obstacle).toBeInTheDocument();
  });

  it('renders creature-specific obstacle for Aswang', () => {
    const aswangCreature = { id: 'aswang', name: 'Aswang' };
    
    render(
      <LevelTransition
        creature={aswangCreature}
        fromLevel={0}
        toLevel={1}
        onComplete={vi.fn()}
      />
    );

    const obstacle = document.querySelector('.obstacle-fire');
    expect(obstacle).toBeInTheDocument();
  });
});

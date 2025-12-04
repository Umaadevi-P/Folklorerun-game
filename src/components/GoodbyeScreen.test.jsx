import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import GoodbyeScreen from './GoodbyeScreen';

describe('GoodbyeScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders goodbye message', () => {
    render(<GoodbyeScreen />);
    
    expect(screen.getByText('Happy Halloween!')).toBeInTheDocument();
    expect(screen.getByText(/Thanks for playing/i)).toBeInTheDocument();
    expect(screen.getByText(/See you next Halloween/i)).toBeInTheDocument();
  });

  it('displays pumpkin container', () => {
    const { container } = render(<GoodbyeScreen />);
    
    const pumpkinContainer = container.querySelector('.pumpkin-container');
    expect(pumpkinContainer).toBeInTheDocument();
  });

  it('has both happy and horror pumpkins', () => {
    const { container } = render(<GoodbyeScreen />);
    
    const happyPumpkin = container.querySelector('.happy-pumpkin');
    const horrorPumpkin = container.querySelector('.horror-pumpkin');
    
    expect(happyPumpkin).toBeInTheDocument();
    expect(horrorPumpkin).toBeInTheDocument();
  });

  it('starts with happy pumpkin visible', () => {
    const { container } = render(<GoodbyeScreen />);
    
    const pumpkinContainer = container.querySelector('.pumpkin-container');
    expect(pumpkinContainer).toHaveClass('happy');
  });

  it('initially shows happy pumpkin state', () => {
    const { container } = render(<GoodbyeScreen />);
    
    const pumpkinContainer = container.querySelector('.pumpkin-container');
    
    // Initially happy
    expect(pumpkinContainer).toHaveClass('happy');
    expect(pumpkinContainer).not.toHaveClass('horror');
  });
});

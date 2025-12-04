import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReducedMotionToggle from './ReducedMotionToggle';

describe('ReducedMotionToggle', () => {
  it('should render with animations on state', () => {
    const mockToggle = vi.fn();
    render(<ReducedMotionToggle reducedMotion={false} onToggle={mockToggle} />);
    
    expect(screen.getByText('Animations On')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should render with animations off state', () => {
    const mockToggle = vi.fn();
    render(<ReducedMotionToggle reducedMotion={true} onToggle={mockToggle} />);
    
    expect(screen.getByText('Animations Off')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('should call onToggle when clicked', () => {
    const mockToggle = vi.fn();
    render(<ReducedMotionToggle reducedMotion={false} onToggle={mockToggle} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('should have correct aria-label when animations are on', () => {
    const mockToggle = vi.fn();
    render(<ReducedMotionToggle reducedMotion={false} onToggle={mockToggle} />);
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Reduce motion');
  });

  it('should have correct aria-label when animations are off', () => {
    const mockToggle = vi.fn();
    render(<ReducedMotionToggle reducedMotion={true} onToggle={mockToggle} />);
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Enable animations');
  });

  it('should display correct icon for animations on', () => {
    const mockToggle = vi.fn();
    render(<ReducedMotionToggle reducedMotion={false} onToggle={mockToggle} />);
    
    expect(screen.getByText('⏸')).toBeInTheDocument();
  });

  it('should display correct icon for animations off', () => {
    const mockToggle = vi.fn();
    render(<ReducedMotionToggle reducedMotion={true} onToggle={mockToggle} />);
    
    expect(screen.getByText('▶')).toBeInTheDocument();
  });

  it('should be keyboard accessible', () => {
    const mockToggle = vi.fn();
    render(<ReducedMotionToggle reducedMotion={false} onToggle={mockToggle} />);
    
    const button = screen.getByRole('button');
    button.focus();
    
    expect(button).toHaveFocus();
  });
});

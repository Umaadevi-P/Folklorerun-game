import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AmbientEffects from './AmbientEffects';

describe('AmbientEffects', () => {
  it('renders nothing when reducedMotion is true', () => {
    const { container } = render(
      <AmbientEffects 
        creature="baba-yaga" 
        mode="static" 
        reducedMotion={true} 
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders static lanterns for Baba Yaga', () => {
    const { container } = render(
      <AmbientEffects 
        creature="baba-yaga" 
        mode="static" 
        reducedMotion={false} 
      />
    );
    const lanterns = container.querySelectorAll('.ambient-lantern.static');
    expect(lanterns.length).toBeGreaterThan(0);
  });

  it('renders static crystals for Banshee', () => {
    const { container } = render(
      <AmbientEffects 
        creature="banshee" 
        mode="static" 
        reducedMotion={false} 
      />
    );
    const crystals = container.querySelectorAll('.ambient-crystal.static');
    expect(crystals.length).toBeGreaterThan(0);
  });

  it('renders static fire for Aswang', () => {
    const { container } = render(
      <AmbientEffects 
        creature="aswang" 
        mode="static" 
        reducedMotion={false} 
      />
    );
    const fires = container.querySelectorAll('.ambient-fire.static');
    expect(fires.length).toBeGreaterThan(0);
  });

  it('renders flying elements when triggered', () => {
    const { container, rerender } = render(
      <AmbientEffects 
        creature="baba-yaga" 
        mode="flying" 
        trigger={false}
        reducedMotion={false} 
      />
    );
    
    // Initially no flying elements
    let flyingElements = container.querySelectorAll('.ambient-lantern.flying');
    expect(flyingElements.length).toBe(0);
    
    // Trigger flying animation
    rerender(
      <AmbientEffects 
        creature="baba-yaga" 
        mode="flying" 
        trigger={true}
        isCorrect={true}
        reducedMotion={false} 
      />
    );
    
    flyingElements = container.querySelectorAll('.ambient-lantern.flying');
    expect(flyingElements.length).toBeGreaterThan(0);
  });

  it('renders more flying elements for correct answers', () => {
    const { container: correctContainer } = render(
      <AmbientEffects 
        creature="baba-yaga" 
        mode="flying" 
        trigger={true}
        isCorrect={true}
        reducedMotion={false} 
      />
    );
    
    const { container: incorrectContainer } = render(
      <AmbientEffects 
        creature="baba-yaga" 
        mode="flying" 
        trigger={true}
        isCorrect={false}
        reducedMotion={false} 
      />
    );
    
    const correctCount = correctContainer.querySelectorAll('.ambient-lantern.flying').length;
    const incorrectCount = incorrectContainer.querySelectorAll('.ambient-lantern.flying').length;
    
    expect(correctCount).toBeGreaterThan(incorrectCount);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import CreatureSelection from './CreatureSelection';
import { fallbackCreatureData } from '../fallbackData';

describe('CreatureSelection Component', () => {
  const mockOnSelectCreature = vi.fn();

  it('displays three creature options', () => {
    render(
      <CreatureSelection 
        gameData={fallbackCreatureData} 
        onSelectCreature={mockOnSelectCreature}
      />
    );

    // Requirement 2.1: Display three creature options
    expect(screen.getByText('Baba Yaga')).toBeInTheDocument();
    expect(screen.getByText('Banshee')).toBeInTheDocument();
    expect(screen.getByText('Aswang')).toBeInTheDocument();
  });

  it('displays creature descriptions', () => {
    render(
      <CreatureSelection 
        gameData={fallbackCreatureData} 
        onSelectCreature={mockOnSelectCreature}
      />
    );

    // Requirement 2.2: Small description on each card
    expect(screen.getByText('Answer her riddles with wit and wisdom')).toBeInTheDocument();
    expect(screen.getByText('Soothe her sorrow with gentle words')).toBeInTheDocument();
    expect(screen.getByText('Unmask the creature before it strikes')).toBeInTheDocument();
  });

  it('handles creature selection with click', () => {
    render(
      <CreatureSelection 
        gameData={fallbackCreatureData} 
        onSelectCreature={mockOnSelectCreature}
      />
    );

    const babaYagaCard = screen.getByRole('button', { name: /Select Baba Yaga/i });
    fireEvent.click(babaYagaCard);

    // Requirement 2.3: Click handler loads creature data and starts audio
    expect(mockOnSelectCreature).toHaveBeenCalledWith('baba-yaga');
  });

  it('supports keyboard navigation with Enter key', () => {
    render(
      <CreatureSelection 
        gameData={fallbackCreatureData} 
        onSelectCreature={mockOnSelectCreature}
      />
    );

    const bansheeCard = screen.getByRole('button', { name: /Select Banshee/i });
    bansheeCard.focus();
    
    // Keyboard navigation support
    fireEvent.keyDown(bansheeCard, { key: 'Enter' });

    expect(mockOnSelectCreature).toHaveBeenCalledWith('banshee');
  });

  it('supports keyboard navigation with Space key', () => {
    render(
      <CreatureSelection 
        gameData={fallbackCreatureData} 
        onSelectCreature={mockOnSelectCreature}
      />
    );

    const aswangCard = screen.getByRole('button', { name: /Select Aswang/i });
    aswangCard.focus();
    
    // Keyboard navigation support
    fireEvent.keyDown(aswangCard, { key: ' ' });

    expect(mockOnSelectCreature).toHaveBeenCalledWith('aswang');
  });

  it('has proper ARIA labels for accessibility', () => {
    render(
      <CreatureSelection 
        gameData={fallbackCreatureData} 
        onSelectCreature={mockOnSelectCreature}
      />
    );

    expect(screen.getByRole('button', { name: /Select Baba Yaga/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select Banshee/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select Aswang/i })).toBeInTheDocument();
  });

  it('handles missing game data gracefully', () => {
    render(
      <CreatureSelection 
        gameData={null} 
        onSelectCreature={mockOnSelectCreature}
      />
    );

    expect(screen.getByText('Loading creatures...')).toBeInTheDocument();
  });

  // Feature: folklorerun-game, Property 2: Creature selection loads correct data
  // Validates: Requirements 2.3, 2.4
  it('property: creature selection loads correct data', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('baba-yaga', 'banshee', 'aswang'),
        (creatureId) => {
          const mockCallback = vi.fn();
          
          // Find the creature in the fallback data
          const selectedCreature = fallbackCreatureData.creatures.find(
            c => c.id === creatureId
          );
          
          // Render the component
          const { unmount } = render(
            <CreatureSelection 
              gameData={fallbackCreatureData} 
              onSelectCreature={mockCallback}
            />
          );

          // Property: The creature name should be displayed before selection
          const creatureName = screen.getByText(selectedCreature.name);
          expect(creatureName).toBeInTheDocument();

          // Find and click the creature card
          const creatureCard = screen.getByRole('button', { 
            name: new RegExp(`Select ${selectedCreature.name}`, 'i') 
          });
          fireEvent.click(creatureCard);

          // Property: The callback should be called with the correct creature ID
          expect(mockCallback).toHaveBeenCalledWith(creatureId);

          // Cleanup
          unmount();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

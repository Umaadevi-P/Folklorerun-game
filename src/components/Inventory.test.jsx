import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Inventory from './Inventory';

describe('Inventory Component', () => {
  const mockUIConfig = {
    creatures: {
      'baba-yaga': {
        primaryColor: '#FFB84D',
        secondaryColor: '#FF8C42'
      },
      'banshee': {
        primaryColor: '#B8D4E8',
        secondaryColor: '#7BA8C7'
      },
      'aswang': {
        primaryColor: '#D32F2F',
        secondaryColor: '#8B0000'
      }
    }
  };

  describe('Baba Yaga Riddle Interface', () => {
    const babaYagaCreature = {
      id: 'baba-yaga',
      name: 'Baba Yaga',
      coreMechanic: 'riddle'
    };

    const riddleLevelData = {
      riddleData: {
        riddle: 'What walks on four legs at dawn, two at noon, and three at dusk?',
        hint: 'Think of life\'s stages, from cradle to grave.',
        answerKey: 'human'
      }
    };

    it('should render riddle interface for Baba Yaga', () => {
      render(
        <Inventory
          creature={babaYagaCreature}
          mechanicState={{ hintsRevealed: 0 }}
          onMechanicUpdate={vi.fn()}
          levelData={riddleLevelData}
          uiConfig={mockUIConfig}
        />
      );

      expect(screen.getByText('Baba Yaga\'s Riddle')).toBeInTheDocument();
      expect(screen.getByText(riddleLevelData.riddleData.riddle)).toBeInTheDocument();
    });

    it('should accept correct answer', async () => {
      render(
        <Inventory
          creature={babaYagaCreature}
          mechanicState={{ hintsRevealed: 0 }}
          onMechanicUpdate={vi.fn()}
          levelData={riddleLevelData}
          uiConfig={mockUIConfig}
        />
      );

      const input = screen.getByPlaceholderText('Speak your answer...');
      const submitButton = screen.getByText('Answer');

      fireEvent.change(input, { target: { value: 'human' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Correct/i)).toBeInTheDocument();
      });
    });

    it('should reveal hint after incorrect answer', async () => {
      const onMechanicUpdate = vi.fn();
      
      render(
        <Inventory
          creature={babaYagaCreature}
          mechanicState={{ hintsRevealed: 0 }}
          onMechanicUpdate={onMechanicUpdate}
          levelData={riddleLevelData}
          uiConfig={mockUIConfig}
        />
      );

      const input = screen.getByPlaceholderText('Speak your answer...');
      const submitButton = screen.getByText('Answer');

      fireEvent.change(input, { target: { value: 'wrong answer' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Incorrect/i)).toBeInTheDocument();
      });

      // Wait for hint to appear
      await waitFor(() => {
        expect(screen.getByText(riddleLevelData.riddleData.hint)).toBeInTheDocument();
      }, { timeout: 1000 });

      expect(onMechanicUpdate).toHaveBeenCalledWith({ hintsRevealed: 1 });
    });

    it('should display hints counter', () => {
      render(
        <Inventory
          creature={babaYagaCreature}
          mechanicState={{ hintsRevealed: 2 }}
          onMechanicUpdate={vi.fn()}
          levelData={riddleLevelData}
          uiConfig={mockUIConfig}
        />
      );

      expect(screen.getByText('Hints revealed: 2')).toBeInTheDocument();
    });
  });

  describe('Banshee Calmness Meter', () => {
    const bansheeCreature = {
      id: 'banshee',
      name: 'Banshee',
      coreMechanic: 'calmness'
    };

    it('should render calmness meter for Banshee', () => {
      render(
        <Inventory
          creature={bansheeCreature}
          mechanicState={{ calmnessLevel: 100 }}
          onMechanicUpdate={vi.fn()}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      expect(screen.getByText('Banshee\'s Sorrow')).toBeInTheDocument();
      const moodIndicator = screen.getByText('Peaceful', { selector: '.mood-indicator' });
      expect(moodIndicator).toBeInTheDocument();
    });

    it('should display correct mood for high calmness', () => {
      render(
        <Inventory
          creature={bansheeCreature}
          mechanicState={{ calmnessLevel: 80 }}
          onMechanicUpdate={vi.fn()}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      const moodIndicator = screen.getByText('Peaceful', { selector: '.mood-indicator' });
      expect(moodIndicator).toBeInTheDocument();
    });

    it('should display correct mood for medium calmness', () => {
      render(
        <Inventory
          creature={bansheeCreature}
          mechanicState={{ calmnessLevel: 50 }}
          onMechanicUpdate={vi.fn()}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      expect(screen.getByText('Sorrowful')).toBeInTheDocument();
    });

    it('should display correct mood for low calmness', () => {
      render(
        <Inventory
          creature={bansheeCreature}
          mechanicState={{ calmnessLevel: 20 }}
          onMechanicUpdate={vi.fn()}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      const moodIndicator = screen.getByText('Anguished', { selector: '.mood-indicator' });
      expect(moodIndicator).toBeInTheDocument();
    });

    it('should display calmness percentage', () => {
      render(
        <Inventory
          creature={bansheeCreature}
          mechanicState={{ calmnessLevel: 65 }}
          onMechanicUpdate={vi.fn()}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      expect(screen.getByText('65%')).toBeInTheDocument();
    });

    it('should clamp calmness level to valid range', () => {
      render(
        <Inventory
          creature={bansheeCreature}
          mechanicState={{ calmnessLevel: 150 }}
          onMechanicUpdate={vi.fn()}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Aswang Deduction System', () => {
    const aswangCreature = {
      id: 'aswang',
      name: 'Aswang',
      coreMechanic: 'deduction'
    };

    it('should render deduction system for Aswang', () => {
      render(
        <Inventory
          creature={aswangCreature}
          mechanicState={{ tokensCollected: [] }}
          onMechanicUpdate={vi.fn()}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      expect(screen.getByText('Aswang Deduction')).toBeInTheDocument();
      expect(screen.getByText('0 / 6 clues')).toBeInTheDocument();
    });

    it('should collect tokens when clicked', () => {
      const onMechanicUpdate = vi.fn();
      
      render(
        <Inventory
          creature={aswangCreature}
          mechanicState={{ tokensCollected: [] }}
          onMechanicUpdate={onMechanicUpdate}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      const tokenButton = screen.getByLabelText(/Reversed Reflection/i);
      fireEvent.click(tokenButton);

      expect(onMechanicUpdate).toHaveBeenCalledWith({
        tokensCollected: ['reversed-reflection']
      });
    });

    it('should toggle token collection', () => {
      const onMechanicUpdate = vi.fn();
      
      render(
        <Inventory
          creature={aswangCreature}
          mechanicState={{ tokensCollected: ['reversed-reflection'] }}
          onMechanicUpdate={onMechanicUpdate}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      const tokenButton = screen.getByLabelText(/Reversed Reflection/i);
      fireEvent.click(tokenButton);

      expect(onMechanicUpdate).toHaveBeenCalledWith({
        tokensCollected: []
      });
    });

    it('should validate correct combination', () => {
      render(
        <Inventory
          creature={aswangCreature}
          mechanicState={{ tokensCollected: ['reversed-reflection', 'no-shadow'] }}
          onMechanicUpdate={vi.fn()}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      expect(screen.getByText(/Valid combination/i)).toBeInTheDocument();
    });

    it('should show invalid status for incomplete combination', () => {
      render(
        <Inventory
          creature={aswangCreature}
          mechanicState={{ tokensCollected: ['reversed-reflection', 'salt-reaction'] }}
          onMechanicUpdate={vi.fn()}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      expect(screen.getByText(/Keep searching/i)).toBeInTheDocument();
    });

    it('should update token count display', () => {
      render(
        <Inventory
          creature={aswangCreature}
          mechanicState={{ tokensCollected: ['reversed-reflection', 'no-shadow', 'salt-reaction'] }}
          onMechanicUpdate={vi.fn()}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      expect(screen.getByText('3 / 6 clues')).toBeInTheDocument();
    });
  });

  describe('General Behavior', () => {
    it('should return null when no creature is provided', () => {
      const { container } = render(
        <Inventory
          creature={null}
          mechanicState={{}}
          onMechanicUpdate={vi.fn()}
          levelData={null}
          uiConfig={mockUIConfig}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should apply creature-specific colors', () => {
      const babaYagaCreature = {
        id: 'baba-yaga',
        name: 'Baba Yaga',
        coreMechanic: 'riddle'
      };

      const { container } = render(
        <Inventory
          creature={babaYagaCreature}
          mechanicState={{ hintsRevealed: 0 }}
          onMechanicUpdate={vi.fn()}
          levelData={{
            riddleData: {
              riddle: 'Test riddle',
              hint: 'Test hint',
              answerKey: 'test'
            }
          }}
          uiConfig={mockUIConfig}
        />
      );

      const inventory = container.querySelector('.inventory');
      expect(inventory).toHaveStyle({
        '--creature-primary': '#FFB84D',
        '--creature-secondary': '#FF8C42'
      });
    });
  });
});

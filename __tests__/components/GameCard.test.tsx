import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameCard } from '@/components/game-card';

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

// Mock the game data
const mockGame = {
  id: 'test-game-1',
  title: 'Test Journey',
  description: 'A test journey for couples',
  creatorName: 'Test Creator',
  partnerNameHint: 'Test Partner',
  truths: [],
  dares: [],
  secrets: [],
  memories: [],
  romanticSentences: [],
  guessingQuestions: [],
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  version: 1,
  published: false,
  visibility: 'private' as const,
};

describe('GameCard', () => {
  it('renders game title and description', () => {
    render(<GameCard game={mockGame} onClick={() => {}} />);
    
    expect(screen.getByText('Test Journey')).toBeInTheDocument();
    expect(screen.getByText('A test journey for couples')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<GameCard game={mockGame} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    card.click();
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays creator name when provided', () => {
    render(<GameCard game={mockGame} onClick={() => {}} />);
    
    expect(screen.getByText('Test Creator')).toBeInTheDocument();
  });

  it('shows copy button for published games with slug', () => {
    const publishedGame = {
      ...mockGame,
      published: true,
      slug: 'test-slug-123',
    };
    
    render(<GameCard game={publishedGame} onClick={() => {}} />);
    
    const copyButton = screen.getByLabelText('Copy shareable link to clipboard');
    expect(copyButton).toBeInTheDocument();
  });

  it('does not show copy button for unpublished games', () => {
    render(<GameCard game={mockGame} onClick={() => {}} />);
    
    const copyButton = screen.queryByLabelText('Copy shareable link to clipboard');
    expect(copyButton).not.toBeInTheDocument();
  });

  it('copies link to clipboard when copy button is clicked', async () => {
    const publishedGame = {
      ...mockGame,
      published: true,
      slug: 'test-slug-123',
    };
    
    render(<GameCard game={publishedGame} onClick={() => {}} />);
    
    const copyButton = screen.getByLabelText('Copy shareable link to clipboard');
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('/play/test-slug-123')
      );
    });
  });
});

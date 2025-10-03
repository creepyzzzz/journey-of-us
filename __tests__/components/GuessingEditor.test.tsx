import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GuessingEditor } from '@/components/editor/guessing-editor';
import { useSupabaseGameStore } from '@/lib/supabase-store';

// Mock the Supabase store
jest.mock('@/lib/supabase-store', () => ({
  useSupabaseGameStore: jest.fn(),
}));

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

const mockUpdateGame = jest.fn();
const mockCurrentGame = {
  id: 'test-game-1',
  title: 'Test Journey',
  guessingQuestions: [],
};

describe('GuessingEditor', () => {
  beforeEach(() => {
    (useSupabaseGameStore as jest.Mock).mockReturnValue({
      currentGame: mockCurrentGame,
      updateGame: mockUpdateGame,
    });
    mockUpdateGame.mockClear();
  });

  it('renders the guessing editor', () => {
    render(<GuessingEditor />);
    
    expect(screen.getByPlaceholderText("What's my favorite color?")).toBeInTheDocument();
    expect(screen.getByText('Add Question')).toBeInTheDocument();
  });

  it('allows creating multiple choice questions with correct answer selection', async () => {
    render(<GuessingEditor />);
    
    // Fill in question text
    const questionInput = screen.getByPlaceholderText("What's my favorite color?");
    fireEvent.change(questionInput, { target: { value: 'What is my favorite color?' } });
    
    // Select multiple choice type
    const typeSelect = screen.getByDisplayValue('Text Answer');
    fireEvent.click(typeSelect);
    
    // Wait for dropdown to appear and select multiple choice
    await waitFor(() => {
      const multipleChoiceOption = screen.getByText('Multiple Choice');
      fireEvent.click(multipleChoiceOption);
    });
    
    // Add choices
    const addChoiceButton = screen.getByText('Add Choice');
    fireEvent.click(addChoiceButton);
    fireEvent.click(addChoiceButton);
    fireEvent.click(addChoiceButton);
    
    // Fill in choices
    const choiceInputs = screen.getAllByPlaceholderText(/Choice \d+/);
    fireEvent.change(choiceInputs[0], { target: { value: 'Blue' } });
    fireEvent.change(choiceInputs[1], { target: { value: 'Red' } });
    fireEvent.change(choiceInputs[2], { target: { value: 'Green' } });
    
    // Select correct answer (Blue - first choice)
    const correctRadioButtons = screen.getAllByLabelText('Correct');
    fireEvent.click(correctRadioButtons[0]);
    
    // Verify correct answer is displayed
    await waitFor(() => {
      expect(screen.getByText('Correct answer: "Blue"')).toBeInTheDocument();
    });
    
    // Add the question
    const addButton = screen.getByText('Add Question');
    fireEvent.click(addButton);
    
    // Verify the question was added with correct answer selection
    await waitFor(() => {
      expect(mockUpdateGame).toHaveBeenCalledWith({
        guessingQuestions: [
          {
            id: expect.any(String),
            label: 'What is my favorite color?',
            type: 'choice',
            creatorAnswer: '',
            choices: ['Blue', 'Red', 'Green'],
            correctChoiceIndex: 0, // Blue is the correct answer
          },
        ],
      });
    });
  });

  it('handles editing existing multiple choice questions with correct answer', async () => {
    const existingQuestion = {
      id: 'existing-question-1',
      label: 'What is my favorite color?',
      type: 'choice' as const,
      choices: ['Blue', 'Red', 'Green'],
      correctChoiceIndex: 0,
      creatorAnswer: '',
    };

    (useSupabaseGameStore as jest.Mock).mockReturnValue({
      currentGame: {
        ...mockCurrentGame,
        guessingQuestions: [existingQuestion],
      },
      updateGame: mockUpdateGame,
    });

    render(<GuessingEditor />);
    
    // Click edit button
    const editButton = screen.getByLabelText('Edit question');
    fireEvent.click(editButton);
    
    // Verify the correct answer is pre-selected
    await waitFor(() => {
      const correctRadioButtons = screen.getAllByLabelText('Correct');
      expect(correctRadioButtons[0]).toBeChecked();
    });
    
    // Change correct answer to Red (second choice)
    const correctRadioButtons = screen.getAllByLabelText('Correct');
    fireEvent.click(correctRadioButtons[1]);
    
    // Verify correct answer is updated
    await waitFor(() => {
      expect(screen.getByText('Correct answer: "Red"')).toBeInTheDocument();
    });
    
    // Save the changes
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Verify the question was updated with new correct answer
    await waitFor(() => {
      expect(mockUpdateGame).toHaveBeenCalledWith({
        guessingQuestions: [
          {
            ...existingQuestion,
            correctChoiceIndex: 1, // Red is now the correct answer
          },
        ],
      });
    });
  });

  it('displays correct answer in read mode', () => {
    const existingQuestion = {
      id: 'existing-question-1',
      label: 'What is my favorite color?',
      type: 'choice' as const,
      choices: ['Blue', 'Red', 'Green'],
      correctChoiceIndex: 2, // Green is correct
      creatorAnswer: '',
    };

    (useSupabaseGameStore as jest.Mock).mockReturnValue({
      currentGame: {
        ...mockCurrentGame,
        guessingQuestions: [existingQuestion],
      },
      updateGame: mockUpdateGame,
    });

    render(<GuessingEditor />);
    
    // Verify the correct answer is highlighted
    expect(screen.getByText('Green')).toHaveClass('bg-green-100');
    expect(screen.getByText('✓ Correct answer: Green')).toBeInTheDocument();
  });

  it('handles removing choices and adjusts correct answer index', async () => {
    const existingQuestion = {
      id: 'existing-question-1',
      label: 'What is my favorite color?',
      type: 'choice' as const,
      choices: ['Blue', 'Red', 'Green'],
      correctChoiceIndex: 1, // Red is correct
      creatorAnswer: '',
    };

    (useSupabaseGameStore as jest.Mock).mockReturnValue({
      currentGame: {
        ...mockCurrentGame,
        guessingQuestions: [existingQuestion],
      },
      updateGame: mockUpdateGame,
    });

    render(<GuessingEditor />);
    
    // Click edit button
    const editButton = screen.getByLabelText('Edit question');
    fireEvent.click(editButton);
    
    // Remove the first choice (Blue)
    const deleteButtons = screen.getAllByLabelText('Delete choice');
    fireEvent.click(deleteButtons[0]);
    
    // Save the changes
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    // Verify the correct answer index was adjusted (Red is now at index 0)
    await waitFor(() => {
      expect(mockUpdateGame).toHaveBeenCalledWith({
        guessingQuestions: [
          {
            ...existingQuestion,
            choices: ['Red', 'Green'],
            correctChoiceIndex: 0, // Red is now at index 0
          },
        ],
      });
    });
  });
});

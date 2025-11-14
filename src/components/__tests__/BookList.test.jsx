import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookList from '../BookList';

describe('BookList Component', () => {
  const mockBooks = [
    {
      id: 1,
      title: 'Book One',
      description: 'Description for book one',
      imageUrl: 'https://example.com/book1.jpg',
    },
    {
      id: 2,
      title: 'Book Two',
      description: 'Description for book two',
      imageUrl: 'https://example.com/book2.jpg',
    },
  ];

  describe('Rendering', () => {
    it('should render the header with correct title', () => {
      render(<BookList initialBooks={mockBooks} />);
      
      expect(screen.getByRole('heading', { name: /book collection/i, level: 1 })).toBeInTheDocument();
    });

    it('should display the correct number of books', () => {
      render(<BookList initialBooks={mockBooks} />);
      
      expect(screen.getByText(`Showing ${mockBooks.length} books`)).toBeInTheDocument();
    });

    it('should render all provided books', () => {
      render(<BookList initialBooks={mockBooks} />);
      
      mockBooks.forEach((book) => {
        expect(screen.getByRole('heading', { name: book.title, level: 2 })).toBeInTheDocument();
      });
    });

    it('should render "Add New Book" button', () => {
      render(<BookList initialBooks={mockBooks} />);
      
      const button = screen.getByRole('button', { name: /add a new book to the collection/i });
      expect(button).toBeInTheDocument();
    });

    it('should display empty state when no books are provided', () => {
      render(<BookList initialBooks={[]} />);
      
      expect(screen.getByText(/no books yet/i)).toBeInTheDocument();
      expect(screen.getByText(/get started by adding your first book/i)).toBeInTheDocument();
    });

    it('should handle undefined initialBooks prop', () => {
      render(<BookList />);
      
      expect(screen.getByText(/no books yet/i)).toBeInTheDocument();
    });
  });

  describe('Add Book Functionality', () => {
    it('should open modal when "Add New Book" button is clicked', async () => {
      const user = userEvent.setup();
      render(<BookList initialBooks={mockBooks} />);
      
      const addButton = screen.getByRole('button', { name: /add a new book to the collection/i });
      await user.click(addButton);
      
      // Verify modal is open
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Add New Book')).toBeInTheDocument();
    });

    it('should add a new book when form is submitted with valid data', async () => {
      const user = userEvent.setup();
      render(<BookList initialBooks={mockBooks} />);
      
      // Open modal
      const addButton = screen.getByRole('button', { name: /add a new book to the collection/i });
      await user.click(addButton);
      
      // Fill form
      await user.type(screen.getByLabelText(/title/i), 'New Test Book');
      await user.type(screen.getByLabelText(/description/i), 'Test description');
      await user.type(screen.getByLabelText(/image url/i), 'https://example.com/image.jpg');
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /^add book$/i }));
      
      // Verify book was added
      expect(screen.getByRole('heading', { name: 'New Test Book', level: 2 })).toBeInTheDocument();
      expect(screen.getByText(`Showing ${mockBooks.length + 1} books`)).toBeInTheDocument();
      
      // Verify modal is closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should show validation error when title is empty', async () => {
      const user = userEvent.setup();
      render(<BookList initialBooks={[]} />);
      
      // Open modal
      const addButton = screen.getByRole('button', { name: /add a new book to the collection/i });
      await user.click(addButton);
      
      // Try to submit without filling title
      await user.click(screen.getByRole('button', { name: /^add book$/i }));
      
      // Verify error message
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      
      // Verify book was not added
      expect(screen.getByText(/no books yet/i)).toBeInTheDocument();
    });

    it('should close modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<BookList initialBooks={mockBooks} />);
      
      // Open modal
      const addButton = screen.getByRole('button', { name: /add a new book to the collection/i });
      await user.click(addButton);
      
      // Click cancel
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      
      // Verify modal is closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should add book with only title (description and image optional)', async () => {
      const user = userEvent.setup();
      render(<BookList initialBooks={[]} />);
      
      // Open modal
      const addButton = screen.getByRole('button', { name: /add a new book to the collection/i });
      await user.click(addButton);
      
      // Only fill title
      await user.type(screen.getByLabelText(/title/i), 'Minimal Book');
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /^add book$/i }));
      
      // Verify book was added
      expect(screen.getByRole('heading', { name: 'Minimal Book', level: 2 })).toBeInTheDocument();
    });

    it('should transition from empty state to showing books', async () => {
      const user = userEvent.setup();
      render(<BookList initialBooks={[]} />);
      
      // Verify empty state
      expect(screen.getByText(/no books yet/i)).toBeInTheDocument();
      
      // Open modal and add book
      const addButton = screen.getByRole('button', { name: /add a new book to the collection/i });
      await user.click(addButton);
      
      await user.type(screen.getByLabelText(/title/i), 'First Book');
      await user.click(screen.getByRole('button', { name: /^add book$/i }));
      
      // Verify empty state is gone
      expect(screen.queryByText(/no books yet/i)).not.toBeInTheDocument();
      
      // Verify book is shown
      expect(screen.getByRole('heading', { name: 'First Book', level: 2 })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<BookList initialBooks={mockBooks} />);
      
      expect(screen.getByRole('button', { name: /add a new book to the collection/i })).toBeInTheDocument();
      expect(screen.getByRole('list', { name: /list of books/i })).toBeInTheDocument();
    });

    it('should have proper empty state with role status', () => {
      render(<BookList initialBooks={[]} />);
      
      const emptyState = screen.getByRole('status');
      expect(emptyState).toBeInTheDocument();
      expect(emptyState).toHaveAttribute('aria-live', 'polite');
    });

    it('should display singular "book" when count is 1', async () => {
      const user = userEvent.setup();
      render(<BookList initialBooks={[]} />);
      
      const addButton = screen.getByRole('button', { name: /add a new book to the collection/i });
      await user.click(addButton);
      
      expect(screen.getByText('Showing 1 book')).toBeInTheDocument();
    });

    it('should display plural "books" when count is not 1', () => {
      render(<BookList initialBooks={mockBooks} />);
      
      expect(screen.getByText(`Showing ${mockBooks.length} books`)).toBeInTheDocument();
    });
  });
});


import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookItem from '../BookItem';

describe('BookItem Component', () => {
  const mockBook = {
    id: 1,
    title: 'Test Book Title',
    description: 'Test book description with some details about the book.',
    imageUrl: 'https://example.com/book-cover.jpg',
  };

  describe('Rendering', () => {
    it('should render the book title correctly', () => {
      render(<BookItem title={mockBook.title} />);
      
      const title = screen.getByRole('heading', { name: mockBook.title });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(mockBook.title);
    });

    it('should render the book image with correct alt text', () => {
      render(<BookItem title={mockBook.title} imageUrl={mockBook.imageUrl} />);
      
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockBook.imageUrl);
      expect(image).toHaveAttribute('alt', `Cover of ${mockBook.title}`);
    });

    it('should display placeholder image when imageUrl is not provided', () => {
      render(<BookItem title={mockBook.title} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Book cover placeholder');
      expect(image.src).toContain('placeholder');
    });

    it('should render "Show Description" button when description is provided', () => {
      render(<BookItem title={mockBook.title} description={mockBook.description} />);
      
      const button = screen.getByRole('button', { name: /show description/i });
      expect(button).toBeInTheDocument();
    });

    it('should not render toggle button when description is not provided', () => {
      render(<BookItem title={mockBook.title} />);
      
      const button = screen.queryByRole('button', { name: /show description/i });
      expect(button).not.toBeInTheDocument();
    });

    it('should display "No description available" message when description is missing', () => {
      render(<BookItem title={mockBook.title} />);
      
      expect(screen.getByText(/no description available/i)).toBeInTheDocument();
    });
  });

  describe('Toggle Functionality', () => {
    it('should initially hide the description', () => {
      render(<BookItem title={mockBook.title} description={mockBook.description} />);
      
      const button = screen.getByRole('button', { name: /show description/i });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should show description when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<BookItem title={mockBook.title} description={mockBook.description} />);
      
      const button = screen.getByRole('button', { name: /show description/i });
      await user.click(button);
      
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText(mockBook.description)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /hide description/i })).toBeInTheDocument();
    });

    it('should hide description when toggle button is clicked again', async () => {
      const user = userEvent.setup();
      render(<BookItem title={mockBook.title} description={mockBook.description} />);
      
      const button = screen.getByRole('button', { name: /show description/i });
      
      // Show description
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      
      // Hide description
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should toggle description multiple times', async () => {
      const user = userEvent.setup();
      render(<BookItem title={mockBook.title} description={mockBook.description} />);
      
      const button = screen.getByRole('button', { name: /show description/i });
      
      // Toggle multiple times
      await user.click(button); // Show
      expect(button).toHaveAttribute('aria-expanded', 'true');
      
      await user.click(button); // Hide
      expect(button).toHaveAttribute('aria-expanded', 'false');
      
      await user.click(button); // Show again
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Image Error Handling', () => {
    it('should display placeholder image when image fails to load', () => {
      render(<BookItem title={mockBook.title} imageUrl="invalid-url.jpg" />);
      
      const image = screen.getByRole('img');
      
      // Simulate image error
      fireEvent.error(image);
      
      expect(image.src).toContain('placeholder');
      expect(image).toHaveAttribute('alt', 'Book cover placeholder');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <BookItem 
          title={mockBook.title} 
          description={mockBook.description}
          id={mockBook.id}
        />
      );
      
      const article = screen.getByRole('article');
      expect(article).toHaveAttribute('aria-label', `Book: ${mockBook.title}`);
      
      const button = screen.getByRole('button', { name: /show description/i });
      expect(button).toHaveAttribute('aria-expanded');
      expect(button).toHaveAttribute('aria-controls');
    });

    it('should have proper heading hierarchy', () => {
      render(<BookItem title={mockBook.title} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(mockBook.title);
    });

    it('should have lazy loading on images', () => {
      render(<BookItem title={mockBook.title} imageUrl={mockBook.imageUrl} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('PropTypes', () => {
    it('should render correctly with all props provided', () => {
      const { container } = render(
        <BookItem
          id={mockBook.id}
          title={mockBook.title}
          description={mockBook.description}
          imageUrl={mockBook.imageUrl}
        />
      );
      
      expect(container).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: mockBook.title })).toBeInTheDocument();
    });

    it('should render correctly with only required props', () => {
      const { container } = render(<BookItem title={mockBook.title} />);
      
      expect(container).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: mockBook.title })).toBeInTheDocument();
    });
  });
});


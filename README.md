# React Book List Component

A reusable React component for displaying a collection of books with toggle descriptions, dynamic book additions, and full accessibility support.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

## Features

- 📚 Display books with title, description, and optional images
- ➕ Add new books via modal form with validation
- 🔄 Dynamic list updates in real-time
- 👁️ Toggle show/hide descriptions
- ♿ WCAG compliant accessibility
- 🎨 Modern UI with Tailwind CSS
- ✅ Comprehensive test coverage

## Usage

### BookItem Component

Displays a single book with interactive features.

```jsx
import BookItem from './components/BookItem';

<BookItem
  title="The Great Gatsby"
  description="A classic American novel..."
  imageUrl="https://picsum.photos/150/200"
/>
```

**Props:**
- `title` (required): Book title
- `description` (optional): Book description
- `imageUrl` (optional): Cover image URL
- `id` (optional): Unique identifier

### BookList Component

Container that manages multiple books with add functionality.

```jsx
import BookList from './components/BookList';

const books = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    description: "A novel about racial injustice...",
    imageUrl: "https://picsum.photos/seed/mockingbird/150/200"
  }
];

<BookList initialBooks={books} />
```

**Props:**
- `initialBooks` (optional): Initial array of book objects (default: `[]`)

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Vitest + React Testing Library
- [Lorem Picsum](https://picsum.photos/) for placeholder images

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm test         # Run tests
npm run test:ui  # Run tests with UI
```


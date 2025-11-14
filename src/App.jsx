import BookList from './components/BookList';
import { mockBooks } from './data/mockBooks';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <BookList initialBooks={mockBooks} />
    </div>
  );
}

export default App;


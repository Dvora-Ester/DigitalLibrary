import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import Book from './Book';
import '../styleSheets/BookStore.css';
import Home from './Home';

function BeAbleBook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');

  const navigate = useNavigate();

  const rawUser = localStorage.getItem('CurrentUser');
  let currentUser = null;

  try {
    currentUser = rawUser ? JSON.parse(rawUser) : null;
  } catch (e) {
    console.error("Invalid JSON in CurrentUser:", e);
  }

  useEffect(() => {
    if (!currentUser?.token) return;

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/books/getByStatusAndUserId/approved`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json',
          }
        });

        if (res.status === 401) {
          alert("Expired or invalid token. Redirecting to login.");
          navigate('/login');
          return;
        }

        if (!res.ok) {
          throw new Error('Server returned status ' + res.status);
        }

        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load books: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [navigate]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleApprove = (bookIdToRemove) => {
    setBooks(prevBooks => prevBooks.filter(b => b.Id !== bookIdToRemove));
  };

  const filteredBooks = useMemo(() => {
    return books.filter(book =>
      book.Book_Name?.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [books, filterText]);

  return (
    <div className="bookStorePage">
      <Home />
      <div className="bookstore-container">
        <div className="bookstore-header">
          <h2>Books Offered Store</h2>
          <div className="filters">
            <input
              className="sorters"
              type="text"
              placeholder="Search by name..."
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </div>
        </div>

        <div className="books-grid">
          {filteredBooks.map(book => (
            <Book
              key={book.Id}
              book={book}
              commingFrom="BuyOfferedBooks"
              onApprove={handleApprove}
            />
          ))}
        </div>

        {loading && <p className="loading-message">Loading books...</p>}

        {!loading && filteredBooks.length === 0 && (
          <p className='red-message'>No Available books</p>
        )}

        {error && <p className="error-message red-message">{error}</p>}
      </div>
    </div>
  );
}

export default BeAbleBook;

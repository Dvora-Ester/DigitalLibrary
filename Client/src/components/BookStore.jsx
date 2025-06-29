import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import Book from './Book';
import '../styleSheets/BookStore.css';
import Home from './Home';

function BookStore() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterBy, setFilterBy] = useState('');
    const [value, setValue] = useState('');
    const navigate = useNavigate()
    let currentUser = null;
    let token;
    const rawUser = localStorage.getItem('CurrentUser');
    if (rawUser) {
        try {
            currentUser = JSON.parse(rawUser);
            token = currentUser?.token;

        } catch (e) {
            console.error("Invalid JSON in CurrentUser:", e);
        }
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const fetchBooks = async (pageToFetch) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/books/getByStatus/available?page=${pageToFetch}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (res.status === 401) {
                alert("expired or invalid token, you are redictering to the login page")
                navigate('/login');
                return;

            }
            if (!res.ok) throw new Error('Server returned status ' + res.status);

            const data = await res.json() || [];
            if (!data || !Array.isArray(data.books)) {
                console.warn("Unexpected response:", data);
                setHasMore(false);
                setBooks([]);
                return;
            }

            if (data.books.length === 0 || pageToFetch >= data.totalPages) {
                setHasMore(false);
            }

            setBooks(prev => [...prev, ...data.books]);
        } catch (err) {
            console.error('Failed to fetch books', err);
            setError("Failed to load books: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(page);
    }, []);


    const search = async (pageToFetch = 1) => {
        if (!value || !filterBy) {
            fetchBooks(pageToFetch)
            return;
        }
        console.log(filterBy, value);
        try {
            const res = await fetch(`http://localhost:3000/api/books/search/${filterBy}/${value}?page=${pageToFetch}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (!res.ok) {
                if (res.status === 401) {
                    alert("expired or invalid token, you are redictering to the login page")
                    navigate('/login');
                    return;

                }
            }
            const data = await res.json() || [];

            if (!data || !Array.isArray(data.books)) {
                console.warn("Unexpected response:", data);
                setHasMore(false);
                setBooks([]);
                return;
            }

            if (data.books.length === 0 || pageToFetch >= data.totalPages) {
                setHasMore(false);
            }

            setBooks(data.books);
            console.log(data.books, data)
        }
        catch (err) {
            console.error('Failed to fetch books', err);
            setError("Failed to load books: " + err.message);
        } finally {
            setLoading(false);
        }
    }


    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBooks(nextPage);
    };


    return (
        <div className="bookStorePage">
            <Home />
            <div className="bookstore-container">
                <div className="bookstore-header">
                    <h2>Books Store</h2>
                    <div className="filters">
                        <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                            <option value="">Sort by</option>
                            <option value="Author">Author</option>
                            <option value="Book_Name">Name</option>
                        </select>
                        <input
                            className="sorters"
                            type="text"
                            placeholder="Search by name..."
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <button className='search-btn' onClick={() => search()}>🔍</button>

                    </div>
                </div>

                <div className="books-grid">
                    {books.map(book => (
                        <Book key={book.Id} book={book} commingFrom="BookStore" onApprove={fetchBooks} />
                    ))}
                </div>

                {loading && <p className="loading-message">Loading books...</p>}

                {!loading && books.length === 0 && (
                    <p className='red-message'>No matching books found.</p>
                )}

                {hasMore && !loading && (
                    <button className='add-books-btn' onClick={handleLoadMore}>Show more books</button>
                )}

                {!hasMore && books.length > 0 && (
                    <p className='red-message'>No more books to show</p>
                )}

                {error && <p className="error-message red-message">{error}</p>}
            </div>
        </div>
    );
}

export default BookStore;

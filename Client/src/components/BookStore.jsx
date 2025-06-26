import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import Book from './Book';
import '../styleSheets/BookStore.css';
import Home from './Home';

function BookStore() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true); // כדי להבחין בין טוען לבין ריק
    const [error, setError] = useState(null);

    let currentUser = null;
    const rawUser = localStorage.getItem('CurrentUser');
    if (rawUser) {
        try {
            currentUser = JSON.parse(rawUser);
        } catch (e) {
            console.error("Invalid JSON in CurrentUser:", e);
        }
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const fetchBooks = async (pageToFetch) => {
        const token = currentUser?.token;

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/books/getByStatus/approved`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!res.ok) {
                throw new Error('Server returned status ' + res.status);
            }

            const data = await res.json()||[];

            // if (!data || !Array.isArray(data.books)) {
            //     console.warn("Unexpected response:", data);
            //     setHasMore(false);
            //     setBooks([]);
            //     return;
            // }

            if (data.length === 0 || pageToFetch >= data.totalPages) {
                setHasMore(false);
            }

            setBooks(prev => [...prev, ...data]);
        } catch (err) {
            console.error('Failed to fetch books', err);
            setError("Failed to load books: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(page);
    }, [page]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    return (
        <div className="bookStorePage">
            <Home />
            <div className="bookstore-container">
                <div className="bookstore-header">
                    <h2>Books Store</h2>
                    <div className="filters">
                        <select>
                            <option value="">Sort by</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="name">Name</option>
                        </select>
                        <input className="sorters" type="text" placeholder="Search by name..." />
                    </div>
                </div>

                <div className="books-grid">
                    {books.map(book => (
                        <Book key={book.Id} book={book} />
                    ))}
                </div>

                {loading && <p className="loading-message">Loading books...</p>}

                {!loading && books.length === 0 && (
                    <p className='red-message'>Any Available books</p>
                )}

                {hasMore && !loading &&books.length !== 0&& (
                    <button className='add-books-btn' onClick={handleLoadMore}>Show more books</button>
                )}

                {!hasMore && books.length > 0 && (
                    <p>No more books to show</p>
                )}

                {error && <p className="error-message red-message">{error}</p>}
            </div>
        </div>
    );
}

export default BookStore;

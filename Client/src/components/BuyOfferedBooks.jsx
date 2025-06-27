import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import Book from './Book';
import '../styleSheets/BookStore.css';
import Home from './Home';

function BuyOfferedBooks() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] = useState('');

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
            const res = await fetch(`http://localhost:3000/api/books/getByStatus/offered?page=${pageToFetch}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!res.ok) {
                throw new Error('Server returned status ' + res.status);
            }

            const data = await res.json() || [];
            if (!data || !Array.isArray(data.books)) {
                setHasMore(false);
                setBooks([]);
                return;
            }

            if (data.books.length === 0 || pageToFetch >= data.totalPages) {
                setHasMore(false);
            }

            setBooks(prev => [...prev, ...data.books]);
        } catch (err) {
            setError("Failed to load books: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = (bookIdToRemove) => {
        setBooks(prevBooks => prevBooks.filter(b => b.Id !== bookIdToRemove));
    };

    useEffect(() => {
        fetchBooks(page);
    }, [page]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    // סינון הספרים לפי טקסט וחיפוש
    const filteredBooks = books.filter(book => {
        return book.Book_Name.toLowerCase().includes(filterText.toLowerCase());
    });

    // מיון לפי הבחירה
    const sortedBooks = [...filteredBooks];
    if (sortBy === 'price-low-high') {
        sortedBooks.sort((a, b) => a.Price - b.Price);
    } else if (sortBy === 'price-high-low') {
        sortedBooks.sort((a, b) => b.Price - a.Price);
    } else if (sortBy === 'name') {
        sortedBooks.sort((a, b) => a.Book_Name.localeCompare(b.Book_Name));
    }

    return (
        <div className="bookStorePage">
            <Home />
            <div className="bookstore-container">
                <div className="bookstore-header">
                    <h2>Books Offered Store</h2>
                    <div className="filters">
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="">Sort by</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="name">Name</option>
                        </select>
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
                    {sortedBooks.map(book => (
                        <Book key={book.Id} book={book} commingFrom="BuyOfferedBooks" onApprove={handleApprove} />
                    ))}
                </div>

                {loading && <p className="loading-message">Loading books...</p>}

                {!loading && sortedBooks.length === 0 && (
                    <p className='red-message'>No Available books</p>
                )}

                {hasMore && !loading && sortedBooks.length !== 0 && (
                    <button className='add-books-btn' onClick={handleLoadMore}>Show more books</button>
                )}

                {!hasMore && sortedBooks.length > 0 && (
                    <p className='red-message'>No more books to show</p>
                )}

                {error && <p className="error-message red-message">{error}</p>}
            </div>
        </div>
    );
}

export default BuyOfferedBooks;

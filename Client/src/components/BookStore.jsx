import React, { useEffect, useState } from 'react';
import Book from './Book';
import '../styleSheets/BookStore.css';
import Home from './Home';

function BookStore() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // כאן אפשר לשים fetch לנתונים משרת
        const userData = JSON.parse(localStorage.getItem('CurrentUser'));
        const token = userData?.token;
let currentUser = JSON.parse(localStorage.getItem('CurrentUser')) || '';

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
        fetch('http://localhost:3000/api/books/getAll', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // זה השורה החשובה
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error('Failed to fetch books', err));
    }, []);

    return (
        <div className="bookStorePage">
            <Home></Home>
            <div className="bookstore-container">
                <div className="bookstore-header">
                    <h2>Book Store</h2>
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
            </div>
        </div>
    );
}

export default BookStore;

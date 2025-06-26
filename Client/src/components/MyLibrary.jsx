
import React, { useEffect, useState } from 'react';
import Book from './Book';
import Home from './Home';
import BookLibrary from './BookLibrary';
import '../styleSheets/MyLibrary.css';

function MyLibrary() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [error, setError] = useState('');
let currentUser = null;
const rawUser = localStorage.getItem('CurrentUser');
if (rawUser) {
  try {
    currentUser = JSON.parse(rawUser);
  } catch (e) {
    console.error("Invalid JSON in CurrentUser:", e);
  }
}    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    const fetchBooks = async () => {
        const userData = JSON.parse(localStorage.getItem('CurrentUser'));
        const token = userData?.token;

        try {
            const res = await fetch(`http://localhost:3000/api/library/getAllBookByUserId`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!res.ok) {
                const errMsg = await res.json();
                throw new Error(errMsg.message || 'שגיאה בקבלת הספרים');
            }

            const data = await res.json();
            setBooks(data);

        } catch (err) {
            console.error('❌ שגיאה בקבלת ספרים:', err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const filteredBooks = books
        .filter(book => book.Book_Name.toLowerCase().includes(searchTerm))
        .sort((a, b) => {
            switch (sortOption) {
                case 'price-low-high':
                    return a.Price - b.Price;
                case 'price-high-low':
                    return b.Price - a.Price;
                case 'name':
                    return a.Book_Name.localeCompare(b.Book_Name);
                default:
                    return 0;
            }
        });

    return (
        <div className="bookStorePage">
            <Home />
            <div className="bookstore-container">
                <div className="bookstore-header">
                    <h2>My Library</h2>

                    <div className="filters">
                        <select onChange={handleSortChange} value={sortOption}>
                            <option value="">מיין לפי</option>
                            <option value="price-low-high">מחיר: מהזול ליקר</option>
                            <option value="price-high-low">מחיר: מהיקר לזול</option>
                            <option value="name">שם</option>
                        </select>

                        <input
                            className="sorters"
                            type="text"
                            placeholder="חפש לפי שם..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="books-grid">
                    {filteredBooks.map(book => (
                        <BookLibrary key={book.Id} book={book} />
                    ))}
                </div>

                {filteredBooks.length === 0 && (
                    <p>לא נמצאו ספרים להצגה</p>
                )}

                {error && (
                    <p className="error-message">{error}</p>
                )}
            </div>
        </div>
    );
}

export default MyLibrary;

// import React, { useEffect, useState } from 'react';
// import Book from './Book';
// import '../styleSheets/MyLibrary.css';
// import Home from './Home';

// function MyLibrary() {
//     const [books, setBooks] = useState([]);
//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(true); // האם יש עוד ספרים להביא

//     const fetchBooks = async (pageToFetch) => {
//         const userData = JSON.parse(localStorage.getItem('CurrentUser'));
//         const token = userData?.token;
// let currentUser = JSON.parse(localStorage.getItem('CurrentUser')) || '';

//         try {
//             const res = await fetch(`http://localhost:3000/api/library/getBook/:bookId`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 }
//             });

//             const data = await res.json();

//             // אם אין יותר ספרים – מפסיקים לטעון
//             if (data.books.length === 0 || pageToFetch >= data.totalPages) {
//                 setHasMore(false);
//             }

//             // מוסיף את הספרים החדשים לרשימה הקיימת
//             setBooks(prev => [...prev, ...data.books]);

//         } catch (err) {
//             console.error('Failed to fetch books', err);
//         }
//     };

//     useEffect(() => {
//         fetchBooks(page); // טוען את העמוד הראשון בהתחלה
//     }, [page]);

//     const handleLoadMore = () => {
//         setPage(prev => prev + 1); // מעלה את מספר העמוד → useEffect יופעל שוב
//     };

//     return (
//         <div className="bookStorePage">
//             <Home />
//             <div className="bookstore-container">
//                 <div className="bookstore-header">
//                     <h2>My Library</h2>
//                     <div className="filters">
//                         <select>
//                             <option value="">Sort by</option>
//                             <option value="price-low-high">Price: Low to High</option>
//                             <option value="price-high-low">Price: High to Low</option>
//                             <option value="name">Name</option>
//                         </select>
//                         <input className="sorters" type="text" placeholder="Search by name..." />
//                     </div>
//                 </div>

//                 <div className="books-grid">
//                     {books.map(book => (
//                         <Book key={book.Id} book={book} />
//                     ))}
//                 </div>

//                 {hasMore && (
//                     <button onClick={handleLoadMore}>לתצוגת ספרים נוספים</button>
//                 )}
//                 {!hasMore && (
//                     <p>אין עוד ספרים להצגה</p>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default MyLibrary;

// MyLibrary.js

// MyLibrary.js
import React, { useEffect, useState } from 'react';
import Book from './Book';
import Home from './Home';
import '../styleSheets/MyLibrary.css';

function MyLibrary() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [error, setError] = useState('');

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
                        <Book key={book.Id} book={book} />
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

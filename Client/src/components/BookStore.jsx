// import React, { useEffect, useState } from 'react';
// import Book from './Book';
// import '../styleSheets/BookStore.css';
// import Home from './Home';

// function BookStore() {
//     const [books, setBooks] = useState([]);

//     useEffect(() => {
//         // כאן אפשר לשים fetch לנתונים משרת
//         const userData = JSON.parse(localStorage.getItem('CurrentUser'));
//         const token = userData?.token;

//         fetch(`http://localhost:3000/api/books/getAll?page=${page}`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`, // זה השורה החשובה
//                 'Content-Type': 'application/json',
//             }
//         })
//             .then(res => res.json())
//             .then(data => setBooks(data))
//             .catch(err => console.error('Failed to fetch books', err));
//     }, []);

//     return (
//         <div className="bookStorePage">
//             <Home></Home>
//             <div className="bookstore-container">
//                 <div className="bookstore-header">
//                     <h2>Book Store</h2>
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
//             </div>
//             <button>לתצוגת ספרים נוספים</button>
//         </div>
//     );
// }

// export default BookStore;
import React, { useEffect, useState } from 'react';
import Book from './Book';
import '../styleSheets/BookStore.css';
import Home from './Home';

function BookStore() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // האם יש עוד ספרים להביא

    const fetchBooks = async (pageToFetch) => {
        const userData = JSON.parse(localStorage.getItem('CurrentUser'));
        const token = userData?.token;
        let currentUser = JSON.parse(localStorage.getItem('CurrentUser')) || '';

        try {
            const res = await fetch(`http://localhost:3000/api/books/getAll?page=${pageToFetch}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await res.json();

            // אם אין יותר ספרים – מפסיקים לטעון
            if (data.books.length === 0 || pageToFetch >= data.totalPages) {
                setHasMore(false);
            }

            // מוסיף את הספרים החדשים לרשימה הקיימת
            setBooks(prev => [...prev, ...data.books]);

        } catch (err) {
            console.error('Failed to fetch books', err);
        }
    };

    useEffect(() => {
        fetchBooks(page); // טוען את העמוד הראשון בהתחלה
    }, [page]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1); // מעלה את מספר העמוד → useEffect יופעל שוב
    };

    return (
        <div className="bookStorePage">
            <Home />
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

                {hasMore && (
                    <button onClick={handleLoadMore}>לתצוגת ספרים נוספים</button>
                )}
                {!hasMore && (
                    <p>אין עוד ספרים להצגה</p>
                )}
            </div>
        </div>
    );
}

export default BookStore;


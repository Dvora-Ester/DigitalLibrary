
import React, { useEffect, useState } from 'react';
import Book from './Book';
import '../styleSheets/WelcomePage.css';
import Home from './Home';
import poster from '../Assets/poster.png'; // Placeholder image if book picture is not available
import noImage from '../Assets/no-photo.png'; // Placeholder image if book picture is not available

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
        <div className="welcomePage">
            <Home />
            <div className="Welcome-img-container">
                <img className='imagePoster' src={poster||noImage} alt='poster'/>
                <h1 className='welcome-page-h1'>Welcome To Educational Digital libary</h1>
            </div>
        </div>
    );
}

export default BookStore;


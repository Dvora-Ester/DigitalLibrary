
import { useEffect, useState } from 'react';
import '../styleSheets/WelcomePage.css';
import Home from './Home';
import poster from '../Assets/poster.png'; 
import noImage from '../Assets/no-photo.png'; 

function BookStore() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); 

    const fetchBooks = async (pageToFetch) => {
        const userData = JSON.parse(localStorage.getItem('CurrentUser'));
        const token = userData?.token;
        let currentUser = null;
        const rawUser = localStorage.getItem('CurrentUser');
        if (rawUser) {
            try {
                currentUser = JSON.parse(rawUser);
            } catch (e) {
                console.error("Invalid JSON in CurrentUser:", e);
            }
        } if (!currentUser) {
            return <Navigate to="/login" />;
        }
        try {
            const res = await fetch(`http://localhost:3000/api/books/getAll?page=${pageToFetch}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await res.json();

            if (data.books.length === 0 || pageToFetch >= data.totalPages) {
                setHasMore(false);
            }

            setBooks(prev => [...prev, ...data.books]);

        } catch (err) {
            console.error('Failed to fetch books', err);
        }
    };

    useEffect(() => {
        fetchBooks(page); 
    }, [page]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1); 
    };

    return (
        <div className="welcomePage">
            <Home />
            <div className="Welcome-img-container">
                <img className='imagePoster' src={poster || noImage} alt='poster' />
                <h1 className='welcome-page-h1'>Welcome To Educational Digital libary</h1>
            </div>
        </div>
    );
}

export default BookStore;


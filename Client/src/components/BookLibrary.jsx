import React from 'react';
import '../styleSheets/BookLibrary.css';
import { useNavigate, Navigate } from 'react-router-dom';
import noImage from '../Assets/no-photo.png';

function BookLibrary({ book }) { // קבל book בפרופס
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('CurrentUser'));

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const toRead = () => {
        navigate('/bookReader', { state: { book } });
    };

    return (
        <div className="modal-overlay">
            {book ? (
                <div className="modal-content">
                    <div className='book-details-page'>
                        <div>
                            <img
                                className="modal-image"
                                src={book.imageUrl ? `http://localhost:3000${book.imageUrl}` : noImage}
                                alt="Book cover"
                            />
                            <button onClick={toRead} className="cart-button">to Read</button>
                        </div>
                        <div className="book-details-info">
                            <h2>{book.Book_Name}</h2>
                            <div className='detail-container'>
                                <div className='book-details'>
                                    <p>By {book.author}</p>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="modal-content">No book details available.</div>
            )}
        </div>
    );
}

export default BookLibrary;
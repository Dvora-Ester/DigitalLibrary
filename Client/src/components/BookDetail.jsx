import React from 'react';
import '../styleSheets/bookDetail.css';
import { useNavigate } from 'react-router-dom';
import Home from './Home';
import Comments from './Comments';
import { useLocation } from 'react-router-dom';
import noImage from '../Assets/no-photo.png'; // Placeholder image if book picture is not available
function BookDetailsModal() {

    const navigate = useNavigate();
    const location = useLocation();
    const { book } = location.state || {};
    console.log('Book details:', book, book.Id, book.Book_Name, book.author, book.imageUrl, book.number_Of_Page, book.Category, book.Price, book.Note, book.Editing_Date);
    let currentUser = JSON.parse(localStorage.getItem('CurrentUser')) || '';

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

    const addToCart = () => {
        // לדוגמה – עידכון עגלת קניות בלוקאל סטורג'
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(book);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${book.Book_Name} was added to your cart.`);
    };

    return (
        <div className="modal-overlay">
            <Home></Home>
            {book != null ? (
                <div className="modal-content">
                    <div className='book-details-page'>
                        <div>
                            <img className="modal-image" src={`http://localhost:3000${book.imageUrl}` || noImage} alt="Book cover" />
                            <button onClick={addToCart} className="cart-button">🛒 Add to Cart</button>
                        </div>
                        <div className="book-details-info">
                            <h2>{book.Book_Name}</h2>
                            <div className='detail-container'>
                                <div className='book-details'>
                                    <p>${Number(book.Price).toFixed(2)}</p>

                                    <p>By {book.author}</p>
                                    <p>{book.Category} Category</p>
                                    <p>{book.number_Of_Page} pg.</p>
                                    <p>{book.Note}</p>
                                    <p>Edited at {new Date(book.Editing_Date).toLocaleDateString()}</p>
                                </div>
                                <div className='book-summary'>
                                    <p><strong>~ Summary ~</strong><br />{book.Note}</p>
                                </div>
                            </div>
                            {/* <Comments/> */}
                        </div>
                    </div>
                    <Comments bookId={book.Id} />
                </div>
            ) :
                (<div className="modal-content">No book details available.</div>)}
        </div>
    );
}

export default BookDetailsModal;

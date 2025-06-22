import React from 'react';
import '../styleSheets/bookDetail.css';
import { useNavigate } from 'react-router-dom';

function BookDetailsModal({ book, onClose }) {
  const navigate = useNavigate();

  const goToComments = () => {
    navigate(`/books/${book.Id}/comments`);
  };

  const addToCart = () => {
    // לדוגמה – עידכון עגלת קניות בלוקאל סטורג'
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(book);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${book.Book_Name} was added to your cart.`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✖</button>
        <img className="modal-image" src={book.picture || 'https://via.placeholder.com/300x150'} alt="Book cover" />
        <h2>{book.Book_Name}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Pages:</strong> {book.number_Of_Page}</p>
        <p><strong>Category:</strong> {book.Category}</p>
        <p><strong>Price:</strong> ${Number(book.Price).toFixed(2)}</p>
        <p><strong>Note:</strong> {book.Note}</p>
        <p><strong>Edited:</strong> {new Date(book.Editing_Date).toLocaleDateString()}</p>

        <div className="modal-buttons">
          <button onClick={goToComments} className="comments-button">💬 View Comments</button>
          <button onClick={addToCart} className="cart-button">🛒 Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default BookDetailsModal;

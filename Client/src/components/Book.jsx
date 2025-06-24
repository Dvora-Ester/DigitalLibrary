import React from 'react';
import '../styleSheets/Book.css';
import BookDetail from '../components/BookDetail.jsx'
import { Navigate,useNavigate } from 'react-router-dom';
import { useState } from 'react';
function Book({ book }) {

console.log(book);
  const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('CurrentUser')) || '';
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="book-card" onClick={() =>navigate(`/${currentUser.Full_Name}/${currentUser.Id}/book-details/${book.Id}`,{state: {book: book}}) }>
        <p className='bookDetail category'> {book.Category}</p>
      <img
        src={`http://localhost:3000${book.imageUrl}` || 'https://via.placeholder.com/150'}
        alt={book.Book_Name}
        className="book-image"
      />
      <div className="book-details">
        <h3 className="book-title">{book.Book_Name}</h3>
        <p className='bookDetail'> {book.author}</p>
        
        <p className='bookDetail'> ${Number(book.Price)?.toFixed(2) || 'N/A'}</p>
      </div>
    </div>
  );
}

export default Book;

import React from 'react';
import '../styleSheets/Book.css';
import BookDetail from '../components/BookDetail.jsx'
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
function Book({ book }) {

console.log(book);
      const [openBookDetail, setOpenBookDetail] = useState(false);

  return (
    <div className="book-card" onClick={() => setOpenBookDetail(true)}>
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
        {openBookDetail&&<BookDetail onClose={() => setOpenBookDetail(false)} book={book}></BookDetail>}
      </div>
    </div>
  );
}

export default Book;

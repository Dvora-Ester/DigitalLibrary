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
        src={'https://www.google.com/imgres?q=%D7%94%D7%90%D7%A8%D7%99%20%D7%A4%D7%95%D7%98%D7%A8%20%D7%95%D7%97%D7%93%D7%A8%20%D7%94%D7%A1%D7%95%D7%93%D7%95%D7%AA&imgurl=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F71HNHkrm-CL._UF894%2C1000_QL80_.jpg&imgrefurl=https%3A%2F%2Fwww.amazon.com%2F-%2Fhe%2FAta-Boy-%25D7%2594%25D7%25A1%25D7%2595%25D7%2593%25D7%2595%25D7%25AA-%25D7%259B%25D7%2599%25D7%25A1%25D7%2595%25D7%2599-%25D7%259C%25D7%259E%25D7%25A7%25D7%25A8%25D7%25A8%25D7%2599%25D7%259D-%25D7%2595%25D7%259C%25D7%2595%25D7%25A7%25D7%25A8%25D7%2599%25D7%259D%2Fdp%2FB07F611MGB&docid=6JaGw6t7q1FvfM&tbnid=6YxB9OsOugX4cM&vet=12ahUKEwjsoL2i9YWOAxXPlP0HHdpwMYUQM3oFCIQBEAA..i&w=714&h=1000&hcb=2&ved=2ahUKEwjsoL2i9YWOAxXPlP0HHdpwMYUQM3oFCIQBEAA'}
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

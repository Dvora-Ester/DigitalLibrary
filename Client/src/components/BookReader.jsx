import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import '../styleSheets/BookReader.css';

function BookFlipReader({ book }) {
    const totalPages = book.totalPages || 10;

    const pages = Array.from({ length: totalPages }, (_, i) => (
        <div className="page" key={i}>
            <img
                src={`http://localhost:3000/bookPages/${book.Id}/page${i + 1}.jpg`}
                alt={`Page ${i + 1}`}
                className="page-image"
            />
        </div>
    ));

    return (
        <div className="flipbook-wrapper">
            <h2 className="book-title">{book.Book_Name}</h2>
            <HTMLFlipBook
                width={500}
                height={700}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1536}
                drawShadow={true}
                flippingTime={800}
                useMouseEvents={true}
                className="flip-book"
            >
                {pages}
            </HTMLFlipBook>
        </div>
    );
}

export default BookFlipReader;

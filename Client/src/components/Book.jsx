import React from 'react';
import '../styleSheets/Book.css';
import BookDetail from '../components/BookDetail.jsx'
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { use } from 'react';
function Book({ book, commingFrom, onApprove }) {
    const [btnText, setBtnText] = useState("");
    
    console.log(book);
    const navigate = useNavigate();
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
    useEffect(() => {
        if (commingFrom === "BookStore") { setBtnText("🛒 Add to Cart"); }
        if (commingFrom === "BuyOfferedBooks") { setBtnText("🛒 approve Book"); }
    }, []);
    const approveBook = (event) => {
        
        event.stopPropagation();
        const token = currentUser?.token;

        const updatedBook = {
            ...book,
            Status: "approved",
            Editing_Date: book.Editing_Date?.split('T')[0], // שימי לב לבדיקה שזה לא undefined
        };

        console.log("updatedBook", updatedBook);

        fetch(`http://localhost:3000/api/books/updateBook/${book.Id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBook)
        })
            .then(res => {
                if (!res.ok) {
                     if (res.status === 401) {
                        alert("expired or invalid token, you are redictering to the login page")
                        navigate('/login');
                        return;

                    }
                    throw new Error('Failed to approve book');
                }
                return res.json();
            })
            .then(data => {
                alert(`Book ${book.Book_Name} approved successfully!`);
                onApprove?.();
            })
            .then(data => {
                alert(`Book ${book.Book_Name} approved successfully!`);
                onApprove?.(book.Id); // נשלח את ה-ID לאבא
            })
            .catch(err => {
                console.error(err);
                alert(`Failed to approve book: ${err.message}`);
            });
    };

    const addToCart = (event) => {
        event.stopPropagation();
        let isExsistingInCart = false;
        // Update cart in local storage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.forEach(itemInCart => {
            if (itemInCart.Id === book.Id) {
                isExsistingInCart = true;

                alert(`the Book ${book.Book_Name} is already exxisting in your cart.`);
            }
        });
        if (!isExsistingInCart) {
            cart.push({ ...book, amount: 1 }); // Add book to cart with default amount of 1
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${book.Book_Name} was added to your cart.`);
        }
    };
    return (
        <div className="book-card" onClick={() => navigate(`/${currentUser.Full_Name}/${currentUser.Id}/book-details/${book.Id}`, { state: { book: book } })}>
            <p className='bookDetail category'> {book.Category}</p>
            <div>
                <img className="book-image" src={`http://localhost:3000${book.imageUrl}` || noImage} alt={book.Book_Name} />
                <button onClick={btnText === "🛒 Add to Cart" ? addToCart : approveBook} className="cart-button">{btnText}</button>
            </div>

            <div className="book-details">
                <h3 className="book-title">{book.Book_Name}</h3>
                <p className='bookDetail'> {book.author}</p>

                <p className='bookDetail'> ${Number(book.Price)?.toFixed(2) || 'N/A'}</p>
            </div>
        </div>
    );
}

export default Book;

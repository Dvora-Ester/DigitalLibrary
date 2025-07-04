import '../styleSheets/Book.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
function Book({ book, commingFrom, onApprove }) {
  const [btnText, setBtnText] = useState('');
  const navigate = useNavigate();

  let currentUser = null;
  const rawUser = localStorage.getItem('CurrentUser');
  if (rawUser) {
    try {
      currentUser = JSON.parse(rawUser);
    } catch (e) {
      console.error('Invalid JSON in CurrentUser:', e);
    }
  }
  if (!currentUser) return <Navigate to="/login" />;

  useEffect(() => {
    if (commingFrom === 'BookStore') setBtnText('🛒 Add to Cart');
    if (commingFrom === 'BuyOfferedBooks') setBtnText('🛒 Approve Book');
  }, [commingFrom]);

  const approveBook = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const token = currentUser?.token;

    const updatedBook = {
      ...book,
      Status: 'approved',
      Editing_Date: book.Editing_Date?.split('T')[0],
    };

    fetch(`http://localhost:3000/api/books/updateBook/${book.Id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            alert('Expired or invalid token. Redirecting to login page.');
            navigate('/login');
            return;
          }
          throw new Error('Failed to approve book');
        }
        return res.json();
      })
      .then(() => {
        alert(`Book "${book.Book_Name}" approved successfully!`);
        onApprove?.(book.Id);
      })
      .catch((err) => {
        console.error(err);
        alert(`Failed to approve book: ${err.message}`);
      });
  };

  const addToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exists = cart.some((item) => item.Id === book.Id);

    if (exists) {
      alert(`The book "${book.Book_Name}" is already in your cart.`);
      return;
    }

    cart.push({ ...book, amount: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`"${book.Book_Name}" was added to your cart.`);
  };

  return (
    <div
      className="book-card"
      onClick={() =>
        navigate(
          `/${currentUser.Full_Name}/${currentUser.Id}/book-details/${book.Id}`,
          { state: { book: book } }
        )
      }
    >
      <p className="bookDetail category">{book.Category}</p>
      <div>
        <img
          className="book-image"
          src={`http://localhost:3000${book.imageUrl || ''}` || defaultImage}
          alt={book.Book_Name}
          onError={(e) => (e.target.src = defaultImage)}
        />
        <button
          onClick={btnText === '🛒 Add to Cart' ? addToCart : approveBook}
          className="cart-button"
        >
          {btnText}
        </button>
      </div>

      <div className="book-details">
        <h3 className="book-title">{book.Book_Name}</h3>
        <p className="bookDetail">{book.author}</p>
        <p className="bookDetail">
          ${Number(book.Price)?.toFixed(2) || 'N/A'}
        </p>
      </div>
    </div>
  );
}

export default Book;


import '../styleSheets/bookDetail.css';
import { Navigate } from 'react-router-dom';
import Home from './Home';
import Comments from './Comments';
import { useLocation } from 'react-router-dom';
import noImage from '../Assets/no-photo.png'; // Placeholder image if book picture is not available
function BookDetailsModal() {
    const location = useLocation();
    const { book } = location.state || {};
    console.log('Book details:', book, book.Id, book.Book_Name, book.author, book.imageUrl, book.number_Of_Page, book.Category, book.Price, book.Note, book.Editing_Date);
    let currentUser = null;
    const rawUser = localStorage.getItem('CurrentUser');
    if (rawUser) {
        try {
            currentUser = JSON.parse(rawUser);
        } catch (e) {
            console.error("Invalid JSON in CurrentUser:", e);
        }
    }
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const addToCart = () => {
        let isExsistingInCart = false;
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
        <div className="modal-overlay">
            <Home></Home>
            {book != null ? (
                <div className="modal-content">
                    <div className='book-details-page'>
                        <div className='image-container'>
                            <img className="modal-image" src={`http://localhost:3000${book.imageUrl}` || noImage} alt="Book cover" />
                            <button onClick={addToCart} className="cart-button-of-image">🛒 Add to Cart</button>
                        </div>
                        <div className="book-details-info">
                            <h2>{book.Book_Name}</h2>
                            <div className='detail-container'>
                                <div className='book-details'>
                                    <p className='bookPrice'>${Number(book.Price).toFixed(2)}</p>

                                    <p className='bookAuthor'>By {book.author}</p>
                                    <p className='bookCategory' >{book.Category} Category</p>
                                    <p className='bookNoPage'>{book.number_Of_Page} pg.</p>
                                    <p className='bookEditedAt'>Edited at {new Date(book.Editing_Date).toLocaleDateString()}</p>
                                </div>
                                <div className='book-summary'>
                                    <p className='summary'><strong>~ Summary ~</strong><br />{book.Note}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Comments className="  height: 100vh;
" bookId={book.Id} />
                </div>
            ) :
                (<div className="modal-content">No book details available.</div>)}
        </div>
    );
}

export default BookDetailsModal;

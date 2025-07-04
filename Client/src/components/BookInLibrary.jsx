import '../styleSheets/Book.css';
import { Navigate, useNavigate } from 'react-router-dom';
function Book({ book }) {

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
    // const addToCart = () => {
    //     let isExsistingInCart = false;
    //     // Update cart in local storage
    //     const cart = JSON.parse(localStorage.getItem('cart')) || [];
    //     cart.forEach(itemInCart => {
    //         if (itemInCart.Id === book.Id) {
    //             isExsistingInCart = true;
    //             itemInCart.amount += 1; // Increase amount if book already in cart
    //             localStorage.setItem('cart', JSON.stringify(cart));
    //             alert(`${book.Book_Name} amount was increased in your cart.`);
    //         }
    //     });
    //     if (!isExsistingInCart) {
    //         cart.push({ ...book, amount: 1 }); // Add book to cart with default amount of 1
    //         localStorage.setItem('cart', JSON.stringify(cart));
    //         alert(`${book.Book_Name} was added to your cart.`);
    //     }
    // }
    return (
        <div className="book-card" onClick={() => navigate(`/${currentUser.Full_Name}/${currentUser.Id}/book-details/${book.Id}`, { state: { book: book } })}>
            <p className='bookDetail category'> {book.Category}</p>
            <div>
                <img className="book-image" src={`http://localhost:3000${book.imageUrl}` || noImage} alt={book.Book_Name} />

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

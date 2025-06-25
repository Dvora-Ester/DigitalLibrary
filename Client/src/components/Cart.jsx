import React, { useEffect, useState } from 'react';
import CartItem from './CartItem';
import '../styleSheets/Cart.css';
import Home from './Home';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardValidity, setValidity] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
        setTotal(() => storedCart.reduce((acc, item) => acc + Number(item.Price), 0));
    }, []);

    const handlePay = () => {
        // אפשר להוסיף ולידציה כאן
        if (cvv.length !== 3 || cardNumber.length !== 16 || !cardValidity) {
            alert('Please enter valid payment details.');
            return;
        }
        setShowModal(false);
        localStorage.setItem('cart', JSON.stringify([])); // Clear cart after payment
        setCartItems([]);
        navigate(`/${currentUser.Full_Name}/${currentUser.Id}/welcome-page`); // נווט לדף הבית
    };

    return (
        <div className="cart-page">
            <Home />
            <div className="cart-page-container">
                <div className='cart-page-header'>
                    <h2 className="cart-page-title">🛒 Your Shopping Cart</h2>
                    <h3><span>Total after tax:</span> ${total.toFixed(2)} </h3>
                    <button className="checkout-button" onClick={() => setShowModal(true)}>Checkout</button>
                </div>
                {cartItems.length === 0 ? (
                    <p className="empty-message">Your cart is empty.</p>
                ) : (
                    <div className="cart-page-items-container">
                        {cartItems.map((item, index) => (
                            <CartItem key={index} item={item} />
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="PaymentModal">
                    <div className="modal">
                        <h3>Enter Payment Details</h3>
                        <input
                            type="text"
                            placeholder="Card Number"
                            className="modal-input"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Expiry Date (MM/YY)"
                            className="modal-input"
                            value={cardValidity}
                            onChange={(e) => setValidity(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="CVV"
                            className="modal-input"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                        />
                        <button className="modal-pay" onClick={handlePay}>Pay</button>
                        <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;

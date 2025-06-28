import React, { useEffect, useState } from 'react';
import CartItem from './CartItem'; // ודא שיש לך קומפוננטה כזו
import '../styleSheets/Cart.css'; // סגנונות לעגלה
import Home from './Home'; // קומפוננטת הבית שלך
import { useNavigate, Navigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false); // אם תשתמש במודל תשלום בעתיד
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  // טוען את המשתמש מהלוקל סטורג'
  let currentUser = null;
  const rawUser = localStorage.getItem('CurrentUser');
  if (rawUser) {
    try {
      currentUser = JSON.parse(rawUser);
    } catch (e) {
      console.error("Invalid JSON in CurrentUser:", e);
    }
  }
  // אם אין משתמש, מפנה לעמוד כניסה
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // מחושב סך כל הפריטים
  const calculateTotal = (cart) => {
    if (cart.length === 0) return 0;
    return cart.reduce((acc, item) => acc + Number(item.Price), 0);
  };

  // טוען עגלה ומסתכל אם יש פרמטר של תשלום מוצלח ב-URL
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');

    if (paymentStatus === 'success') {
      // תשלום הצליח - מנקה עגלה ומציג הודעה
      localStorage.setItem('cart', JSON.stringify([]));
      setCartItems([]);
      setTotal(0);
      setPaymentSuccess(true);
    } else {
      setCartItems(storedCart);
      setTotal(() => calculateTotal(storedCart));
      setPaymentSuccess(false);
    }
  }, []);

  // פונקציית תשלום - קוראת לשרת לקבלת כתובת Stripe ומפנה לשם
  const handlePay = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const token = currentUser?.token;

    try {
      const response = await fetch("http://localhost:3000/api/orders/addOrder", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderedBookIds: cartItems.map(book => book.Id),
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // מפנה ל-Stripe Checkout
      } else {
        alert("Something went wrong. Could not get checkout URL.");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Error occurred during checkout.");
    }
  };

  // מחיקת פריט מהעגלה
  function removeItem(itemId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartAfterRemove = cart.filter(cartItem => cartItem.Id !== itemId);
    setCartItems(cartAfterRemove);
    setTotal(() => calculateTotal(cartAfterRemove));
    localStorage.setItem('cart', JSON.stringify(cartAfterRemove));
  }

  return (
    <div className="cart-page">
      <Home />
      <div className="cart-page-container">
        <div className='cart-page-header'>
          <h2 className="cart-page-title">🛒 Your Shopping Cart</h2>
          <h3><span>Total after tax:</span> ${total.toFixed(2)}</h3>
          <button className="checkout-button" onClick={() => {
            if (total === 0) {
              alert('Your cart is empty. Please add items to your cart before proceeding to payment.');
              return;
            }
            setShowModal(true); // אם תרצי לפתוח מודל תשלום
            handlePay();
          }}>Checkout</button>
        </div>

        {paymentSuccess && (
          <div className="payment-success-message" style={{ color: 'green', marginBottom: '20px' }}>
            🎉 Thank you for your purchase! Your payment was successful.
          </div>
        )}

        {cartItems.length === 0 ? (
          <p className="empty-message">Your cart is empty.</p>
        ) : (
          <div className="cart-page-items-container">
            {cartItems.map((item, index) => (
              <CartItem key={index} item={item} onRemoveItem={removeItem} />
            ))}
          </div>
        )}
      </div>

      {/* אם תרצי לשלב מודל תשלום בעתיד */}
      {/* {showModal && (
        <div className="PaymentModal">
          <div className="modal">
            <h3>Enter Payment Details</h3>
            // ... שדות תשלום כאן ...
            <button onClick={handlePay}>Pay</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default Cart;

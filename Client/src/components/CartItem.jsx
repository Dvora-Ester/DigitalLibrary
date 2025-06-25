import React from 'react';
import '../styleSheets/Cart.css';
import noImage from '../Assets/no-photo.png'; // Placeholder image if book picture is not available
function CartItem({ item }) {
  return (
    <div className="cart-page-item">
      <img src={noImage} alt={item.Book_Name}/>
      <h3 className="item-title">{item.Book_Name}</h3>
      <p className="item-author">{item.author}</p>
      <p className="item-price">${Number(item.Price)?.toFixed(2) || 'N/A'}</p>
    </div>
  );
}

export default CartItem;

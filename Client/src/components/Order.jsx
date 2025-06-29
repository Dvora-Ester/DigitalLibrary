

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styleSheets/Order.css'; // Assuming you have a CSS file for styling


function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchOrder = async () => {
      const userData = localStorage.getItem("CurrentUser");
      if (!userData) {
        setError("User not logged in");
        return;
      }


      const currentUser = JSON.parse(userData);
      const token = currentUser.token;


      try {
        const response = await fetch(`http://localhost:3000/api/orders/getOrderById/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });


        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }


        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      }
    };


    fetchOrder();
  }, [orderId]);


  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!order) return <div>Loading...</div>;


  const orderIdDisplay = order.Id ?? "לא זמין";
  const totalDisplay = order.total !== null && order.total !== undefined ? `$${order.total}` : "לא זמין";
  const dateDisplay = order.date ? new Date(order.date).toLocaleDateString() : "לא זמין";


  return (
    <div>
      <h2>פרטי ההזמנה</h2>
      <p><strong>מספר הזמנה:</strong> {orderIdDisplay}</p>
      <p><strong>סכום כולל:</strong> {totalDisplay}</p>
      <p><strong>תאריך רכישה:</strong> {dateDisplay}</p>


      <h3>ספרים בהזמנה:</h3>
      {Array.isArray(order.books) && order.books.length > 0 ? (
        <ul>
          {order.books.map((book, index) => {
            const name = book.Book_Name || "ללא שם";
            const price = book.Price ? `$${book.Price}` : "לא ידוע";
            return (
              <li key={book.Id || index}>
                <strong>{name}</strong> — {price}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>אין ספרים להצגה בהזמנה זו.</p>
      )}
    </div>
  );
}


export default OrderDetails;




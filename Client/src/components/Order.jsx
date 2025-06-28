import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        const response = await fetch(`http://localhost:3000/api/orders/getOrderById//${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
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

  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order.Id}</p>
      <p>Book Name: {order.bookName}</p>
      <p>Price: {order.total}</p>
      <p>Purchase Date: {order.date}</p>
      {/* הוסיפי עוד מידע לפי הנתונים שאת מקבלת */}
    </div>
  );
}

export default OrderDetails;

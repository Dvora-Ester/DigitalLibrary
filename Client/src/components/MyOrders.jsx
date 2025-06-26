import React, { useEffect, useState } from 'react';
import { useNavigate,Navigate } from 'react-router-dom';
import Home from './Home';
import '../styleSheets/MyOrders.css';
function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
let currentUser = null;
const rawUser = localStorage.getItem('CurrentUser');
if (rawUser) {
  try {
    currentUser = JSON.parse(rawUser);
  } catch (e) {
    console.error("Invalid JSON in CurrentUser:", e);
  }
}    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    useEffect(() => {
        const userData = localStorage.getItem('CurrentUser');
        if (!userData) {
            navigate('/login');
            return;
        }

        const currentUser = JSON.parse(userData);
        const token = currentUser.token;

        fetch('http://localhost:3000/api/orders/getAllOrdersByUserId', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

            .then(async res => {
                if (!res.ok) {
                    const error = await res.text();
                    throw new Error(error || 'שגיאה מהשרת');
                }
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error('הפורמט שהתקבל מהשרת אינו מערך');
                }
                setOrders(data);
                setError('');
            })
            .catch(err => {
                console.error('❌ שגיאה בשליפת הזמנות:', err);
                setError('Error fetching orders' );
            })
            .finally(() => {
                setLoading(false);
            });
    }, [navigate]);

    return (
        <div className="my-orders-container">
            <Home />
            <div className="my-orders-content">
            <h2>My Orders </h2>
            {loading ? (
                <p>Load...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : orders.length === 0 ? (
                <p>orders wasn't found</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order.Id}>
                            order ID: {order.Id} | Purchas Date:{order.date}
                            <br />
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </div>
    );
}

export default MyOrders;

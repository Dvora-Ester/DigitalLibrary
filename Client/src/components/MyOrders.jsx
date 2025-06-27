import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Home from './Home';
import '../styleSheets/MyOrders.css';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterText, setFilterText] = useState('');
    const [sortBy, setSortBy] = useState('');
    const navigate = useNavigate();

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
                setError('Error fetching orders');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [navigate]);

    // פונקציה למיון ההזמנות לפי השדה הנבחר
    const sortedOrders = [...orders].sort((a, b) => {
        switch (sortBy) {
            case 'price-low-high':
                // אם יש שדה מחיר בהזמנה, החלף לפי הצורך
                return (a.Price || 0) - (b.Price || 0);
            case 'price-high-low':
                return (b.Price || 0) - (a.Price || 0);
            case 'name':
                return (a.Name || '').localeCompare(b.Name || '');
            case 'id':
                return a.Id - b.Id;
            case 'date':
                return new Date(a.date) - new Date(b.date);
            default:
                return 0;
        }
    });

    // סינון ההזמנות לפי הטקסט שהמשתמש הקליד, בהתאם לשדה מיון רלוונטי
    const filteredOrders = sortedOrders.filter(order => {
        if (!filterText) return true; // אם אין טקסט סינון, להראות את כולם

        const lowerFilter = filterText.toLowerCase();

        switch (sortBy) {
            case 'price-low-high':
            case 'price-high-low':
                // אם יש שדה מחיר - אפשר לסנן לפי מחיר כתווך מספרי, או לא לסנן כאן
                return order.Price?.toString().includes(lowerFilter);
            case 'name':
                return order.Name?.toLowerCase().includes(lowerFilter);
            case 'id':
                return order.Id.toString().toLowerCase().includes(lowerFilter);
            case 'date':
                return order.date?.toLowerCase().includes(lowerFilter);
            default:
                // ברירת מחדל - סינון לפי מזהה
                return order.Id.toString().toLowerCase().includes(lowerFilter);
        }
    });

    return (
        <div className="my-orders-container">
            <Home />
            <div className="my-orders-content">
                <div className="bookstore-header">
                    <h2>My Orders</h2>
                    <div className="filters">
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="">Sort by</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="name">Name</option>
                            <option value="id">ID</option>
                            <option value="date">Date</option>
                        </select>
                        <input
                            className="sorters"
                            type="text"
                            placeholder={`Search by ${sortBy || 'ID'}...`}
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                    </div>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : filteredOrders.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    <ul>
                        {filteredOrders.map(order => (
                            <li key={order.Id}>
                                Order ID: {order.Id} | Purchase Date: {order.date}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MyOrders;

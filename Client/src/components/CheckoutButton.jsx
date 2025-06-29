import React, { useState, useNavigate } from "react";

function CheckoutButton() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
    if (!currentUser) { <navigate to="/login" />; }
    const token = currentUser.token;
    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/api/orders/addOrder", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "orderedBookIds": [23, 24],
                    "email": "test@example.com"
                }),
            });

            const data = await response.json();
            if (data.status === 401) {
                alert("expired or invalid token, you are redictering to the login page")
                navigate('/login');
                return;

            }
            if (data.url) {
                // מפנה את המשתמש ל-Stripe Checkout
                window.location.href = data.url;
            } else {
                setError("Failed to get checkout URL");
            }
        } catch (err) {
            console.error(err);
            setError("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleCheckout} disabled={loading}>
                {loading ? "Loading..." : "Checkout"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default CheckoutButton;

import React, { useState } from 'react';
import '../styleSheets/BookSellingPage.css';
import Home from './Home';
import { Navigate,useNavigate } from 'react-router-dom';

function BookSellingPage() {
    const navigate=useNavigate();

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

    const [newBookData, setNewBookData] = useState({
        Book_Name: '',
        author: '',
        numberOfPage: '',
        Price: '',
        Category: '',
        Note: '',
        Editing_Date: '',
        sellerId: currentUser.Id,
        Status: 'offered',
        Wholesale_Price:''
    });
    const [loading, setLoading] = useState(true); // כדי להבחין בין טוען לבין ריק

    const [imageFile, setImageFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBookData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handlePdfChange = (e) => {
        setPdfFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        const bookToSend = {
            ...newBookData,
            number_Of_Page: Number(newBookData.numberOfPage),
            Editing_Date: newBookData.Editing_Date || new Date().toISOString().split("T")[0]
        };
        console.log("bookToSend", bookToSend);
        // הוספת כל שדות הספר
        for (const key in bookToSend) {
            formData.append(key, bookToSend[key]);
        }
        console.log("formData", formData);
        // הוספת קבצים
        if (imageFile) formData.append("bookImage", imageFile);
        if (pdfFile) formData.append("bookFile", pdfFile);

        try {
            const res = await fetch("http://localhost:3000/api/books/addBook", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
                body: formData,
            });
            if (res.status === 401) {
                alert("expired or invalid token, you are redictering to the login page")
                navigate('/login');
                return;

            }
            if (!res.ok) throw new Error("Failed to add book");

            const result = await res.json();
            console.log("Book added:", result);
            alert(`Book "${newBookData.Book_Name}" added successfully!`);

            // איפוס טופס
            setNewBookData({
                Book_Name: '',
                author: '',
                numberOfPage: '',
                Price: '',
                Category: '',
                Note: '',
                Editing_Date: '',
                sellerId: currentUser.Id,
                Status: 'offered',
                Wholesale_Price:''
            })
            setImageFile(null);
            setPdfFile(null);
            setPreviewImage(null);
            setLoading(false); // סיום הטעינה
        } catch (err) {
            console.error("Error submitting book:", err);
            alert("Error submitting book: " + err.message);
        }

    };

    return (
        <div className='book-selling-page'>
            <Home />
            <form className="add-book-form" onSubmit={handleSubmit}>
                <h2>Add a New Book</h2>

                <input name="Book_Name" placeholder="Book Name" value={newBookData.Book_Name} onChange={handleChange} required />
                <input name="author" placeholder="Author" value={newBookData.author} onChange={handleChange} />
                <input name="numberOfPage" type="number" placeholder="Number of Pages" value={newBookData.numberOfPage} onChange={handleChange} />
                <input name="Price" type="number" step="0.01" placeholder="Price" value={newBookData.Price} onChange={handleChange} required />
                <input name="Category" placeholder="Category" value={newBookData.Category} onChange={handleChange} />
                <textarea name="Note" placeholder="Summary" value={newBookData.Note} onChange={handleChange} />
                <input name="Editing_Date" type="date" value={newBookData.Editing_Date} onChange={handleChange} />
                   <input name="Wholesale_Price" type="number" step="0.01" placeholder="Wholesale_Price" value={newBookData.Wholesale_Price} onChange={handleChange} required />
                <label>Upload Book Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                {previewImage && (
                    <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                    </div>
                )}

                <label>Upload Book PDF:</label>
                <input type="file" accept="application/pdf" onChange={handlePdfChange} />
                {loading && <p className='loading'>Loading...</p>}
                <button type="submit">Add Book</button>
            </form>
        </div>
    );
}

export default BookSellingPage;

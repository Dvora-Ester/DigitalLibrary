import React, { useState } from 'react';
import '../styleSheets/BookSellingPage.css';
import Home from './Home';
import { Navigate } from 'react-router-dom';

function BookSellingPage() {
    const currentUser = JSON.parse(localStorage.getItem('CurrentUser'));
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const [newBookData, setNewBookData] = useState({
        Book_Name: '',
        author: '',
        number_Of_Page: '',
        Price: '',
        Category: '',
        Note: '',
        Editing_Date: '',
        Seller_Id: currentUser.Id,
        Status: 'offered'
    });

    const [imageFile, setImageFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBookData((prev) => ({ ...prev, [name]: value }));
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

        if (!newBookData.Book_Name || !newBookData.Price) {
            alert("Book name and price are required.");
            return;
        }

        const formData = new FormData();
        for (const key in newBookData) {
            formData.append(key, newBookData[key]);
        }

        if (imageFile) {
            formData.append("image", imageFile);
        }

        if (pdfFile) {
            formData.append("pdf", pdfFile);
        }

        try {
            await fetch("http://localhost:3000/api/books", {
                method: "POST",
                body: formData
            });

            alert("Book submitted successfully!");
            setNewBookData({
                Book_Name: '',
                author: '',
                number_Of_Page: '',
                Price: '',
                Category: '',
                Note: '',
                Editing_Date: '',
                Seller_Id: currentUser.Id,
                Status: 'offered'
            });
            setImageFile(null);
            setPdfFile(null);
            setPreviewImage(null);
        } catch (err) {
            console.error("Error submitting book:", err);
            alert("Error submitting book.");
        }
    };

    return (
        <div className='book-selling-page'>
            <Home />
            <form className="add-book-form" onSubmit={handleSubmit}>
                <h2>Add a New Book</h2>
                <input name="Book_Name" placeholder="Book Name" value={newBookData.Book_Name} onChange={handleChange} required />
                <input name="author" placeholder="Author" value={newBookData.author} onChange={handleChange} />
                <input name="number_Of_Page" type="number" placeholder="Number of Pages" value={newBookData.number_Of_Page} onChange={handleChange} />
                <input name="Price" type="number" step="0.01" placeholder="Price" value={newBookData.Price} onChange={handleChange} required />
                <input name="Category" placeholder="Category" value={newBookData.Category} onChange={handleChange} />
                <textarea name="Note" placeholder="Summary" value={newBookData.Note} onChange={handleChange} />
                <input name="Editing_Date" type="date" value={newBookData.Editing_Date} onChange={handleChange} />

                <label>Upload Book Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                {previewImage && (
                    <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                    </div>
                )}

                <label>Upload Book PDF:</label>
                <input type="file" accept="application/pdf" onChange={handlePdfChange} />

                <button type="submit">Add Book</button>
            </form>
        </div>
    );
}

export default BookSellingPage;
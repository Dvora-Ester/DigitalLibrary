import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import booksModel from "../modules/books.js"; // ודא שיש מודול כזה
import { generateToken } from "../middleware/outh.js";

const Books = {
    getAll: async (req, res) => {
        try {
            
            const books = await booksModel.getAll() ||[];
            console.log(books);
            res.json(books);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch books' });
        }
    },

    getById: async (req, res) => {
        try {
            const book = await booksModel.getById(req.params.id);
            if (!book) return res.status(404).json({ message: 'Book not found' });
            res.json(book);
        } catch (err) {
            console.error('Error getting book by ID:', err);
            res.status(500).json({ error: 'Failed to fetch book' });
        }
    },
    getByName: async (req, res) => {
        try {
            const book = await booksModel.getByName(req.params.Book_Name);
            if (!book) return res.status(404).json({ message: 'Book not found' });
            res.json(book);
        } catch (err) {
            console.error('Error getting book by Name:', err);
            res.status(500).json({ error: 'Failed to fetch book' });
        }
    },

    Create: async (req, res) => {
        const {
            Book_Name, author, number_Of_Page, Price,
            Category, Note, Status, Seller_Id, Editing_Date
        } = req.body;

        // בדיקת שדות חובה
        if (!Book_Name || !author || !number_Of_Page || !Price ||
            !Category || !Note || !Status || !Seller_Id || !Editing_Date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // בדיקת ערכי סטטוס תקינים
        const validStatuses = ['offered', 'approved', 'available', 'sold'];
        if (!validStatuses.includes(Status)) {
            return res.status(400).json({ error: "Status must be one of: offered, approved, available, sold" });
        }

        // בדיקת מספרים חיוביים
        if (number_Of_Page < 1 || Price < 1) {
            return res.status(400).json({ error: "Number of pages and price must be positive numbers" });
        }

        // בדיקה אם המשתמש קיים
        const ExistingUser = await usersModel.getById(Seller_Id);
        if (!ExistingUser) {
            return res.status(400).json({ error: "Seller with provided ID does not exist" });
        }

        try {
            const result = await booksModel.Create({
                Book_Name, author, number_Of_Page, Price,
                Category, Note, Status, Seller_Id, Editing_Date
            });

            console.log("Book added successfully:", result);
            res.status(201).json({ message: "Book added successfully", bookId: result.bookId });
        } catch (err) {
            console.error("Error adding the book to the database:", err);
            res.status(500).json({ error: "Error adding the book" });
        }
    },
    update: async (req, res) => {

        const bookId = req.params.id;
        const {
            Book_Name, author, number_Of_Page, Price,
            Category, Note, Status, Seller_Id, Editing_Date
        } = req.body;
        const PreviousBookData = await getById(bookId).json();
        // בדיקת שדות חובה
        if (!Book_Name || !author || !number_Of_Page || !Price ||
            !Category || !Note || !Status || !Seller_Id || !Editing_Date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // בדיקת סטטוס חוקי
        const validStatuses = ['offered', 'approved', 'available', 'sold'];
        if (!validStatuses.includes(Status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        // בדיקת מספרים חיוביים
        if (number_Of_Page < 1 || Price < 1) {
            return res.status(400).json({ error: "Number of pages and price must be positive" });
        }

        // בדיקת קיום המשתמש
        const existingUser = await usersModel.getById(Seller_Id);
        if (!existingUser) {
            return res.status(400).json({ error: "Seller not found" });
        }

        try {
            const updated = await booksModel.update(bookId, {
                Book_Name: Book_Name || PreviousBookData.Book_Name,
                author: author || PreviousBookData.author,
                number_Of_Page: number_Of_Page || PreviousBookData.number_Of_Page,
                Price: Price || PreviousBookData.Price,
                Category: Category || PreviousBookData.Category,
                Note: Note || PreviousBookData.Note,
                Status: Status || PreviousBookData.status,
                Seller_Id: Seller_Id || PreviousBookData.Seller_Id,
                Editing_Date: Editing_Date || PreviousBookData.Editing_Date
            });

            if (!updated) {
                return res.status(404).json({ error: "Book not found to update" });
            }

            res.json({ message: "Book updated successfully" });
        } catch (err) {
            console.error("Error updating book:", err);
            res.status(500).json({ error: "Failed to update book" });
        }
    }
    ,
    delete: async (req, res) => {
        const bookId = req.params.id;

        try {
            const deleted = await booksModel.delete(bookId);
            if (!deleted) {
                return res.status(404).json({ error: "Book not found to delete" });
            }

            res.json({ message: "Book deleted successfully" });
        } catch (err) {
            console.error("Error deleting book:", err);
            res.status(500).json({ error: "Failed to delete book" });
        }
    }

};

export default Books;

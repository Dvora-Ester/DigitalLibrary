import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import libraryModel from "../modules/library.js"; 
import booksModel from "../modules/books.js"; 
import { generateToken } from "../middleware/outh.js";

const library = {
    getAll: async (req, res) => {
        try {

            const booksInLibrary = await libraryModel.getAll() || [];
            console.log(booksInLibrary);
            res.json(booksInLibrary);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch books' });
        }
    },

    getByUserIdAndBookId: async (req, res) => {
        const {User_Id,Book_Id}=req.params;
        console.log("getByUserIdAndBookId controller",User_Id,Book_Id)
        try {
            const book = await libraryModel.getByUserIdAndBookId(User_Id,Book_Id);
            if (!book) return res.status(404).json({ message: 'Book not found' });
            res.json(book);
        } catch (err) {
            console.error('Error getting book by userID and bookId:', err);
            res.status(500).json({ error: 'Failed to fetch book' });
        }
    },
    // getByName: async (req, res) => {
    //     try {
    //         const book = await booksModel.getByName(req.params.Book_Name);
    //         if (!book) return res.status(404).json({ message: 'Book not found' });
    //         res.json(book);
    //     } catch (err) {
    //         console.error('Error getting book by Name:', err);
    //         res.status(500).json({ error: 'Failed to fetch book' });
    //     }
    // },

    Create: async (req, res) => {
        const {
            User_Id, Book_Id, Purchase_Date, Bookmark_On_Page
        } = req.body;

        const book = await booksModel.getById(Book_Id);
        const user = await usersModel.getById(User_Id);
        if(book==null){
            return res.status(400).json({ error: "Invalid bookId" });
        }
        if(user==null){
            return res.status(400).json({ error: "Invalid userId" });
        }
        if (Bookmark_On_Page < 0 || Bookmark_On_Page > book.number_Of_Page) {
            return res.status(400).json({ error: "Invalid bookmark page" });
        }
        if(Purchase_Date<Book_Id.Editing_Date||Purchase_Date>Date.now()){
            return res.status(400).json({ error: "Invalid purchace date" });
        }
        try {
        const result = await libraryModel.Create({User_Id, Book_Id, Purchase_Date, Bookmark_On_Page});

        console.log("Book In Library added successfully:", result);
        res.status(201).json({ message: "Book In Library added successfully", bookId: result.bookId });
    } catch(err) {
        console.error("Error adding the library book to the database:", err);
        res.status(500).json({ error: "Error adding the library book" });
    }
},
    update: async (req, res) => {
        
        const {User_Id,Book_Id} = req.params;
        const {
             Purchase_Date, Bookmark_On_Page
        } = req.body;
           
        const PreviousBookData = await libraryModel.getByUserIdAndBookId(User_Id,Book_Id);
        console.log("update",User_Id,",",Book_Id,",",PreviousBookData);
        if (!PreviousBookData) {
            return res.status(404).json({ error: "Library Book not found" });
        }
        

        try {
            const updated = await libraryModel.update(User_Id,Book_Id, {
                Purchase_Date: Purchase_Date || PreviousBookData.Purchase_Date,
                Bookmark_On_Page: Bookmark_On_Page || PreviousBookData.Bookmark_On_Page,
            });

            if (!updated) {
                return res.status(404).json({ error: "Library Book not found to update" });
            }

            res.json({ message: "Library Book updated successfully" });
        } catch (err) {
            console.error("Error updating Library book:", err);
            res.status(500).json({ error: "Failed to update Library book" });
        }
    }
        ,
        delete: async (req, res) => {
            const {User_Id,Book_Id} = req.params;

            try {
                const deleted = await libraryModel.delete(User_Id,Book_Id);
                if (!deleted) {
                    return res.status(404).json({ error: "Library Book not found to delete" });
                }

                res.json({ message: "Library Book deleted successfully" });
            } catch (err) {
                console.error("Error deleting Library book:", err);
                res.status(500).json({ error: "Failed to delete Library book" });
            }
        }

};

export default library;


import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import commentsModel from "../modules/comments.js";
import path from "path";
import fs from "fs";
import { create } from "domain";
import booksModel from "../modules/books.js";


const commentsController = {
    getAll: async (req, res) => {


        try {
            const comments = await commentsModel.getAll() || [];

            const commentsWithImage = comments.map(comment => {
                const id = comment.Id;
                const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

                let imageUrl = null;

                for (const ext of possibleExtensions) {
                    const imagePath = path.join(picturesDir, `${id}${ext}`);
                    if (fs.existsSync(imagePath)) {
                        imageUrl = `/comment-images/${id}${ext}`;
                        break;
                    }
                }

                return {
                    ...comment,
                    imageUrl  // null אם לא קיימת תמונה
                };
            });

            res.json(commentsWithImage);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch comments' });
        }
    },

    getById: async (req, res) => {
        try {
            const comment = await commentsModel.getById(req.params.commentId);
            if (!comment) return res.status(404).json({ message: 'comment not found' });
            res.json(comment);
        } catch (err) {
            console.error('Error getting comment by ID:', err);
            res.status(500).json({ error: 'Failed to fetch comment' });
        }
    },
    getAllByBookId: async (req, res) => {
        const bookId = req.params.bookId;
        try {
            const comment = await commentsModel.getAllByBookId(bookId);
            if (!comment) return res.status(404).json({ message: 'comment not found' });
            res.json(comment);
        } catch (err) {
            console.error('Error getting comment by ID:', err);
            res.status(500).json({ error: 'Failed to fetch comment' });
        }
    },
    add: async (req, res) => {
        console.log("Adding comment for book ID:", req.params.bookId);
        try {
            const bookId = req.params.bookId;
            const userId = req.user.id;
            const { title, content } = req.body;
            if (!bookId || !userId || !title || !content) {
                return res.status(400).json({ error: "All required fields must be filled" });
            }
            const book_Id=await booksModel.getById(bookId);
            if (!book_Id) {
                return res.status(404).json({ error: "Book not found" });
            }
           const Created_At = new Date().toISOString().slice(0, 19).replace('T', ' ');
            console.log(Created_At);
            const result =  commentsModel.add({
                bookId: bookId, userId: userId, title: title, content: content, Created_At: Created_At
            });

            console.log("sucsses");
            res.status(201).json({ message: "commit added successfully", commentId: result.Id });
        } catch (err) {
            res.status(500).json({ error: "Error adding the order details" });
        }
    },

    update: async (req, res) => {
        const commentId = req.params.commentId;
        const Seller_Id = req.user.id;

        const {
            comment_Name, author, number_Of_Page, Price,
            Category, Note, Status, Editing_Date
        } = req.body;

        const validStatuses = ['offered', 'approved', 'available', 'sold'];
        if (!validStatuses.includes(Status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const user = await usersModel.getById(Seller_Id);
        if (!user) {
            return res.status(400).json({ error: "Seller not found" });
        }

        const previous = await commentsModel.getById(commentId);
        if (!previous) {
            return res.status(404).json({ error: "comment not found" });
        }

        try {
            const updated = await commentsModel.update(commentId, {
                comment_Name: comment_Name || previous.comment_Name,
                author: author || previous.author,
                number_Of_Page: number_Of_Page || previous.number_Of_Page,
                Price: Price || previous.Price,
                Category: Category || previous.Category,
                Note: Note || previous.Note,
                Status: Status || previous.Status,
                Seller_Id: Seller_Id || previous.Seller_Id,
                Editing_Date: Editing_Date || previous.Editing_Date,
            });

            if (!updated) {
                return res.status(404).json({ error: "comment not found to update" });
            }

            res.json({ message: "comment updated successfully" });
        } catch (err) {
            console.error("Error updating comment:", err);
            res.status(500).json({ error: "Failed to update comment" });
        }
    },

    delete: async (req, res) => {
        const commentId = req.params.commentId;

        try {
            const deleted = await commentsModel.delete(commentId);
            if (!deleted) {
                return res.status(404).json({ error: "comment not found to delete" });
            }

            res.json({ message: "comment deleted successfully" });
        } catch (err) {
            console.error("Error deleting comment:", err);
            res.status(500).json({ error: "Failed to delete comment" });
        }
    }
};

export default commentsController;

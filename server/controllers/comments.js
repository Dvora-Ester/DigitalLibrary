
import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import commentsModel from "../modules/comments.js";
import path from "path";
import fs from "fs";
import booksModel from "../modules/books.js";
import {
  addCommentSchema,
  updateCommentSchema,
} from "../middleware/validation.js";

const picturesDir = path.join(process.cwd(), "pictures_of_comments");

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
          imageUrl
        };
      });

      res.json(commentsWithImage);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  },

  getById: async (req, res) => {
    const { error } = getByIdSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const comment = await commentsModel.getById(req.params.commentId);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });
      res.json(comment);
    } catch (err) {
      console.error('Error getting comment by ID:', err);
      res.status(500).json({ error: 'Failed to fetch comment' });
    }
  },

  getAllByBookId: async (req, res) => {
    // const { error } = getAllByBookIdSchema.validate(req.params);
    // if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const comments = await commentsModel.getAllByBookId(req.params.bookId);
      console.log(comments)
      if (!comments || comments.length === 0) {
        return res.json(comments||[]);
      }
      res.json(comments);
    } catch (err) {
      console.error('Error getting comments by book ID:', err);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  },

  add: async (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;
    const { title, content } = req.body;

    const { error } = addCommentSchema.validate({ bookId, userId, title, content });
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const book = await booksModel.getById(bookId);
      console.log("book",book)
      if (!book) return res.status(404).json({ error: "Book not found" });

      const Created_At = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const result = await commentsModel.add({
        bookId,
        userId,
        title,
        content,
        Created_At
      });
console.log("result",result);
      res.status(201).json({ message: "Comment added successfully", commentId: result.commentId });
    } catch (err) {
      console.error('Error adding comment:', err);
      res.status(500).json({ error: "Error adding the comment" });
    }
  },

  update: async (req, res) => {
    const commentId = req.params.commentId;
    const Seller_Id = req.user.id;
    const {
      comment_Name, author, number_Of_Page, Price,
      Category, Note, Status, Editing_Date
    } = req.body;

    const { error } = updateCommentSchema.validate({
      comment_Name, author, number_Of_Page, Price,
      Category, Note, Status, Editing_Date
    });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const validStatuses = ['offered', 'approved', 'available', 'sold'];
    if (Status && !validStatuses.includes(Status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    try {
      const user = await usersModel.getById(Seller_Id);
      if (!user) return res.status(404).json({ error: "Seller not found" });

      const previous = await commentsModel.getById(commentId);
      if (!previous) return res.status(404).json({ error: "Comment not found" });

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
        return res.status(404).json({ error: "Comment not found to update" });
      }

      res.json({ message: "Comment updated successfully" });
    } catch (err) {
      console.error("Error updating comment:", err);
      res.status(500).json({ error: "Failed to update comment" });
    }
  },

  delete: async (req, res) => {
    const { error } = deleteCommentSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const commentId = req.params.commentId;

    try {
      const deleted = await commentsModel.delete(commentId);
      if (!deleted) {
        return res.status(404).json({ error: "Comment not found to delete" });
      }
      res.json({ message: "Comment deleted successfully" });
    } catch (err) {
      console.error("Error deleting comment:", err);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  }
};

export default commentsController;


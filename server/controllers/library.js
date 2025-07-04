import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import libraryModel from "../modules/library.js";
import booksModel from "../modules/books.js";
import path from "path";
import fs from "fs";
import {
  getByUserIdSchema,
  getByUserIdAndBookIdSchema,
  getBookPageImageSchema,
  addToLibrarySchema,
  updateLibrarySchema,
  deleteLibrarySchema
} from "../middleware/validation.js"; // נניח שזה הנתיב

const picturesDir = path.join(process.cwd(), "pictures_of_books");

const library = {
  getAll: async (req, res) => {
    try {
      const booksInLibrary = await libraryModel.getAll() || [];
      res.json(booksInLibrary);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  },

  getByUserId: async (req, res) => {
    
    const User_Id = req.user.id;
    console.log(User_Id);
    try {
      const books = await libraryModel.getByUserId(User_Id);
      console.log("boooooooooooooooooks",books);
      if (!books || books.length === 0) {
        return res.status(404).json({ message: 'לא נמצאו ספרים עבור המשתמש' });
      }

      const booksWithMedia = books.map(book => {
        const id = book.Id;
        let imageUrl = null;

        const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        for (const ext of possibleExtensions) {
          const imgPath = path.join(picturesDir, `${id}${ext}`);
          if (fs.existsSync(imgPath)) {
            imageUrl = `/book-images/${id}${ext}`;
            break;
          }
        }

        return {
          ...book,
          imageUrl,
        };
      });

      return res.status(200).json(booksWithMedia);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'שגיאה בשרת, נסה שוב מאוחר יותר' });
    }
  },

  getByUserIdAndBookId: async (req, res) => {
    const { error } = getByUserIdAndBookIdSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const bookId = req.params.bookId;
    const userId = req.user.id;

    try {
      const book = await libraryModel.getByUserIdAndBookId(userId, bookId);
      console.log(book)
      if (!book) {
        return res.status(404).json({ message: 'הספר לא נמצא או אין הרשאה לצפות בו' });
      }

      const filePath = path.join(process.cwd(), `books_storage/${bookId}.pdf`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'קובץ PDF לא נמצא' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="book.pdf"');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'שגיאה בשרת, נסה שוב מאוחר יותר' });
    }
  },

  getBookPageImage: async (req, res) => {
    const { error } = getBookPageImageSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { bookId, pageNum } = req.params;
    const userId = req.user.id;

    try {
      const book = await libraryModel.getByUserIdAndBookId(userId, bookId);
      if (!book) {
        return res.status(403).json({ message: "אין גישה לספר הזה" });
      }

      const imagePath = path.join(
        process.cwd(),
        'book_pages',
        String(bookId),
        `page${pageNum}.png`
      );

      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ message: "עמוד לא נמצא" });
      }

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'inline; filename="page.png"');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const stream = fs.createReadStream(imagePath);
      stream.pipe(res);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "שגיאה בשרת" });
    }
  },

  add: async (userId, orderId, orderedBookIds, Bookmark_On_Page, res) => {
    const { error } = addToLibrarySchema.validate({ userId, orderId, orderedBookIds, Bookmark_On_Page });
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      for (const bookId of orderedBookIds) {
        await libraryModel.add({
          userId,
          orderId,
          bookId,
          Bookmark_On_Page
        });
      }
      return orderId;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error adding the order details" });
    }
  },

  update: async (req, res) => {
    const dataToValidate = { ...req.params, ...req.body };
    const { error } = updateLibrarySchema.validate(dataToValidate);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { User_Id, Book_Id } = req.params;
    const { Purchase_Date, Bookmark_On_Page } = req.body;

    try {
      const PreviousBookData = await libraryModel.getByUserIdAndBookId(User_Id, Book_Id);
      if (!PreviousBookData) {
        return res.status(404).json({ error: "Library Book not found" });
      }

      const updated = await libraryModel.update(User_Id, Book_Id, {
        Purchase_Date: Purchase_Date || PreviousBookData.Purchase_Date,
        Bookmark_On_Page: Bookmark_On_Page || PreviousBookData.Bookmark_On_Page,
      });

      if (!updated) {
        return res.status(404).json({ error: "Library Book not found to update" });
      }

      res.json({ message: "Library Book updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update Library book" });
    }
  },

  delete: async (req, res) => {
    const { error } = deleteLibrarySchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { bookId } = req.params;
    const userId = req.user.id;

    try {
      const deleted = await libraryModel.delete(userId, bookId);
      if (!deleted) {
        return res.status(404).json({ error: "Library Book not found to delete" });
      }

      res.json({ message: "Library Book deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete Library book" });
    }
  }
};

export default library;

import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import booksModel from "../modules/books.js";
import { renderPdfToImages } from '../middleware/pdfToImages.js';
import path from "path";
import fs from "fs";
import {
  addBookSchema,
  updateBookSchema,
  bookIdParamSchema,
  paginationQuerySchema,
  statusParamSchema
} from "../middleware/validation.js";

const picturesDir = path.join(process.cwd(), 'pictures_of_books');

const Books = {

  begingetAll: async (req, res) => {
    try {
      const books = await booksModel.getAll() || [];

      const booksWithImage = books.map(book => {
        const id = book.Id;
        const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

        let imageUrl = null;

        for (const ext of possibleExtensions) {
          const imagePath = path.join(picturesDir, `${id}${ext}`);
          if (fs.existsSync(imagePath)) {
            imageUrl = `/book-images/${id}${ext}`;
            break;
          }
        }

        return {
          ...book,
          imageUrl
        };
      });

      res.json(booksWithImage);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  },
  filterBy: async (req, res) => {
    const value = req.params.value;
    const filterBy = req.params.filterBy;
    const page = parseInt(req.params.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    console.log("getAll books controller", page, limit, offset, value, filterBy);
    try {
      const books = await booksModel.getFilterBy(limit, offset, value, filterBy) || [];
      const totalCount = books.length;// סך כל הספרים

      const booksWithImage = books.map(book => {
        const id = book.Id;
        const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        let imageUrl = null;

        for (const ext of possibleExtensions) {
          const imagePath = path.join(picturesDir, `${id}${ext}`);
          if (fs.existsSync(imagePath)) {
            imageUrl = `/book-images/${id}${ext}`;
            break;
          }
        }

        return {
          ...book,
          imageUrl
        };
      });

      res.json({
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        books: booksWithImage
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  },
  getAll: async (req, res) => {
    const { error } = paginationQuerySchema.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
      const books = await booksModel.getAllPaginated(limit, offset) || [];
      const totalCount = await booksModel.getTotalCount();

      const booksWithImage = books.map(book => {
        const id = book.Id;
        const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        let imageUrl = null;

        for (const ext of possibleExtensions) {
          const imagePath = path.join(picturesDir, `${id}${ext}`);
          if (fs.existsSync(imagePath)) {
            imageUrl = `/book-images/${id}${ext}`;
            break;
          }
        }

        return {
          ...book,
          imageUrl
        };
      });

      res.json({
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        books: booksWithImage
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  },

  getByStatus: async (req, res) => {
    const { error: paramError } = statusParamSchema.validate(req.params);
    if (paramError) return res.status(400).json({ error: paramError.details[0].message });
    const { error: queryError } = paginationQuerySchema.validate(req.query);
    if (queryError) return res.status(400).json({ error: queryError.details[0].message });

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const status = req.params.Status;

    try {
      const books = await booksModel.getByStatus(limit, offset, status) || [];
      const totalCount = await booksModel.getTotalCountByStatus(status);

      const booksWithImage = books.map(book => {
        const id = book.Id;
        const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        let imageUrl = null;

        for (const ext of possibleExtensions) {
          const imagePath = path.join(picturesDir, `${id}${ext}`);
          if (fs.existsSync(imagePath)) {
            imageUrl = `/book-images/${id}${ext}`;
            break;
          }
        }

        return {
          ...book,
          imageUrl
        };
      });

      res.json({
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        books: booksWithImage
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  },

  getById: async (req, res) => {
    const { error } = bookIdParamSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const book = await booksModel.getById(req.params.bookId);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.json(book);
    } catch (err) {
      console.error('Error getting book by ID:', err);
      res.status(500).json({ error: 'Failed to fetch book' });
    }
  },
  getByStatusAndUserId: async (req, res) => {
    try {
      const books = await booksModel.getByStatusAndUserId(req.params.status, req.user.id);
      if (!books || books.length === 0) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const booksWithImage = books.map(book => {
        const id = book.Id;
        const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        let imageUrl = null;

        for (const ext of possibleExtensions) {
          const imagePath = path.join(picturesDir, `${id}${ext}`);
          if (fs.existsSync(imagePath)) {
            imageUrl = `/book-images/${id}${ext}`;
            break;
          }
        }

        return {
          ...book,
          imageUrl
        };
      });

      res.json(booksWithImage); // ⬅️ שימי לב – זה מה שהיה חסר
    } catch (err) {
      console.error('Error getting book by status and user ID:', err);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  },
  add: async (req, res) => {
    const pdfFile = req.files?.bookFile?.[0];
    const imageFile = req.files?.bookImage?.[0];
    console.log("1#");
    if (!pdfFile) {
      return res.status(400).json({ error: "חובה לצרף קובץ PDF של הספר" });
    }
    console.log("2#");
    const validationPayload = {
      ...req.body,
      Seller_Id: req.user.id,
    };
    console.log("3#");
     console.log("4#", validationPayload);
    try {
      const result = await booksModel.add(validationPayload);
      console.log("result", result)
      const bookId = result.bookId;

      const pdfTargetPath = path.join(process.cwd(), 'books_storage', `${bookId}.pdf`);
      fs.renameSync(pdfFile.path, pdfTargetPath);

      if (imageFile) {
        const imageExt = path.extname(imageFile.originalname).toLowerCase();
        const imageTargetPath = path.join(process.cwd(), 'pictures_of_books', `${bookId}${imageExt}`);
        fs.renameSync(imageFile.path, imageTargetPath);
      }

      await renderPdfToImages(pdfTargetPath, bookId);

      res.status(201).json({ message: "הספר נוסף והומר בהצלחה", bookId });

    } catch (err) {
      console.error("❌ שגיאה בהוספת ספר:", err);
      res.status(500).json({ error: "שגיאת שרת בעת הוספת הספר" });
    }
  },

  update: async (req, res) => {
    const bookId = req.params.bookId;
    const updatedBook = req.body;

    console.log("Update request received for book:", bookId, updatedBook);

    const validStatuses = ['offered', 'approved', 'available', 'sold'];
    if (!validStatuses.includes(updatedBook.Status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const user = await usersModel.getById(updatedBook.Seller_Id);
    if (!user) {
      return res.status(400).json({ error: "Seller not found" });
    }

    const previous = await booksModel.getById(bookId);
    if (!previous) {
      return res.status(404).json({ error: "Book not found" });
    }

    try {
      const updated = await booksModel.update(bookId, updatedBook);

      if (!updated) {
        return res.status(404).json({ error: "Book not found to update" });
      }

      res.json({ message: "Book updated successfully" });
    } catch (err) {
      console.error("Error updating book:", err);
      res.status(500).json({ error: "Failed to update book" });
    }
  },

  delete: async (req, res) => {
    const { error } = bookIdParamSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const bookId = req.params.bookId;

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

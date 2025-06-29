
// import bcrypt from "bcrypt";
// import usersModel from "../modules/user.js";
// import booksModel from "../modules/books.js";
// import { renderPdfToImages } from '../middleware/pdfToImages.js';
// import path from "path";
// import fs from "fs";
// const picturesDir = path.join(process.cwd(), 'pictures_of_books');

// const Books = {

//   begingetAll: async (req, res) => {


//     try {
//       const books = await booksModel.getAll() || [];

//       const booksWithImage = books.map(book => {
//         const id = book.Id;
//         const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

//         let imageUrl = null;

//         for (const ext of possibleExtensions) {
//           const imagePath = path.join(picturesDir, `${id}${ext}`);
//           if (fs.existsSync(imagePath)) {
//             imageUrl = `/book-images/${id}${ext}`;
//             break;
//           }
//         }

//         return {
//           ...book,
//           imageUrl  // null אם לא קיימת תמונה
//         };
//       });

//       res.json(booksWithImage);

//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to fetch books' });
//     }
//   },
//   getAll: async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 10;
//     const offset = (page - 1) * limit;
//     console.log("getAll books controller", page, limit, offset);
//     try {
//       const books = await booksModel.getAllPaginated(limit, offset) || [];
//       const totalCount = await booksModel.getTotalCount(); // סך כל הספרים

//       const booksWithImage = books.map(book => {
//         const id = book.Id;
//         const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
//         let imageUrl = null;

//         for (const ext of possibleExtensions) {
//           const imagePath = path.join(picturesDir, `${id}${ext}`);
//           if (fs.existsSync(imagePath)) {
//             imageUrl = `/book-images/${id}${ext}`;
//             break;
//           }
//         }

//         return {
//           ...book,
//           imageUrl
//         };
//       });

//       res.json({
//         totalCount,
//         currentPage: page,
//         totalPages: Math.ceil(totalCount / limit),
//         books: booksWithImage
//       });

//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to fetch books' });
//     }
//   }
//   ,
//   getByStatus: async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 10;
//     const offset = (page - 1) * limit;
//     console.log("getAll books controller", page, limit, offset);
//     console.log("Status books controller", req.params.Status);

// try {
//       const books = await booksModel.getByStatus(limit, offset, req.params.Status) || [];
//       const totalCount = await booksModel.getTotalCountByStatus(req.params.Status); // סך כל הספרים

//       const booksWithImage = books.map(book => {
//         const id = book.Id;
//         const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
//         let imageUrl = null;

//         for (const ext of possibleExtensions) {
//           const imagePath = path.join(picturesDir, `${id}${ext}`);
//           if (fs.existsSync(imagePath)) {
//             imageUrl = `/book-images/${id}${ext}`;
//             break;
//           }
//         }

//         return {
//           ...book,
//           imageUrl
//         };
//       });

//       res.json({
//         totalCount,
//         currentPage: page,
//         totalPages: Math.ceil(totalCount / limit),
//         books: booksWithImage
//       });

//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to fetch books' });
//     }
//     // try {
//     //   const books = await booksModel.getByStatus(req.params.Status);
//     //   // if (!books || books.length === 0) {res.json([]);}
//     //   res.json(books);
//     // } catch (err) {
//     //   console.error('Error getting books by status:', err);
//     //   res.status(500).json({ error: 'Failed to fetch books' });
//     // }
//   },
//   getById: async (req, res) => {
//     try {
//       const book = await booksModel.getById(req.params.bookId);
//       if (!book) return res.status(404).json({ message: 'Book not found' });
//       res.json(book || []);
//     } catch (err) {
//       console.error('Error getting book by ID:', err);
//       res.status(500).json({ error: 'Failed to fetch book' });
//     }
//   },

//   addWasGood: async (req, res) => {
//     console.log("📁 PDF file:", req.files?.bookFile?.[0]);
//     console.log("🖼️ Image file:", req.files?.bookImage?.[0]);
//     console.log("📝 Body:", req.body);

//     const pdfFile = req.files?.bookFile?.[0];
//     const imageFile = req.files?.bookImage?.[0];

//     if (!pdfFile) {
//       return res.status(400).json({ error: "PDF file is required" });
//     }

//     // המשך כמו קודם:
//     const result = await booksModel.add({
//       ...req.body,
//       Seller_Id: req.user.id,
//     });

//     const bookId = result.bookId;

//     // שמירת PDF
//     const newPdfPath = path.join(process.cwd(), 'books_storage', `${bookId}.pdf`);
//     fs.renameSync(pdfFile.path, newPdfPath);

//     // שמירת תמונה (אם קיימת)
//     if (imageFile) {
//       const imageExt = path.extname(imageFile.originalname);
//       const newImagePath = path.join(process.cwd(), 'pictures_of_books', `${bookId}${imageExt}`);
//       fs.renameSync(imageFile.path, newImagePath);
//     }

//     res.status(201).json({ message: "Book added successfully", bookId });
//   },
//   add: async (req, res) => {
//     try {
//       console.log("📁 PDF file:", req.files?.bookFile?.[0]);
//       console.log("🖼️ Image file:", req.files?.bookImage?.[0]);
//       console.log("📝 Body:", req.body);

//       const pdfFile = req.files?.bookFile?.[0];
//       const imageFile = req.files?.bookImage?.[0];

//       if (!pdfFile) {
//         return res.status(400).json({ error: "חובה לצרף קובץ PDF של הספר" });
//       }

//       // 🧾 שלב 1: הוספת ספר למסד הנתונים
//       const result = await booksModel.add({
//         ...req.body,
//         Seller_Id: req.user.id,
//       });

//       const bookId = result.bookId;

//       // 📂 שלב 2: שמירת קובץ PDF בשם קבוע לפי bookId
//       const pdfTargetPath = path.join(process.cwd(), 'books_storage', `${bookId}.pdf`);
//       fs.renameSync(pdfFile.path, pdfTargetPath);

//       // 🖼️ שלב 3: שמירת תמונת עטיפה (אם יש)
//       if (imageFile) {
//         const imageExt = path.extname(imageFile.originalname).toLowerCase();
//         const imageTargetPath = path.join(process.cwd(), 'pictures_of_books', `${bookId}${imageExt}`);
//         fs.renameSync(imageFile.path, imageTargetPath);
//       }

//       // 🖼️ שלב 4: המרת PDF לתמונות (כל עמוד לתמונה)
//       await renderPdfToImages(pdfTargetPath, bookId);

//       // ✅ סיום
//       res.status(201).json({ message: "הספר נוסף והומר בהצלחה", bookId });

//     } catch (err) {
//       console.error("❌ שגיאה בהוספת ספר:", err);
//       res.status(500).json({ error: "שגיאת שרת בעת הוספת הספר" });
//     }
//   },

//   update: async (req, res) => {
//     const bookId = req.params.bookId;
//     const updatedBook = req.body;

//     console.log("Update request received for book:", bookId, updatedBook);

//     const validStatuses = ['offered', 'approved', 'available', 'sold'];
//     if (!validStatuses.includes(updatedBook.Status)) {
//       return res.status(400).json({ error: "Invalid status" });
//     }

//     const user = await usersModel.getById(updatedBook.Seller_Id);
//     if (!user) {
//       return res.status(400).json({ error: "Seller not found" });
//     }

//     const previous = await booksModel.getById(bookId);
//     if (!previous) {
//       return res.status(404).json({ error: "Book not found" });
//     }

//     try {
//       const updated = await booksModel.update(bookId, updatedBook);

//       if (!updated) {
//         return res.status(404).json({ error: "Book not found to update" });
//       }

//       res.json({ message: "Book updated successfully" });
//     } catch (err) {
//       console.error("Error updating book:", err);
//       res.status(500).json({ error: "Failed to update book" });
//     }
//   },

//   delete: async (req, res) => {
//     const bookId = req.params.bookId;

//     try {
//       const deleted = await booksModel.delete(bookId);
//       if (!deleted) {
//         return res.status(404).json({ error: "Book not found to delete" });
//       }

//       res.json({ message: "Book deleted successfully" });
//     } catch (err) {
//       console.error("Error deleting book:", err);
//       res.status(500).json({ error: "Failed to delete book" });
//     }
//   }
// };

// export default Books;

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
  filterBy:async(req,res)=>{
         const value=req.params.value;
         const filterBy=req.params.filterBy;
         const page=parseInt(req.params.page)||1;
         const limit = 10;
         const offset = (page - 1) * limit;
         console.log("getAll books controller", page, limit, offset,value,filterBy);
        try {
      const books = await booksModel.getFilterBy( limit, offset,value,filterBy) || [];
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

  add: async (req, res) => {
    const pdfFile = req.files?.bookFile?.[0];
    const imageFile = req.files?.bookImage?.[0];

    if (!pdfFile) {
      return res.status(400).json({ error: "חובה לצרף קובץ PDF של הספר" });
    }

    const validationPayload = {
      ...req.body,
      Seller_Id: req.user.id,
    };

    const { error } = addBookSchema.validate(validationPayload);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const result = await booksModel.add(validationPayload);
      const bookId = result.bookId;

      // שמירת קובץ PDF בשם קבוע לפי bookId
      const pdfTargetPath = path.join(process.cwd(), 'books_storage', `${bookId}.pdf`);
      fs.renameSync(pdfFile.path, pdfTargetPath);

      // שמירת תמונת עטיפה (אם יש)
      if (imageFile) {
        const imageExt = path.extname(imageFile.originalname).toLowerCase();
        const imageTargetPath = path.join(process.cwd(), 'pictures_of_books', `${bookId}${imageExt}`);
        fs.renameSync(imageFile.path, imageTargetPath);
      }

      // המרת PDF לתמונות (כל עמוד לתמונה)
      await renderPdfToImages(pdfTargetPath, bookId);

      res.status(201).json({ message: "הספר נוסף והומר בהצלחה", bookId });

    } catch (err) {
      console.error("❌ שגיאה בהוספת ספר:", err);
      res.status(500).json({ error: "שגיאת שרת בעת הוספת הספר" });
    }
  },

  // update: async (req, res) => {
  //   // const { error: paramError } = bookIdParamSchema.validate(req.params);
  //   // if (paramError) return res.status(400).json({ error: paramError.details[0].message });

  //   const bookId = req.params.bookId;
  //   const updatedBook = req.body;

  //   const { error: bodyError } = updateBookSchema.validate(updatedBook);
  //   if (bodyError) return res.status(400).json({ error: bodyError.details[0].message });
  //   console.log("1#");
  //   const validStatuses = ['offered', 'approved', 'available', 'sold'];
  //   if (updatedBook.Status && !validStatuses.includes(updatedBook.Status)) {
  //     return res.status(400).json({ error: "Invalid status" });
  //   }
  //   console.log("2#");
  //   try {
  //     const user = await usersModel.getById(updatedBook.Seller_Id);
  //     if (!user) {
  //       return res.status(404).json({ error: "Seller not found" });
  //     }

  //     const previous = await booksModel.getById(bookId);
  //     if (!previous) {
  //       return res.status(404).json({ error: "Book not found" });
  //     }

  //     const updated = await booksModel.update(bookId, updatedBook);
  //     console.log("3#");
  //     if (!updated) {
  //       return res.status(404).json({ error: "Book not found to update" });
  //     }

  //     res.json({ message: "Book updated successfully" });
  //   } catch (err) {
  //     console.error("Error updating book:", err);
  //     res.status(500).json({ error: "Failed to update book" });
  //   }
  // },
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

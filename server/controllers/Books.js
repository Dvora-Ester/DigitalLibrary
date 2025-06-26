// import bcrypt from "bcrypt";
// import usersModel from "../modules/user.js";
// import booksModel from "../modules/books.js"; // ודא שיש מודול כזה
// import { generateToken } from "../middleware/outh.js";

// const Books = {
//     getAll: async (req, res) => {
//         try {

//             const books = await booksModel.getAll() ||[];
//             console.log(books);
//             res.json(books);
//         } catch (err) {
//             console.error(err);
//             res.status(500).json({ error: 'Failed to fetch books' });
//         }
//     },

//     getById: async (req, res) => {
//         try {
//             const book = await booksModel.getById(req.params.bookId);
//             if (!book) return res.status(404).json({ message: 'Book not found' });
//             res.json(book);
//         } catch (err) {
//             console.error('Error getting book by ID:', err);
//             res.status(500).json({ error: 'Failed to fetch book' });
//         }
//     },
//     // getByName: async (req, res) => {
//     //     try {
//     //         const book = await booksModel.getByName(req.params.Book_Name);
//     //         if (!book) return res.status(404).json({ message: 'Book not found' });
//     //         res.json(book);
//     //     } catch (err) {
//     //         console.error('Error getting book by Name:', err);
//     //         res.status(500).json({ error: 'Failed to fetch book' });
//     //     }
//     // },

//     Create: async (req, res) => {
//         const Seller_Id = req.user.id;
//         console.log("Adding book for user ID:", Seller_Id);
//         const {
//             Book_Name, author, number_Of_Page, Price,
//             Category, Note, Status, Editing_Date
//         } = req.body;

//         // בדיקת שדות חובה
//         if (!Book_Name || !author || !number_Of_Page || !Price ||
//             !Category || !Note || !Status || !Seller_Id || !Editing_Date) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         // בדיקת ערכי סטטוס תקינים
//         const validStatuses = ['offered', 'approved', 'available', 'sold'];
//         if (!validStatuses.includes(Status)) {
//             return res.status(400).json({ error: "Status must be one of: offered, approved, available, sold" });
//         }

//         // בדיקת מספרים חיוביים
//         if (number_Of_Page < 1 || Price < 1) {
//             return res.status(400).json({ error: "Number of pages and price must be positive numbers" });
//         }

//         // בדיקה אם המשתמש קיים
//         const ExistingUser = await usersModel.getById(Seller_Id);
//         if (!ExistingUser) {
//             return res.status(400).json({ error: "Seller with provided ID does not exist" });
//         }

//         try {
//             const result = await booksModel.Create({
//                 Book_Name, author, number_Of_Page, Price,
//                 Category, Note, Status, Seller_Id, Editing_Date
//             });

//             console.log("Book added successfully:", result);
//             res.status(201).json({ message: "Book added successfully", bookId: result.bookId });
//         } catch (err) {
//             console.error("Error adding the book to the database:", err);
//             res.status(500).json({ error: "Error adding the book" });
//         }
//     },
//     update: async (req, res) => {
// console.log("books update");
//         const bookId = req.params.bookId;
//         const {
//             Book_Name, author, number_Of_Page, Price,
//             Category, Note, Status, Seller_Id, Editing_Date
//         } = req.body;
//         const PreviousBookData = await booksModel.getById(bookId);
//         if (!PreviousBookData) {
//     return res.status(404).json({ error: "Book not found" });
// }
//         // בדיקת שדות חובה
//         if (!Book_Name || !author || !number_Of_Page || !Price ||
//             !Category || !Note || !Status || !Seller_Id || !Editing_Date) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         // בדיקת סטטוס חוקי
//         const validStatuses = ['offered', 'approved', 'available', 'sold'];
//         if (!validStatuses.includes(Status)) {
//             return res.status(400).json({ error: "Invalid status" });
//         }

//         // בדיקת מספרים חיוביים
//         if (number_Of_Page < 1 || Price < 1) {
//             return res.status(400).json({ error: "Number of pages and price must be positive" });
//         }

//         // בדיקת קיום המשתמש
//         const existingUser = await usersModel.getById(Seller_Id);
//         if (!existingUser) {
//             return res.status(400).json({ error: "Seller not found" });
//         }

//         try {
//             const updated = await booksModel.update(bookId, {
//                 Book_Name: Book_Name || PreviousBookData.Book_Name,
//                 author: author || PreviousBookData.author,
//                 number_Of_Page: number_Of_Page || PreviousBookData.number_Of_Page,
//                 Price: Price || PreviousBookData.Price,
//                 Category: Category || PreviousBookData.Category,
//                 Note: Note || PreviousBookData.Note,
//                 Status: Status || PreviousBookData.status,
//                 Seller_Id: Seller_Id || PreviousBookData.Seller_Id,
//                 Editing_Date: Editing_Date || PreviousBookData.Editing_Date
//             });

//             if (!updated) {
//                 return res.status(404).json({ error: "Book not found to update" });
//             }

//             res.json({ message: "Book updated successfully" });
//         } catch (err) {
//             console.error("Error updating book:", err);
//             res.status(500).json({ error: "Failed to update book" });
//         }
//     }
//     ,
//     delete: async (req, res) => {
//         const bookId = req.bookId;

//         try {
//             const deleted = await booksModel.delete(bookId);
//             if (!deleted) {
//                 return res.status(404).json({ error: "Book not found to delete" });
//             }

//             res.json({ message: "Book deleted successfully" });
//         } catch (err) {
//             console.error("Error deleting book:", err);
//             res.status(500).json({ error: "Failed to delete book" });
//         }
//     }

// };

// export default Books;
import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import booksModel from "../modules/books.js";
import { renderPdfToImages } from '../middleware/pdfToImages.js';
import path from "path";
import fs from "fs";
const picturesDir = path.join(process.cwd(), 'pictures_of_books');

const Books = {
  // 📚 קבלת כל הספרים של המשתמש הנוכחי
  // getAll: async (req, res) => {
  //   const userId = req.user.id;
  //   try {
  //     const books = await booksModel.getAllByUserId(userId) || [];
  //     res.json(books);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: 'Failed to fetch books' });
  //   }
  // },
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
          imageUrl  // null אם לא קיימת תמונה
        };
      });

      res.json(booksWithImage);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  },
  getAll: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    console.log("getAll books controller", page, limit, offset);
    try {
      const books = await booksModel.getAllPaginated(limit, offset) || [];
      const totalCount = await booksModel.getTotalCount(); // סך כל הספרים

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
  }
  ,
  getByStatus: async (req, res) => {
try {
      const books = await booksModel.getByStatus(req.params.Status);
     // if (!books || books.length === 0) {res.json([]);}
      res.json(books);
    } catch (err) {
      console.error('Error getting books by status:', err);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  },
  getById: async (req, res) => {
    try {
      const book = await booksModel.getById(req.params.bookId);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.json(book||[]);
    } catch (err) {
      console.error('Error getting book by ID:', err);
      res.status(500).json({ error: 'Failed to fetch book' });
    }
  },
  //העליון גרסה קודמת
  // add: async (req, res) => {
  //        console.log("📁 req.file:", req.file); // ← כאן את רואה את כל פרטי הקובץ שהגיע
  //   console.log("📝 req.body:", req.body); // ← כאן תראי את שדות הטופס האחרים
  //     console.log("BODY:", req.body);
  //     // console.log("FILE:", req.file);

  //     const Seller_Id = req.user.id;

  //     const {
  //       Book_Name, author, number_Of_Page, Price,
  //       Category, Note, Status, Editing_Date
  //     } = req.body;
  //     console.log("Adding book for user ID:", Seller_Id, Book_Name, author, number_Of_Page, Price,
  //       Category, Note, Status, Editing_Date);

  //     // אימות שדות חובה
  //     if (!Book_Name || !author || !number_Of_Page || !Price ||
  //       !Category || !Note || !Status || !Editing_Date) {
  //       return res.status(400).json({ error: "All fields are required" });
  //     }

  //     // בדיקת סטטוס חוקי
  //     const validStatuses = ['offered', 'approved', 'available', 'sold'];
  //     if (!validStatuses.includes(Status)) {
  //       return res.status(400).json({ error: "Invalid status" });
  //     }

  //     if (number_Of_Page < 1 || Price < 1) {
  //       return res.status(400).json({ error: "Pages and price must be positive" });
  //     }

  //     const user = await usersModel.getById(Seller_Id);
  //     if (!user) {
  //       return res.status(400).json({ error: "Seller not found" });
  //     }

  //     // בדיקת קובץ שהועלה
  //     if (!req.file) {
  //       return res.status(400).json({ error: "PDF file is required" });
  //     }

  //     const filePath = req.file.path;

  //     console.log("Adding book for user ID:", Seller_Id, Book_Name, author, number_Of_Page, Price,
  //   Category, Note, Status, Editing_Date, filePath);
  //   try {
  //     // שלב 1 – שמור את הספר במסד הנתונים, עדיין עם שם קובץ זמני
  //     const result = await booksModel.add({
  //       Book_Name,
  //       author,
  //       number_Of_Page,
  //       Price,
  //       Category,
  //       Note,
  //       Status,
  //       Seller_Id,
  //       Editing_Date,
  //       // File_Path: filePath  // זמני
  //     });

  //     const newBookId = result.bookId;

  //     // ודא שהנתיב לתיקייה נכון:
  //     const uploadFolder = path.join(process.cwd(),'books_storage');
  //     // שלב 2 – בנה שם קובץ חדש לפי ה־ID
  //     const newFileName = `${newBookId}.pdf`;
  //     const newFilePath = path.join(uploadFolder, newFileName);

  //     // שלב 3 – שנה את שם הקובץ בפועל
  //     fs.renameSync(filePath, newFilePath);

  //     // שלב 4 – עדכן את השם החדש במסד הנתונים (אם צריך)
  //     // await booksModel.updateFilePath(newBookId, newFileName);

  //     res.status(201).json({ message: "Book added successfully", bookId: newBookId });
  //   } catch (err) {
  //     console.error("Error adding book:", err);
  //     res.status(500).json({ error: "Error adding the book" });
  //   }
  // },

  addWasGood: async (req, res) => {
    console.log("📁 PDF file:", req.files?.bookFile?.[0]);
    console.log("🖼️ Image file:", req.files?.bookImage?.[0]);
    console.log("📝 Body:", req.body);

    const pdfFile = req.files?.bookFile?.[0];
    const imageFile = req.files?.bookImage?.[0];

    if (!pdfFile) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    // המשך כמו קודם:
    const result = await booksModel.add({
      ...req.body,
      Seller_Id: req.user.id,
    });

    const bookId = result.bookId;

    // שמירת PDF
    const newPdfPath = path.join(process.cwd(), 'books_storage', `${bookId}.pdf`);
    fs.renameSync(pdfFile.path, newPdfPath);

    // שמירת תמונה (אם קיימת)
    if (imageFile) {
      const imageExt = path.extname(imageFile.originalname);
      const newImagePath = path.join(process.cwd(), 'pictures_of_books', `${bookId}${imageExt}`);
      fs.renameSync(imageFile.path, newImagePath);
    }

    res.status(201).json({ message: "Book added successfully", bookId });
  },
   add: async (req, res) => {
    try {
      console.log("📁 PDF file:", req.files?.bookFile?.[0]);
      console.log("🖼️ Image file:", req.files?.bookImage?.[0]);
      console.log("📝 Body:", req.body);

      const pdfFile = req.files?.bookFile?.[0];
      const imageFile = req.files?.bookImage?.[0];

      if (!pdfFile) {
        return res.status(400).json({ error: "חובה לצרף קובץ PDF של הספר" });
      }

      // 🧾 שלב 1: הוספת ספר למסד הנתונים
      const result = await booksModel.add({
        ...req.body,
        Seller_Id: req.user.id,
      });

      const bookId = result.bookId;

      // 📂 שלב 2: שמירת קובץ PDF בשם קבוע לפי bookId
      const pdfTargetPath = path.join(process.cwd(), 'books_storage', `${bookId}.pdf`);
      fs.renameSync(pdfFile.path, pdfTargetPath);

      // 🖼️ שלב 3: שמירת תמונת עטיפה (אם יש)
      if (imageFile) {
        const imageExt = path.extname(imageFile.originalname).toLowerCase();
        const imageTargetPath = path.join(process.cwd(), 'pictures_of_books', `${bookId}${imageExt}`);
        fs.renameSync(imageFile.path, imageTargetPath);
      }

      // 🖼️ שלב 4: המרת PDF לתמונות (כל עמוד לתמונה)
      await renderPdfToImages(pdfTargetPath, bookId);

      // ✅ סיום
      res.status(201).json({ message: "הספר נוסף והומר בהצלחה", bookId });

    } catch (err) {
      console.error("❌ שגיאה בהוספת ספר:", err);
      res.status(500).json({ error: "שגיאת שרת בעת הוספת הספר" });
    }
  },


  //   add: async (req, res) => {
  //       console.log("📁 req.file:", req.file); // ← כאן את רואה את כל פרטי הקובץ שהגיע
  //   console.log("📝 req.body:", req.body); // ← כאן תראי את שדות הטופס האחרים
  //     console.log("BODY:", req.body);
  //     // console.log("FILE:", req.file);

  //     const Seller_Id = req.user.id;

  //     const {
  //       Book_Name, author, number_Of_Page, Price,
  //       Category, Note, Status, Editing_Date
  //     } = req.body;
  //     console.log("Adding book for user ID:", Seller_Id, Book_Name, author, number_Of_Page, Price,
  //       Category, Note, Status, Editing_Date);

  //     // אימות שדות חובה
  //     if (!Book_Name || !author || !number_Of_Page || !Price ||
  //       !Category || !Note || !Status || !Editing_Date) {
  //       return res.status(400).json({ error: "All fields are required" });
  //     }

  //     // בדיקת סטטוס חוקי
  //     const validStatuses = ['offered', 'approved', 'available', 'sold'];
  //     if (!validStatuses.includes(Status)) {
  //       return res.status(400).json({ error: "Invalid status" });
  //     }

  //     if (number_Of_Page < 1 || Price < 1) {
  //       return res.status(400).json({ error: "Pages and price must be positive" });
  //     }

  //     const user = await usersModel.getById(Seller_Id);
  //     if (!user) {
  //       return res.status(400).json({ error: "Seller not found" });
  //     }

  //     // בדיקת קובץ שהועלה
  //     if (!req.file) {
  //       return res.status(400).json({ error: "PDF file is required" });
  //     }

  //     const filePath = req.file.path;

  //     console.log("Adding book for user ID:", Seller_Id, Book_Name, author, number_Of_Page, Price,
  //   Category, Note, Status, Editing_Date, filePath);
  // try {
  //   // שלב 1 – שמור את הספר במסד הנתונים, עדיין עם שם קובץ זמני
  //   const result = await booksModel.add({
  //     Book_Name,
  //     author,
  //     number_Of_Page,
  //     Price,
  //     Category,
  //     Note,
  //     Status,
  //     Seller_Id,
  //     Editing_Date,
  //     // File_Path: filePath  // זמני
  //   });

  //   const newBookId = result.bookId;

  //   // שלב 2 – בנה שם קובץ חדש לפי ה־ID
  //   const newFileName = `${newBookId}.pdf`;
  //   const newFilePath = path.join(uploadFolder, newFileName);

  //   // שלב 3 – שנה את שם הקובץ בפועל
  //   fs.renameSync(filePath, newFilePath);

  //   // שלב 4 – עדכן את השם החדש במסד הנתונים
  //   //await booksModel.updateFilePath(newBookId, newFilePath);

  //   res.status(201).json({ message: "Book added successfully", bookId: newBookId });
  // } catch (err) {
  //   console.error("Error adding book:", err);
  //   res.status(500).json({ error: "Error adding the book" });
  // }

  //     // try {
  //     //   const result = await booksModel.add({
  //     //     Book_Name,
  //     //     author,
  //     //     number_Of_Page,
  //     //     Price,
  //     //     Category,
  //     //     Note,
  //     //     Status,
  //     //     Seller_Id,
  //     //     Editing_Date,
  //     //     File_Path: filePath  // הוספת הנתיב למסד נתונים
  //     //   });

  //     //   res.status(201).json({ message: "Book added successfully", bookId: result.bookId });
  //     // } catch (err) {
  //     //   console.error("Error adding book:", err);
  //     //   res.status(500).json({ error: "Error adding the book" });
  //     // }
  //   },


  update: async (req, res) => {
    const bookId = req.params.bookId;
    const Seller_Id = req.user.id;

    const {
      Book_Name, author, number_Of_Page, Price,
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

    const previous = await booksModel.getById(bookId);
    if (!previous) {
      return res.status(404).json({ error: "Book not found" });
    }

    try {
      const updated = await booksModel.update(bookId, {
        Book_Name: Book_Name || previous.Book_Name,
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
        return res.status(404).json({ error: "Book not found to update" });
      }

      res.json({ message: "Book updated successfully" });
    } catch (err) {
      console.error("Error updating book:", err);
      res.status(500).json({ error: "Failed to update book" });
    }
  },

  delete: async (req, res) => {
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

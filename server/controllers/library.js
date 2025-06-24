// import bcrypt from "bcrypt";
// import usersModel from "../modules/user.js";
// import libraryModel from "../modules/library.js";
// import booksModel from "../modules/books.js";
// import { generateToken } from "../middleware/outh.js";
// import { useId } from "react";

// const library = {
//     getAll: async (req, res) => {
//         try {

//             const booksInLibrary = await libraryModel.getAll() || [];
//             console.log(booksInLibrary);
//             res.json(booksInLibrary);
//         } catch (err) {
//             console.error(err);
//             res.status(500).json({ error: 'Failed to fetch books' });
//         }
//     },

//     getByUserIdAndBookId: async (req, res) => {
//         const { User_Id, Book_Id } = req.params;
//         console.log("getByUserIdAndBookId controller", User_Id, Book_Id)
//         try {
//             const book = await libraryModel.getByUserIdAndBookId(User_Id, Book_Id);
//             if (!book) return res.status(404).json({ message: 'Book not found' });
//             res.json(book);
//         } catch (err) {
//             console.error('Error getting book by userID and bookId:', err);
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

//     add: async (userId, orderId, orderedBookIds, Bookmark_On_Page, res) => {


//         // if (book == null) {
//         //     return res.status(400).json({ error: "Invalid bookId" });
//         // }
//         // if(user==null){
//         //     return res.status(400).json({ error: "Invalid userId" });
//         // }
//         // if (Bookmark_On_Page < 0 || Bookmark_On_Page > book.number_Of_Page) {
//         //     return res.status(400).json({ error: "Invalid bookmark page" });
//         // }
//         // if (Purchase_Date < Book_Id.Editing_Date || Purchase_Date > Date.now()) {
//         //     return res.status(400).json({ error: "Invalid purchace date" });
//         // }
//         try {
//             // const result = await libraryModel.Create({User_Id, Book_Id, Purchase_Date, Bookmark_On_Page});
//             if (!orderId || !Array.isArray(orderedBookIds) || orderedBookIds.length === 0) {
//                 return res.status(400).json({ error: "All required fields must be filled" });
//             }

//             try {
//                 console.log("BEFORE LIBRARYMODEL");
//                 for (const bookId of orderedBookIds) {
//                     await libraryModel.add({ userId: userId, orderId: orderId, bookId: bookId, Bookmark_On_Page: Bookmark_On_Page });
//                 }
//                 console.log("sucsses");
//                 return orderId;
//             } catch (err) {
//                 res.status(500).json({ error: "Error adding the order details" });
//             }

//             // console.log("Book In Library added successfully:", result);
//             // res.status(201).json({ message: "Book In Library added successfully", bookId: result.bookId });
//         } catch (err) {
//             console.error("Error adding the library book to the database:", err);
//             res.status(500).json({ error: "Error adding the library book" });
//         }
//     },
//     update: async (req, res) => {

//         const { User_Id, Book_Id } = req.params;
//         const {
//             Purchase_Date, Bookmark_On_Page
//         } = req.body;

//         const PreviousBookData = await libraryModel.getByUserIdAndBookId(User_Id, Book_Id);
//         console.log("update", User_Id, ",", Book_Id, ",", PreviousBookData);
//         if (!PreviousBookData) {
//             return res.status(404).json({ error: "Library Book not found" });
//         }


//         try {
//             const updated = await libraryModel.update(User_Id, Book_Id, {
//                 Purchase_Date: Purchase_Date || PreviousBookData.Purchase_Date,
//                 Bookmark_On_Page: Bookmark_On_Page || PreviousBookData.Bookmark_On_Page,
//             });

//             if (!updated) {
//                 return res.status(404).json({ error: "Library Book not found to update" });
//             }

//             res.json({ message: "Library Book updated successfully" });
//         } catch (err) {
//             console.error("Error updating Library book:", err);
//             res.status(500).json({ error: "Failed to update Library book" });
//         }
//     }
//     ,
//     delete: async (req, res) => {
//         const {  bookId } = req.params;
//         const userId = req.user.id; // Assuming user ID is stored in req.user.id

//         try {
//             const deleted = await libraryModel.delete(userId, bookId);
//             if (!deleted) {
//                 return res.status(404).json({ error: "Library Book not found to delete" });
//             }

//             res.json({ message: "Library Book deleted successfully" });
//         } catch (err) {
//             console.error("Error deleting Library book:", err);
//             res.status(500).json({ error: "Failed to delete Library book" });
//         }
//     }

// };

// export default library;
import bcrypt from "bcrypt";
import usersModel from "../modules/user.js";
import libraryModel from "../modules/library.js";
import booksModel from "../modules/books.js";
import path from "path";
import fs from "fs";

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

    // streamBook: async (req, res) => {
    //     const bookId = req.params.bookId;
    //     const userId = req.user.id; // נשלף מה-token לאחר אימות

    //     try {
    //         const result = libraryModel.getByUserIdAndBookId(userId, bookId);

    //         if (!result) {
    //             return res.status(403).json({ message: 'אין לך גישה לספר הזה' });
    //         }

    //         const filePath = path.join(process.cwd(), `server/books_storage/${bookId}.pdf`);

    //         if (!fs.existsSync(filePath)) {
    //             return res.status(404).json({ message: 'הספר לא נמצא' });
    //         }

    //         res.setHeader('Content-Type', 'application/pdf');
    //         res.setHeader('Content-Disposition', 'inline; filename="book.pdf"');

    //         const stream = fs.createReadStream(filePath);
    //         stream.pipe(res);
    //     } catch (err) {
    //         console.error('שגיאה בהזרמת ספר:', err);
    //         res.status(500).json({ message: 'שגיאת שרת' });
    //     }
    // },





//     getByUserIdAndBookId: async (req, res) => {
//   const { bookId } = req.params;
//   const userId = req.user.id;

//   console.log("getByUserIdAndBookId controller", userId, bookId);

//   try {
//     const book = await libraryModel.getByUserIdAndBookId(userId, bookId);
//     console.log("getByUserIdAndBookId controller book", book);

//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     // בנה את הנתיב לפי ה־bookId
//     const filePath = path.join(process.cwd(), `books_storage/${bookId}.pdf`);

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: 'הספר לא נמצא' });
//     }

//     // החזר את הקובץ ללקוח (תצוגה ישירה בדפדפן)
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'inline; filename="book.pdf"');

//     const stream = fs.createReadStream(filePath);
//     stream.pipe(res);

//     // ❌ אל תשתמשי ב־res.json אחרי pipe – זה שובר את התגובה
//     // res.json(book); ← למחוק!

//   } catch (err) {
//     console.error('Error getting book by userID and bookId:', err);
//     res.status(500).json({ error: 'Failed to fetch book' });
//   }
// },
getByUserId:async (req, res) => {
    const userId = req.user.id;

  console.log("📚 getByUserId controller", { userId });

  try {
    // שלב 1: שליפת כל הספרים של המשתמש
    const books = await libraryModel.getByUserId(userId);

    if (!books || books.length === 0) {
      return res.status(404).json({ message: 'לא נמצאו ספרים עבור המשתמש' });
    }

    // שלב 2: סינון ספרים עם קובץ PDF קיים בלבד
    const booksWithFile = books
      .map(book => {
        const filePath = path.join(process.cwd(), `books_storage/${book.Id}.pdf`);
        if (fs.existsSync(filePath)) {
          return {
            ...book,
            filePath: `/books/${book.Id}/read`, // נתיב שתואם לשרת שלך לצפייה
          };
        }
        return null;
      })
      .filter(book => book !== null);

    if (booksWithFile.length === 0) {
      return res.status(404).json({ message: 'לא נמצאו קבצי PDF לספרים של המשתמש' });
    }

    // שלב 3: החזרת הספרים עם נתיב צפייה לכל אחד
    return res.status(200).json(booksWithFile);

  } catch (err) {
    console.error('❌ שגיאה בשליפת ספרי המשתמש:', err);
    return res.status(500).json({ error: 'שגיאה בשרת, נסה שוב מאוחר יותר' });
  }
},
getByUserIdAndBookId: async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  console.log("🔍 getByUserIdAndBookId controller", { userId, bookId });

  try {
    // שלב 1: בדיקת הרשאה
    const book = await libraryModel.getByUserIdAndBookId(userId, bookId);
    if (!book) {
      return res.status(404).json({ message: 'הספר לא נמצא או אין הרשאה לצפות בו' });
    }

    // שלב 2: בנה נתיב לקובץ לפי ה־ID
    const filePath = path.join(process.cwd(), `books_storage/${bookId}.pdf`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'קובץ PDF לא נמצא' });
    }

    // שלב 3: הגדרות צפייה בלבד (לא הורדה)
    res.setHeader('Content-Type', 'application/pdf');

    // הצגה בתוך הדפדפן - לא הורדה
    res.setHeader('Content-Disposition', 'inline; filename="book.pdf"');

    // ❗ הגבל את האפשרות לבצע caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // שלב 4: שליחת הקובץ
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

  } catch (err) {
    console.error('❌ שגיאה בעת שליפת הספר:', err);
    res.status(500).json({ error: 'שגיאה בשרת, נסה שוב מאוחר יותר' });
  }
},
    add: async (userId, orderId, orderedBookIds, Bookmark_On_Page, res) => {
        if (!orderId || !Array.isArray(orderedBookIds) || orderedBookIds.length === 0) {
            return res.status(400).json({ error: "All required fields must be filled" });
        }

        try {
            for (const bookId of orderedBookIds) {
                await libraryModel.add({
                    userId: userId,
                    orderId: orderId,
                    bookId: bookId,
                    Bookmark_On_Page: Bookmark_On_Page
                });
            }
            return orderId;
        } catch (err) {
            console.error("Error adding the order details:", err);
            res.status(500).json({ error: "Error adding the order details" });
        }
    },

    update: async (req, res) => {
        const { User_Id, Book_Id } = req.params;
        const { Purchase_Date, Bookmark_On_Page } = req.body;

        const PreviousBookData = await libraryModel.getByUserIdAndBookId(User_Id, Book_Id);
        console.log("update", User_Id, ",", Book_Id, ",", PreviousBookData);
        if (!PreviousBookData) {
            return res.status(404).json({ error: "Library Book not found" });
        }

        try {
            const updated = await libraryModel.update(User_Id, Book_Id, {
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
    },

    delete: async (req, res) => {
        const { bookId } = req.params;
        const userId = req.user.id;

        try {
            const deleted = await libraryModel.delete(userId, bookId);
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

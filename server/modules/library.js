
import promisePool from "../db.js"; 
import bcrypt from 'bcrypt';
const libraryModel = {
Create: async (userData) => {
    const {
           User_Id, Book_Id, Purchase_Date, Bookmark_On_Page
        } = userData;
    try {
      
      // הכנסת המשתמש לטבלת books
      const [libraryBookResult] = await promisePool.query(
        "INSERT INTO Library_Of_User (User_Id, Book_Id, Purchase_Date, Bookmark_On_Page) VALUES (?,?,?,?)",
        [User_Id, Book_Id, Purchase_Date, Bookmark_On_Page]
      );
      const bookId = libraryBookResult.insertId;
      console.log("Book ID:", bookId);
      

      return { bookId };
    } catch (err) {
      console.error("addition Of a Library Book error:", err);
      throw err;
    }
  },

// getByName: async (Book_Name) => {
//     try {
//       console.log(Book_Name)
//       const [results] = await promisePool.query(`
//         SELECT * FROM Books WHERE Book_Name = ?`, [Book_Name]);
//       console.log("SQL RESULTS:", results);
//       if (results.length === 0) return null;
//      return results[0];
//     } catch (err) {
//       console.error("getBooksByName error:", err);
//       throw err;
//     }
//   },

getByUserIdAndBookId: async (User_Id,Book_Id) => {
    try {
      console.log("getByUserIdAndBookId Model",User_Id,Book_Id)
      
      const [results] = await promisePool.query(`
        SELECT * FROM Library_Of_User WHERE User_Id = ? AND Book_Id=?`, [User_Id,Book_Id]);
      console.log("SQL RESULTS:", results);
      if (results.length === 0) return null;
     return results[0];
    } catch (err) {
      console.error("getByUserIdAndBookId error:", err);
      throw err;
    }
  },

getAll: async () => {
    try {
      console.log("getAll of modules")
      const [results] = await promisePool.query(`
        SELECT * FROM Library_Of_User`);
      console.log("SQL RESULTS:", results);
      if (results.length === 0) return null;
     return results;
    } catch (err) {
      console.error("getAllLibraryBooks error:", err);
      throw err;
    }
  }
,
update: async (user_Id,book_Id, bookData) => {
  const {
     Purchase_Date, Bookmark_On_Page
  } = bookData;

  try {
    const [result] = await promisePool.query(`
      UPDATE Library_Of_User
      SET Purchase_Date=?, Bookmark_On_Page=?
      WHERE User_Id = ? AND Book_Id=?
    `, [
      Purchase_Date,Bookmark_On_Page,user_Id,book_Id
    ]);

    return result.affectedRows > 0; // מחזיר true אם עודכן, false אם לא
  } catch (err) {
    console.error("update Library Book error:", err);
    throw err;
  }
},
delete: async (user_Id,book_Id) => {
  try {
    const [result] = await promisePool.query(`
      DELETE FROM Library_Of_User WHERE User_Id = ? AND Book_Id=?
    `, [user_Id,book_Id]);

    return result.affectedRows > 0; // מחזיר true אם נמחק, false אם לא נמצא
  } catch (err) {
    console.error("delete Library Book error:", err);
    throw err;
  }
},


};
export default libraryModel;

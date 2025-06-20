import promisePool from "../db.js"; 
import bcrypt from 'bcrypt';
const booksModel = {
Create: async (userData) => {
    const {
            Book_Name, author, number_Of_Page, Price,
            Category, Note, Status, Seller_Id, Editing_Date
        } = userData;
    try {
      
      // הכנסת המשתמש לטבלת books
      const [bookResult] = await promisePool.query(
        "INSERT INTO Books (Book_Name, author, number_Of_Page, Price,Category, Note, Status, Seller_Id, Editing_Date) VALUES (?, ?, ?,?,?,?,?,?,?)",
        [Book_Name, author, number_Of_Page, Price,Category, Note, Status, Seller_Id, Editing_Date]
      );
      const bookId = bookResult.insertId;
      console.log("Book ID:", bookId);
      

      return { bookId };
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  },

getByName: async (Book_Name) => {
    try {
      console.log(Book_Name)
      const [results] = await promisePool.query(`
        SELECT * FROM Books WHERE Book_Name = ?`, [Book_Name]);
      console.log("SQL RESULTS:", results);
      if (results.length === 0) return null;
     return results[0];
    } catch (err) {
      console.error("getBooksByName error:", err);
      throw err;
    }
  },

getById: async (book_Id) => {
    try {
      console.log(book_Id)
      const [results] = await promisePool.query(`
        SELECT * FROM Books WHERE Id = ?`, [book_Id]);
      console.log("SQL RESULTS:", results);
      if (results.length === 0) return null;
     return results[0];
    } catch (err) {
      console.error("getBooksById error:", err);
      throw err;
    }
  },

getAll: async () => {
    try {
      console.log("getAll of modules")
      const [results] = await promisePool.query(`
        SELECT * FROM Books`);
      console.log("SQL RESULTS:", results);
      if (results.length === 0) return null;
     return results;
    } catch (err) {
      console.error("getAllBooks error:", err);
      throw err;
    }
  }
,
update: async (book_Id, bookData) => {
  const {
    Book_Name, author, number_Of_Page, Price,
    Category, Note, Status, Seller_Id, Editing_Date
  } = bookData;

  try {
    const [result] = await promisePool.query(`
      UPDATE Books
      SET Book_Name = ?, author = ?, number_Of_Page = ?, Price = ?,
          Category = ?, Note = ?, Status = ?, Seller_Id = ?, Editing_Date = ?
      WHERE Id = ?
    `, [
      Book_Name, author, number_Of_Page, Price,
      Category, Note, Status, Seller_Id, Editing_Date,
      book_Id
    ]);

    return result.affectedRows > 0; // מחזיר true אם עודכן, false אם לא
  } catch (err) {
    console.error("updateBook error:", err);
    throw err;
  }
},
delete: async (book_Id) => {
  try {
    const [result] = await promisePool.query(`
      DELETE FROM Books WHERE Id = ?
    `, [book_Id]);

    return result.affectedRows > 0; // מחזיר true אם נמחק, false אם לא נמצא
  } catch (err) {
    console.error("deleteBook error:", err);
    throw err;
  }
},


};
export default booksModel;

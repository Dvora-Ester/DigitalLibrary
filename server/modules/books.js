import promisePool from "../db.js";
import bcrypt from 'bcrypt';
const booksModel = {
  add: async (userData) => {
    const {
      Book_Name, author, number_Of_Page, Price,
      Category, Note, Status, Seller_Id, Editing_Date, Wholesale_Price
    } = userData;
    try {

      // הכנסת המשתמש לטבלת books
      const [bookResult] = await promisePool.query(
        "INSERT INTO Books (Book_Name, author, number_Of_Page, Price,Category, Note, Status, Seller_Id, Editing_Date,Wholesale_Price) VALUES (?, ?, ?,?,?,?,?,?,?,?)",
        [Book_Name, author, number_Of_Page, Price, Category, Note, Status, Seller_Id, Editing_Date, Wholesale_Price]
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
  getByStatus: async (limit, offset, Status) => {

    try {
      console.log("getAllPaginated of modules", Status);
      const [results] = await promisePool.query(`
      SELECT * FROM Books
      WHERE Status = ?
      ORDER BY Id DESC
      LIMIT ? OFFSET ?
      `, [Status, limit, offset]);


      console.log("SQL RESULTS:", results);
      // תמיד תחזיר מערך (גם אם ריק)
      return results;
    } catch (err) {
      console.error("getAllPaginated error:", err);
      throw err;
    }

  },
  getByStatusAndUserId: async (Status, Seller_Id) => {
    try {
      const [results] = await promisePool.query(`
      SELECT * FROM Books
      WHERE Status = ? AND Seller_Id = ?
      ORDER BY Id DESC
    `, [Status, Seller_Id]);

      return results;
    } catch (err) {
      console.error("getByStatusAndUserId error:", err);
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
  getAllPaginated: async (limit, offset) => {
    try {
      console.log("getAllPaginated of modules");
      const [results] = await promisePool.query(`
      SELECT * FROM Books
      ORDER BY Id DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

      console.log("SQL RESULTS:", results);
      // תמיד תחזיר מערך (גם אם ריק)
      return results;
    } catch (err) {
      console.error("getAllPaginated error:", err);
      throw err;
    }
  },
  getTotalCount: async () => {
    const [results] = await promisePool.query(`
    SELECT COUNT(*) AS count FROM Books
  `);
    return results[0].count;
  },
  getTotalCountByStatus: async (Status) => {
    const [results] = await promisePool.query(`
    SELECT COUNT(*) AS count FROM Books WHERE Status = ?
  `, [Status]);
    if (results.length === 0) return 0; // אם אין תוצאות, מחזיר 0
    console.log("Total count by status:", results[0].count);
    return results[0].count;
  },
  // getAll: async () => {
  //     try {
  //       console.log("getAll of modules")
  //       const [results] = await promisePool.query(`
  //         SELECT * FROM Books`);
  //       console.log("SQL RESULTS:", results);
  //       if (results.length === 0) return null;
  //      return results;
  //     } catch (err) {
  //       console.error("getAllBooks error:", err);
  //       throw err;
  //     }
  //   }
  // ,
  getFilterBy: async (limit, offset, value, filterBy) => {
    try {
      console.log("getAllByFilterPaginated of modules");

      let query = `
  SELECT * FROM books
  WHERE ?? LIKE ?
  ORDER BY Id DESC
  LIMIT ? OFFSET ?
`;

const [results] = await promisePool.query(query, [
  filterBy,        // שם העמודה (Author, Book_Name וכו')
  `%${value}%`,    // מוסיפים את ה-% סביב הערך כאן
  limit,
  offset
]);

      console.log("SQL RESULTS:", results);
      // תמיד תחזיר מערך (גם אם ריק)
      return results;
    } catch (err) {
      console.error("getAllByFilterPaginated error:", err);
      throw err;
    }
  },
  update: async (book_Id, bookData) => {
    const {
      Book_Name, author, number_Of_Page, Price,
      Category, Note, Status, Seller_Id, Editing_Date, Wholesale_Price
    } = bookData;

    try {
      const [result] = await promisePool.query(`
      UPDATE Books
      SET Book_Name = ?, author = ?, number_Of_Page = ?, Price = ?,
          Category = ?, Note = ?, Status = ?, Seller_Id = ?, Editing_Date = ?,Wholesale_Price=?
      WHERE Id = ?
    `, [
        Book_Name, author, number_Of_Page, Price,
        Category, Note, Status, Seller_Id, Editing_Date,
        book_Id, Wholesale_Price
      ]);

      return result.affectedRows > 0;
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
  }
};
export default booksModel;

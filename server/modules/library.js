import promisePool from "../db.js";

const libraryModel = {
  add: async (libraryData) => {
    const { userId, orderId, bookId, Bookmark_On_Page } = libraryData;
    try {
      const [libraryBookResult] = await promisePool.query(
        `INSERT INTO Library_Of_User (User_Id, Order_Id, Book_Id, Bookmark_On_Page) VALUES (?, ?, ?, ?)`,
        [userId, orderId, bookId, Bookmark_On_Page]
      );
      console.log("Book Added:", { userId, bookId, orderId });
      return { orderId, bookId };
    } catch (err) {
      console.error("Error in add():", err);
      throw new Error("Failed to add book to user library.");
    }
  },

  getByUserId: async (User_Id) => {
    try {
      console.log("Fetching books for user:", User_Id);
      const [results] = await promisePool.query(`
     SELECT DISTINCT b.*
      FROM Library_Of_User l
      INNER JOIN Books b ON l.Book_Id = b.Id
      WHERE l.User_Id = ?
      AND b.Status = 'available'

    `, [User_Id]);
      return results;
    } catch (err) {
      console.error("Error in getByUserId():", err);
      throw new Error("Failed to fetch books by user ID.");
    }
  },

  getByUserIdAndBookId: async (User_Id, Book_Id) => {
    try {
      console.log("Fetching book by user and book ID:", User_Id, Book_Id);
      const [results] = await promisePool.query(`
        SELECT * FROM Library_Of_User WHERE User_Id = ? AND Book_Id = ?
      `, [User_Id, Book_Id]);

      return results.length > 0 ? results[0] : null;
    } catch (err) {
      console.error("Error in getByUserIdAndBookId():", err);
      throw new Error("Failed to fetch specific book for user.");
    }
  },

  getAll: async () => {
    try {
      console.log("Fetching all records from Library_Of_User");
      const [results] = await promisePool.query(`SELECT * FROM Library_Of_User`);
      return results;
    } catch (err) {
      console.error("Error in getAll():", err);
      throw new Error("Failed to fetch all library entries.");
    }
  },

  update: async (user_Id, book_Id, bookData) => {
    const { Purchase_Date, Bookmark_On_Page } = bookData;
    try {
      const [result] = await promisePool.query(`
        UPDATE Library_Of_User
        SET Purchase_Date = ?, Bookmark_On_Page = ?
        WHERE User_Id = ? AND Book_Id = ?
      `, [Purchase_Date, Bookmark_On_Page, user_Id, book_Id]);

      return result.affectedRows > 0;
    } catch (err) {
      console.error("Error in update():", err);
      throw new Error("Failed to update book in user library.");
    }
  },

  delete: async (userId, bookId) => {
    try {
      const [result] = await promisePool.query(`
        DELETE FROM Library_Of_User WHERE User_Id = ? AND Book_Id = ?
      `, [userId, bookId]);

      return result.affectedRows > 0;
    } catch (err) {
      console.error("Error in delete():", err);
      throw new Error("Failed to delete book from user library.");
    }
  },

  deleteByOrderId: async (orderId) => {
    try {
      const [result] = await promisePool.query(`
        DELETE FROM Library_Of_User WHERE Order_Id = ?
      `, [orderId]);

      return result.affectedRows > 0;
    } catch (err) {
      console.error("Error in deleteByOrderId():", err);
      throw new Error("Failed to delete books by order ID.");
    }
  }
};

export default libraryModel;

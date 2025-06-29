import promisePool from "../db.js";

const commentsModel = {
  add: async (commentData) => {
    const { bookId, userId, title, content, Created_At } = commentData;
    try {
      console.log("Adding comment:", commentData);

      const [commentResult] = await promisePool.query(
        `INSERT INTO comments (Book_Id, User_Id, title, content, Created_At) VALUES (?, ?, ?, ?, ?)`,
        [bookId, userId, title, content, Created_At]
      );

      const commentId = commentResult.insertId;
      console.log("Comment ID:", commentId);
      return { commentId };

    } catch (err) {
      console.error("Error in add():", err);
      throw new Error("Failed to add comment.");
    }
  },

  getById: async (comment_Id) => {
    try {
      console.log("Fetching comment by ID:", comment_Id);

      const [results] = await promisePool.query(
        `SELECT * FROM comments WHERE Id = ?`,
        [comment_Id]
      );

      return results.length > 0 ? results[0] : null;
    } catch (err) {
      console.error("Error in getById():", err);
      throw new Error("Failed to fetch comment by ID.");
    }
  },

  getAllByBookId: async (book_Id) => {
    try {
      console.log("Fetching all comments for book ID:", book_Id);

      const [results] = await promisePool.query(
        `SELECT * FROM comments WHERE Book_Id = ?`,
        [book_Id]
      );

      return results;
    } catch (err) {
      console.error("Error in getAllByBookId():", err);
      throw new Error("Failed to fetch comments for book.");
    }
  },

  getAll: async () => {
    try {
      console.log("Fetching all comments");

      const [results] = await promisePool.query(
        `SELECT * FROM comments`
      );

      return results;
    } catch (err) {
      console.error("Error in getAll():", err);
      throw new Error("Failed to fetch all comments.");
    }
  },

  update: async (comment_Id, commentData) => {
    const { title, content, Created_At } = commentData;
    try {
      const [result] = await promisePool.query(
        `UPDATE comments
         SET title = ?, content = ?, Created_At = ?
         WHERE Id = ?`,
        [title, content, Created_At, comment_Id]
      );

      return result.affectedRows > 0;
    } catch (err) {
      console.error("Error in update():", err);
      throw new Error("Failed to update comment.");
    }
  },

  delete: async (comment_Id) => {
    try {
      const [result] = await promisePool.query(
        `DELETE FROM comments WHERE Id = ?`,
        [comment_Id]
      );

      return result.affectedRows > 0;
    } catch (err) {
      console.error("Error in delete():", err);
      throw new Error("Failed to delete comment.");
    }
  }
};

export default commentsModel;

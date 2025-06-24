import promisePool from "../db.js"; 
const commentsModel = {
add: async (commentData) => {
  console.log("hello");
  console.log("Adding comment:", commentData);
    const {
            bookId, userId, title, content, Created_At
        } = commentData;
    try {
      
      // הכנסת המשתמש לטבלת comments
      const [commentResult] = await promisePool.query(
        "INSERT INTO comments (Book_Id, User_Id, title, content,Created_At) VALUES (?,?, ?,?,?)",
        [ bookId, userId, title, content, Created_At]
      );
      const commentId = commentResult.insertId;
      console.log("comment ID:", commentId);
    

      return { commentId };
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  },
getById: async (comment_Id) => {
    try {
      console.log(comment_Id)
      const [results] = await promisePool.query(`
        SELECT * FROM comments WHERE Id = ?`, [comment_Id]);
      console.log("SQL RESULTS:", results);
      if (results.length === 0) return null;
     return results[0];
    } catch (err) {
      console.error("getcommentsById error:", err);
      throw err;
    }
  },

getAllByBookId: async (book_Id) => {
    try {
      console.log("getAll of modules")
      const [results] = await promisePool.query(`
        SELECT * FROM comments WHERE Book_Id=?`,[book_Id]);
      console.log("SQL RESULTS:", results);
      if (results.length === 0) return null;
     return results;
    } catch (err) {
      console.error("getAllcomments error:", err);
      throw err;
    }
  }
,
getAll: async () => {
    try {
      console.log("getAll of modules")
      const [results] = await promisePool.query(`
        SELECT * FROM comments `);
      console.log("SQL RESULTS:", results);
      if (results.length === 0) return null;
     return results;
    } catch (err) {
      console.error("getAllcomments error:", err);
      throw err;
    }
  }
,
update: async (comment_Id, commentData) => {
     const {
             Book_Id, User_Id, title, content, Created_At
        } = commentData;
  try {
    const [result] = await promisePool.query(`
      UPDATE comments
      SET title = ?, content = ?, Created_At = ?,
      WHERE Id = ?
    `, [
     title, content, Created_At, comment_Id
    ]);

    return result.affectedRows > 0; // מחזיר true אם עודכן, false אם לא
  } catch (err) {
    console.error("updatecomment error:", err);
    throw err;
  }
},
delete: async (comment_Id) => {
  try {
    const [result] = await promisePool.query(`
      DELETE FROM comments WHERE Id = ?
    `, [comment_Id]);

    return result.affectedRows > 0; // מחזיר true אם נמחק, false אם לא נמצא
  } catch (err) {
    console.error("deletecomment error:", err);
    throw err;
  }
},
};
export default commentsModel;

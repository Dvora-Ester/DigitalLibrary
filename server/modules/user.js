
import promisePool from "../db.js";
import bcrypt from 'bcrypt';
const user = {
  getById: async (user_Id) => {
    try {

      const [results] = await promisePool.query(`
        SELECT * FROM Users WHERE Id = ?`, [user_Id]);
      console.log("SQL RESULTS:", results, results.length, results[0]);

      if (results.length === 0) return null;
      return results[0];
    } catch (err) {
      console.error("getUsersById error:", err);
      throw err;
    }
  },

  //   register: async (userData) => {
  //     const { name, email, phone, password,isManager } = userData;
  //     try {
  //       // הצפנת הסיסמה
  //       const hashedPassword = await bcrypt.hash(password, 10);

  //       // הכנסת המשתמש לטבלת users
  //       const [userResult] = await promisePool.query(
  //         "INSERT INTO users (Full_Name, email, Phone,Is_Manager) VALUES (?, ?, ?,?)",
  //         [name, email, phone,isManager]
  //       );
  //       const userId = userResult.insertId;
  //       console.log("User ID:", userId);
  //       // בדיקת קיום המשתמש
  //       // הכנסת הסיסמה המוצפנת לטבלת passwords
  //       const addedUser=await promisePool.query(
  //         "INSERT INTO passwords (User_Id, password_hash) VALUES (?, ?)",
  //         [userId, hashedPassword]
  //       );
  // console.log(addedUser);
  //       return { userId };
  //     } catch (err) {
  //       console.error("Registration error:", err);
  //       throw err;
  //     }
  //   },
  register: async (userData) => {
    const { name, email, phone, password, isManager } = userData;
    const conn = await promisePool.getConnection();
    try {
      await conn.beginTransaction();

      const hashedPassword = await bcrypt.hash(password, 10);

      const [userResult] = await conn.query(
        "INSERT INTO users (Full_Name, email, Phone, Is_Manager) VALUES (?, ?, ?, ?)",
        [name, email, phone, isManager]
      );
      const userId = userResult.insertId;

      await conn.query(
        "INSERT INTO passwords (User_Id, password_hash) VALUES (?, ?)",
        [userId, hashedPassword]
      );

      await conn.commit();
      conn.release();
      const [results] = await promisePool.query(`
        SELECT * FROM Users WHERE Id = ?`, [userId]);
      console.log("SQL RESULTS:", userId);

      return {userId};
    } catch (err) {
      await conn.rollback();
      conn.release();
      console.error("Registration error:", err);
      throw err;
    }
  },


  getUserByUsername: async (username) => {
    try {
      console.log(username)
      const [results] = await promisePool.query(`
        SELECT users.*, passwords.password_hash AS password
        FROM users
        JOIN passwords ON users.id = passwords.user_id
        WHERE users.Email = ?
      `, [username]);
      console.log("SQL RESULTS:", results);
      if (results.length === 0) return null;
      return results[0];
    } catch (err) {
      console.error("getUserByUsername error:", err);
      throw err;
    }
  },
  update: async (User_Id, Data) => {
    const {
      Full_Name, Email, phone, Is_Manager
    } = Data;
    console.log(Data, "User_Id", User_Id)
    try {
      const result = await promisePool.query(`
      UPDATE users
      SET Full_Name = ?, Email = ?, Phone = ?, Is_Manager = ?
      WHERE Id = ?
    `, [
        Full_Name, Email, phone, Is_Manager, User_Id

      ]);
      console.log("result", result)
      return result[0].affectedRows > 0; // מחזיר true אם עודכן, false אם לא

    } catch (err) {
      console.error("updateBook error:", err);
      throw err;
    }
  },
  // update: async (User_Id, data) => {
  //   const fields = [];
  //   const values = [];

  //   // עדכון לפי השדות הקיימים בטבלה שלך

  //   if (data.Full_Name != null) {
  //     fields.push("Full_Name = ?");
  //     values.push(data.Full_Name);
  //   }
  //   if (data.Email != null) {
  //     fields.push("Email = ?");
  //     values.push(data.Email);
  //   }
  //   if (data.Is_Manager != null) {
  //     fields.push("Is_Manager = ?");
  //     values.push(data.Is_Manager);
  //   }

  //   // אם אין שדות לעדכן, החזר 0
  //   if (fields.length === 0) return { affectedRows: 0 };

  //   const query = `UPDATE users SET ${fields.join(", ")} WHERE Id = ?`;
  //   values.push(User_Id);

  //   const [result] = await promisePool.query(query, values);
  //   return result;
  // },
  // delete: async (userId) => {
  //   try {
  //     // מחיקת המשתמש מטבלת passwords
  //     await promisePool.query("DELETE FROM passwords WHERE User_Id = ?", [userId]);
  //     // מחיקת המשתמש מטבלת users
  //     const [result] = await promisePool.query("DELETE FROM users WHERE Id = ?", [userId]);
  //     console.log("User deleted:", result);
  //     return result.affectedRows > 0;
  //   } catch (err) {
  //     console.error("Delete user error:", err);
  //     throw err;
  //   }
  // }
  delete: async (userId) => {
    const conn = await promisePool.getConnection();
    try {
      await conn.beginTransaction();

      // מחיקת הסיסמה קודם (תלות)
      await conn.query("DELETE FROM passwords WHERE User_Id = ?", [userId]);

      // מחיקת המשתמש
      const [result] = await conn.query("DELETE FROM users WHERE Id = ?", [userId]);

      await conn.commit();
      return result.affectedRows > 0;
    } catch (err) {
      await conn.rollback();
      console.error("❌ Delete user error:", err);
      throw err;
    } finally {
      conn.release();
    }
  }

};

export default user;

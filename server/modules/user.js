
import promisePool from "../db.js";
import bcrypt from 'bcrypt';

const user = {
  getById: async (user_Id) => {
    try {
      const [results] = await promisePool.query(
        `SELECT * FROM Users WHERE Id = ?`, 
        [user_Id]
      );
      console.log("SQL RESULTS:", results);
      if (results.length === 0) return null;
      return results[0];
    } catch (err) {
      console.error("getUsersById error:", err);
      throw err;
    }
  },

  register: async (userData) => {
    const { name, email, phone, password, isManager } = userData;
    let conn;
    try {
      conn = await promisePool.getConnection();
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

      const [results] = await promisePool.query(
        `SELECT * FROM Users WHERE Id = ?`, 
        [userId]
      );
      console.log("SQL RESULTS:", results);
      return { userId };
    } catch (err) {
      if (conn) await conn.rollback();
      console.error("Registration error:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },

  getUserByUsername: async (username) => {
    try {
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
    const { Full_Name, Email, phone, Is_Manager } = Data;
    try {
      const [result] = await promisePool.query(`
        UPDATE users
        SET Full_Name = ?, Email = ?, Phone = ?, Is_Manager = ?
        WHERE Id = ?
      `, [Full_Name, Email, phone, Is_Manager, User_Id]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error("updateUser error:", err);
      throw err;
    }
  },

  delete: async (userId) => {
    let conn;
    try {
      conn = await promisePool.getConnection();
      await conn.beginTransaction();

      await conn.query("DELETE FROM passwords WHERE User_Id = ?", [userId]);
      const [result] = await conn.query("DELETE FROM users WHERE Id = ?", [userId]);

      await conn.commit();
      return result.affectedRows > 0;
    } catch (err) {
      if (conn) await conn.rollback();
      console.error("❌ Delete user error:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
};

export default user;

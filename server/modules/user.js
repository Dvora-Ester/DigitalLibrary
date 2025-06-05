import promisePool from "../db.js"; 
import bcrypt from 'bcrypt';
const user = {
  getById: async (user_Id) => {
    try {
      
      const [results] = await promisePool.query(`
        SELECT * FROM Users WHERE Id = ?`, [user_Id]);
      console.log("SQL RESULTS:", results);
      if (results.length === 0) return null;
     return results[0];
    } catch (err) {
      console.error("getUsersById error:", err);
      throw err;
    }
  },

  register: async (userData) => {
    const { name, email, phone, password } = userData;
    try {
      // הצפנת הסיסמה
      const hashedPassword = await bcrypt.hash(password, 10);

      // הכנסת המשתמש לטבלת users
      const [userResult] = await promisePool.query(
        "INSERT INTO users (Full_Name, email, Phone) VALUES (?, ?, ?)",
        [name, email, phone]
      );
      const userId = userResult.insertId;
      console.log("User ID:", userId);
      // בדיקת קיום המשתמש
      // הכנסת הסיסמה המוצפנת לטבלת passwords
      const addedUser=await promisePool.query(
        "INSERT INTO passwords (User_Id, password_hash) VALUES (?, ?)",
        [userId, hashedPassword]
      );
console.log(addedUser);
      return { addedUser };
    } catch (err) {
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
  }
};

export default user;

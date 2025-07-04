import promisePool from "../db.js";

const ordersModel = {
  getAllByUserId: async (id, sortBy = "id") => {
    try {
      console.log("getAllByUserId called with id:", id, "and sortBy:", sortBy);
      const allowedSortFields = ["id"];
      const sortField = allowedSortFields.includes(sortBy) ? sortBy : "id";

      const [results] = await promisePool.query(`
        SELECT * FROM orders 
        WHERE User_Id = ? 
        ORDER BY ${sortField}
      `, [id]);

      return results.length > 0 ? results : null;
    } catch (err) {
      console.error("❌ Error in getAllByUserId:", err);
      throw err;
    }
  },

  add: async (orderData) => {
    try {
      const { userId, date, total, stripeSessionId } = orderData;

      if (!userId || !date || !total || !stripeSessionId) {
        console.error("❌ Missing required fields in orderData:", orderData);
        return null;
      }

      console.log("Adding order with data:", orderData);

      const [orderResult] = await promisePool.query(
        `INSERT INTO orders (User_Id, date, total, stripeSessionId) 
         VALUES (?, ?, ?, ?)`,
        [userId, date, total, stripeSessionId]
      );

      return { orderId: orderResult.insertId };
    } catch (err) {
      console.error("❌ Error in add:", err);
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const [result] = await promisePool.query(
        "DELETE FROM orders WHERE id = ?",
        [id]
      );
      return { affectedRows: result.affectedRows };
    } catch (err) {
      console.error("❌ Error in delete:", err);
      throw err;
    }
  },

  update: async (orderId, data) => {
    try {
      const fields = [];
      const values = [];

      if (data.User_Id != null) {
        fields.push("User_Id = ?");
        values.push(data.User_Id);
      }
      if (data.cc_Last_Four_Diggits != null) {
        fields.push("cc_Last_Four_Diggits = ?");
        values.push(data.cc_Last_Four_Diggits);
      }
      if (data.date != null) {
        fields.push("date = ?");
        values.push(data.date);
      }

      if (fields.length === 0) return { affectedRows: 0 };

      const query = `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`;
      values.push(orderId);

      const [result] = await promisePool.query(query, values);
      return result;
    } catch (err) {
      console.error("❌ Error in update:", err);
      throw err;
    }
  },

  searchorders: async (userId, filterBy, value) => {
    try {
      let sql = "";
      let params = [];

      if (filterBy === "id") {
        sql = "SELECT * FROM orders WHERE User_Id = ? AND Id = ?";
        params = [userId, value];
      } else if (filterBy === "date") {
        sql = "SELECT * FROM orders WHERE User_Id = ? AND DATE(date) = ?";
        params = [userId, value]; // value בפורמט YYYY-MM-DD
      } else {
        return [];
      }

      const [results] = await promisePool.query(sql, params);
      return results;
    } catch (err) {
      console.error("❌ Error in searchorders:", err);
      throw err;
    }
  },

  getById: async (orderId) => {
    try {
      console.log("getById called with id:", orderId);

      if (!orderId) {
        console.error("getById called with invalid id:", orderId);
        return null;
      }

      const [results] = await promisePool.query(`
        SELECT 
          o.Id AS Order_Id,
          o.User_Id,
          o.date AS Order_Date,
          o.total AS Total_Amount,
          b.Id AS Book_Id,
          b.Book_Name,
          b.Price
        FROM Orders o
        JOIN Library_Of_User l ON o.Id = l.Order_Id
        JOIN Books b ON l.Book_Id = b.Id
        WHERE o.Id = ?
      `, [orderId]);

      console.log("getById results:", results);
      return results.length > 0 ? results : null;
    } catch (err) {
      console.error("❌ Error in getById:", err);
      throw err;
    }
  }
};

export default ordersModel;

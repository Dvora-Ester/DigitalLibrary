import promisePool from "../db.js";

const orderDetailsModel = {
    getOrderDetailsByOrdersrIdAndBookId: async (orderId,bookId) => {
     const [orderDetailsResult] = await promisePool.query(
            "SELECT * FROM Order_Details WHERE order_id = ? AND book_id = ?",
            [orderId, bookId]
        );

        if (orderDetailsResult.length === 0) return null;
        return orderDetailsResult[0];
    },

    add: async (orderData) => {
        const { orderId,bookId } = orderData;

        const [orderDetailsResult] = await promisePool.query(
            "INSERT INTO Order_Details (order_id,book_id) VALUES (?, ?)",
            [orderId,bookId]
        );
        if (orderDetailsResult.length === 0) return null;
        return { orderId: orderId };
    },

    delete: async (id) => {
        const orderResult = await promisePool.query(
            "DELETE FROM orders WHERE id = ?",
            [id]
        );
        if (orderResult.length === 0) return null;
        return { affectedRows: orderResult.affectedRows };
    },
    update: async (orderId, data) => {
        const fields = [];
        const values = [];

        // עדכון לפי השדות הקיימים בטבלה שלך
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

        // אם אין שדות לעדכן, החזר 0
        if (fields.length === 0) return { affectedRows: 0 };

        const query = `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`;
        values.push(orderId);

        const [result] = await promisePool.query(query, values);
        return result;
    },
    searchorders: async (userId, filterBy, value) => {
        let sql = "";
        let params = [];

        if (filterBy === "id") {
            sql = "SELECT * FROM orders WHERE User_Id = ? AND Id = ?";
            params = [userId, value];
        } else if (filterBy === "date") {
            sql = "SELECT * FROM orders WHERE user_id = ? AND DATE(date) = ?";
            params = [userId, value]; // value צריך להיות בפורמט YYYY-MM-DD
            // } else if (filterBy === "completed") {
            //     sql = "SELECT * FROM orders WHERE user_id = ? AND completed = ?";
            //     params = [userId, value === "true" ? 1 : 0];
        } else {
            return [];
        }

        const [results] = await promisePool.query(sql, params);
        return results;

    }
};

export default orderDetailsModel;
import promisePool from "../db.js";

const ordersModel = {
    getAllByUserId: async (id, sortBy = "id") => {
        console.log("getAllByUserId called with id:", id, "and sortBy:", sortBy);
        const allowedSortFields = ["id"];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : "id";
        const [results] = await promisePool.query(`
     SELECT * FROM orders WHERE user_id = ? ORDER BY ${sortField}
      `, [id]);

        if (results.length === 0) return null;
        return results;
    },

     add: async (orderData) => {
        console.log("hello");
        // const { userId, ccNumber, date,total } = orderData;
        const { userId, date,total,stripeSessionId } = orderData;
    if (!userId || !date || !total || !stripeSessionId) {
            console.error("Missing required fields in orderData:", orderData);}
        //טוקן של תשלום אמיתי
        console.log("Adding order with data:", orderData);
        const [orderResult] = await promisePool.query(
            "INSERT INTO orders (User_Id, date,total,stripeSessionId) VALUES (?, ?, ?,?)",
            [userId, date,total,stripeSessionId]
        );
        // const lastFour = ccNumber.slice(-4);
        // const [orderResult] = await promisePool.query(
        //     "INSERT INTO orders (User_Id, cc_Last_Four_Diggits, date,total) VALUES (?, ?, ?,?)",
        //     [userId, lastFour, date,total]
        // );
        if (orderResult.length === 0) return null;
        return { orderId: orderResult.insertId };
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

    },
    getById: async (orderId) => {
        console.log("getById called with id:", orderId);

        if (!orderId) {
            console.error("getById called with invalid id:", orderId);
            return null;
        }

        try {
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
            return results;
            if (results.length === 0) {
                console.warn("No order found with id:", orderId);
                return null;
            }

        } catch (err) {
            console.error("❌ Error in getById:", err);
            return null;
        }
    }

};

export default ordersModel;
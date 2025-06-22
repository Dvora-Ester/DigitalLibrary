import booksModel from "../modules/books.js";
import orderDetailsModel from "../modules/orderDetail.js";

const orderDetailsController = {
    getOrderDetailsByOrdersrIdAndBookId: async (req, res) => {
        const { orderId, bookId } = req.params;
        try {
            const orders = await orderDetailsModel.getOrderDetailsByOrdersrIdAndBookId(orderId, bookId);
            res.json(orders);
        } catch (err) {
            res.status(500).json({ error: "Database error" });
        }
    },
  getAllOrderDetailsByOrdersId: async (req, res) => {
        const { orderId} = req.params;
        try {
            const orderDetails = await orderDetailsModel.getAllOrderDetailsByOrdersId(orderId);
            res.json(orderDetails);
        } catch (err) {
            res.status(500).json({ error: "Database error" });
        }
    },
    add: async (orderId, orderedBookIds, res) => {
        if (!orderId || !Array.isArray(orderedBookIds) || orderedBookIds.length === 0) {
            return res.status(400).json({ error: "All required fields must be filled" });
        }
        // for (const bookId of orderedBookIds) {
        //     const book = await booksModel.getById(bookId);
        //     if (!book) {
        //         return res.status(400).json({ error: `Book with ID ${bookId} does not exist` });
        //     }
        // }

        try {
            for (const bookId of orderedBookIds) {
                await orderDetailsModel.add({ orderId: orderId, bookId: bookId });
            }
            console.log("sucsses");
            return orderId;
        } catch (err) {
            res.status(500).json({ error: "Error adding the order details" });
        }
    },
  
    delete: async (req, res) => {
        const { orderId } = req.params;

        try {
            const result = await orderDetailsModel.delete(orderId);
            if (!result) return res.status(404).json({ error: "No orders found for this user" });
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: "Database error" });
        }
    },

    update: async (req, res) => {
        // const { orderId } = req.params;
        // const { ccNumber, validity, cvv, date } = req.body;

        // if (ccNumber == null && validity == null && cvv == null && date == null) {
        //     return res.status(400).json({ error: "At least one field must be provided for update" });
        // }

        // try {
        //     const result = await ordersDetailModel.update(orderId, { ccNumber, validity, cvv, date });
        //     if (result.affectedRows === 0) return res.status(404).json({ error: "order not found" });

        //     res.json({ message: "order updated successfully" });
        // } catch (err) {
        //     res.status(500).json({ error: "Database error" });
        // }
    },

    search: async (req, res) => {
        // const userId = req.userId;
        // const { filterBy, value } = req.query;

        // if (!filterBy || value === undefined) {
        //     return res.status(400).json({ error: "Missing search parameters" });
        // }

        // try {
        //     const orders = await ordersDetailModel.searchorders(userId, filterBy, value);
        //     if (!orders || orders.length === 0) {
        //         return res.status(404).json({ message: "No orders found" });
        //     }
        //     res.status(200).json(orders);
        // } catch (err) {
        //     console.error("Error searching orders:", err);
        //     res.status(500).json({ error: "Failed to search orders" });
        // }
    }
};

export default orderDetailsController;
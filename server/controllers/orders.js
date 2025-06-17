import ordersModel from "../modules/orders.js";

const ordersController = {
  getAllByUserId: async (req, res) => {
    // const { userId } = req.params;
  
        const userId = req.userId;
    const { sortBy } = req.query;
    console.log("Fetching orders for user ID:", userId);

    try {
      const orders = await ordersModel.getAllByUserId(userId, sortBy);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  add: async (req, res) => {
    console.log("Adding order with body:", req.body);
    console.log("User ID from params:", req.params.userId);
    const { ccNumber, validity, cvv, date } = req.body;
      const userId = req.userId;

    if (!ccNumber || !validity || !cvv || !date) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const orderToSave = {
      userId, ccNumber, validity, cvv, date
    };

    try {
      const result = await ordersModel.add(orderToSave);
      res.status(201).json({ message: "order added successfully", id: result.insertId });
    } catch (err) {
      console.error("Error adding the order to the database:", err);
      res.status(500).json({ error: "Error adding the order" });
    }
  },

  delete: async (req, res) => {
    const { orderId } = req.params;

    try {
      const result = await ordersModel.delete(orderId);
      if (!result) return res.status(404).json({ error: "No orders found for this user" });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  update: async (req, res) => {
    const { orderId } = req.params;
    const { ccNumber, validity, cvv, date } = req.body;

    if (ccNumber == null && validity == null && cvv == null && date == null) {
      return res.status(400).json({ error: "At least one field must be provided for update" });
    }

    try {
      const result = await ordersModel.update(orderId, { ccNumber, validity, cvv, date });
      if (result.affectedRows === 0) return res.status(404).json({ error: "order not found" });

      res.json({ message: "order updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  search: async (req, res) => {
     const userId = req.userId;
    const { filterBy, value } = req.query;

    if (!filterBy || value === undefined) {
      return res.status(400).json({ error: "Missing search parameters" });
    }

    try {
      const orders = await ordersModel.searchorders(userId, filterBy, value);
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }
      res.status(200).json(orders);
    } catch (err) {
      console.error("Error searching orders:", err);
      res.status(500).json({ error: "Failed to search orders" });
    }
  }
};

export default ordersController;
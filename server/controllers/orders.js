import orderDetailsModel from "../modules/orderDetail.js";
import express from "express";
import ordersModel from "../modules/orders.js";
import orderDetailsController from "./orderDetail.js";
import booksModel from "../modules/books.js";
import library from "./library.js";
import libraryModel from "../modules/library.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const ordersController = {
  getAllByUserId: async (req, res) => {
    // const { userId } = req.params;

    const userId = req.params.userId;
    const { sortBy } = req.query;
    console.log("Fetching orders for user ID:", userId);

    try {
      const orders = await ordersModel.getAllByUserId(userId, sortBy);
      console.log(orders)
      const filteredOrders = orders.map(order => ({
        Id: order.Id,
        date: order.date
      }));

      res.json(filteredOrders);
    } 
    catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  add: async (req, res) => {
    const { ccNumber, validity, cvv, date, orderedBookIds, total } = req.body;
    const userId = req.user.id;
    console.log("Adding order for user ID:", userId);
    if (!ccNumber || !validity || !cvv || !date) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const orderToSave = {
      userId, ccNumber, validity, cvv, date, total
    };

    try {
      for (const bookId of orderedBookIds) {
        const book = await booksModel.getById(bookId);
        if (!book) {
          return res.status(400).json({ error: `Book with ID ${bookId} does not exist` });
        }
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        customer_email: email,
        mode: "payment",
        success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/payment-cancel`,
      });
      const result = await ordersModel.add(orderToSave);

      // const resultOrderDetails = await orderDetailsController.add(
      //   result.orderId,orderedBookIds,res);
      console.log("Order added successfully:", result);
      const Bookmark_On_Page = 0;
      const resultLibraryDetails = await library.add(userId,
        result.orderId, orderedBookIds, Bookmark_On_Page, res);
      res.status(201).json({
        message: "order added successfully",
        orderId: result.orderId
      });
    } catch (err) {
      console.error("Error adding the order to the database:", err);
      res.status(500).json({ error: "Error adding the order" });
    }
  },
  createCheckoutSession: async (req, res) => {
    try {
      const { orderedBookIds } = req.body;
      const userId = req.user.id;
      const email = req.user.Email;
      console.log("Creating checkout session for user ID:", userId);
      if (!orderedBookIds || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const line_items = [];
      for (const bookId of orderedBookIds) {
        const book = await booksModel.getById(bookId);
        if (!book) {
          return res.status(400).json({ error: `Book ID ${bookId} not found` });
        }
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: { name: book.Book_Name },
            unit_amount: Math.round(Number(book.Price) * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
      
        payment_method_types: ['card'],
        line_items,
        customer_email: email,
        mode: 'payment',
        success_url: `http://localhost:5173/${email}/${userId}/cart?status=success`,
        cancel_url: `http://localhost:5173/payment-cancel`,
        metadata: {
          userId,
          orderedBookIds: JSON.stringify(orderedBookIds),
        },
      });
      console.log("Checkout session created successfully:", session.id);
       res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  },
  add: async (req, res) => {
    console.log("AddHitting add endpoint for orders");
    try {
      const { userId, email, orderedBookIds, stripeSessionId, date } = req.body;

      if (!orderedBookIds || !userId || !email || !stripeSessionId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // בדיקה: האם כבר קיימת הזמנה עם אותו session?
      // const existingOrder = await ordersModel.getBySessionId(stripeSessionId);
      // if (existingOrder) {
      //   console.log("⛔ הזמנה כבר קיימת עבור session זה");
      //   return res.status(200).json({ message: "Order already exists" });
      const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
      const amountTotal = stripeSession.amount_total / 100; // בדולרים

      // שמירת ההזמנה במסד הנתונים
      const orderResult = await ordersModel.add({
        userId,
        date: date || new Date(),
        total: amountTotal,
        stripeSessionId: stripeSessionId,
      });
      const Bookmark_On_Page = 0;
      const resultLibraryDetails = await library.add(userId,
        orderResult.orderId, orderedBookIds, Bookmark_On_Page, res);
      console.log("✔ הזמנה נשמרה בהצלחה:", orderResult);
      res.status(201).json({ message: "Order saved" });
    } catch (error) {
      console.error("❌ שגיאה בשמירת ההזמנה:", error);
      res.status(500).json({ error: "Failed to save order" });
    }
  },

// ordersController.js
getById: async (req, res) => {
  const { orderId } = req.params;
  console.log("Fetching order with ID:", orderId);

  try {
    const results = await ordersModel.getById(orderId);

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = {
      Id: results[0].Order_Id,
      User_Id: results[0].User_Id,
      date: results[0].Order_Date,
      total: results[0].Total_Amount,
      books: results.map(row => ({
        Id: row.Book_Id,
        Book_Name: row.Book_Name,
        Price: row.Price
      }))
    };
console.log(order);
    res.json(order);
  } catch (err) {
    console.error("❌ Error in getById:", err);
    res.status(500).json({ error: "Database error" });
  }
},

  delete: async (req, res) => {
    const { orderId } = req.params;

    try {
      const resultLibraryDetails = await libraryModel.deleteByOrderId(orderId);
      let result = null;
      if (!resultLibraryDetails) {
        result = await ordersModel.delete(orderId);
      }
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
    const userId = req.user.id;

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
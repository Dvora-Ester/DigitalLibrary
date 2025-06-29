
import orderDetailsModel from "../modules/orderDetail.js";
import express from "express";
import ordersModel from "../modules/orders.js";
import orderDetailsController from "./orderDetail.js";
import booksModel from "../modules/books.js";
import library from "./library.js";
import libraryModel from "../modules/library.js";
import Stripe from "stripe";
import {
  addOrderSchema,
  createCheckoutSessionSchema,
  addSchema,
  updateOrderSchema,
  searchOrdersSchema,
} from "../middleware/validation.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const ordersController = {
  getAllByUserId: async (req, res) => {
    const userId = req.user.id;
    const { sortBy } = req.query;

    try {
      const orders = await ordersModel.getAllByUserId(userId, sortBy);
      const filteredOrders = orders.map((order) => ({
        Id: order.Id,
        date: order.date,
      }));

      res.json(filteredOrders);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    }
  },



  createCheckoutSession: async (req, res) => {
    const { error } = createCheckoutSessionSchema.validate(req.body);
    if (error)
      return res.status(400).json({ error: error.details[0].message });

    try {
      const { orderedBookIds } = req.body;
      const userId = req.user.id;
      const email = req.user.Email;

      const line_items = [];
      for (const bookId of orderedBookIds) {
        const book = await booksModel.getById(bookId);
        if (!book) {
          return res.status(400).json({ error: `Book ID ${bookId} not found` });
        }
        line_items.push({
          price_data: {
            currency: "usd",
            product_data: { name: book.Book_Name },
            unit_amount: Math.round(Number(book.Price) * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        customer_email: email,
        mode: "payment",
        success_url: `http://localhost:5173/${email}/${userId}/cart?status=success`,
        cancel_url: `http://localhost:5173/payment-cancel`,
        metadata: {
          userId,
          orderedBookIds: JSON.stringify(orderedBookIds),
        },
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  },
  add: async (req, res) => {
    const { error } = addSchema.validate(req.body);
    if (error)
      return res.status(400).json({ error: error.details[0].message });

    try {
      const { userId, email, orderedBookIds, stripeSessionId, date } = req.body;

      // שליפת הסשן מ-Stripe
      const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
      const amountPaid = stripeSession.amount_total; // ב-cents

      // חישוב הסכום הצפוי לפי הספרים
      let expectedAmount = 0;
      for (const bookId of orderedBookIds) {
        const book = await booksModel.getById(bookId);
        if (!book) {
          return res.status(400).json({ error: `Book ID ${bookId} not found` });
        }
        expectedAmount += Math.round(Number(book.Price) * 100); // cent
      }

      // בדיקת התאמה בין מה ש-Stripe קיבל למה שהשרת חושב שצריך לשלם
      if (amountPaid !== expectedAmount) {
        return res.status(400).json({
          error: "סכום התשלום אינו תואם למחירי הספרים",
          details: {
            expectedAmount,
            amountPaid,
          },
        });
      }

      // שמירת ההזמנה במסד הנתונים
      const orderResult = await ordersModel.add({
        userId,
        date: date || new Date(),
        total: amountPaid / 100, // להצגה בפורמט דולר
        stripeSessionId,
      });

      const Bookmark_On_Page = 0;
      await library.add(userId, orderResult.orderId, orderedBookIds, Bookmark_On_Page, res);

      res.status(201).json({ message: "Order saved" });

    } catch (error) {
      console.error("Failed to save order:", error);
      res.status(500).json({ error: "Failed to save order" });
    }
  },

 
  getById: async (req, res) => {
    const { orderId } = req.params;

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
        books: results.map((row) => ({
          Id: row.Book_Id,
          Book_Name: row.Book_Name,
          Price: row.Price,
        })),
      };

      res.json(order);
    } catch (err) {
      console.error("Error in getById:", err);
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
      if (!result)
        return res.status(404).json({ error: "No orders found for this user" });

      res.json(result);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    }
  },

  update: async (req, res) => {
    const { error } = updateOrderSchema.validate(req.body);
    if (error)
      return res.status(400).json({ error: error.details[0].message });

    const { orderId } = req.params;
    const { ccNumber, validity, cvv, date } = req.body;

    try {
      const result = await ordersModel.update(orderId, { ccNumber, validity, cvv, date });
      if (!result || result.affectedRows === 0)
        return res.status(404).json({ error: "Order not found" });

      res.json({ message: "Order updated successfully" });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    }
  },

  search: async (req, res) => {
    const { error } = searchOrdersSchema.validate(req.query);
    if (error)
      return res.status(400).json({ error: error.details[0].message });

    const userId = req.user.id;
    const { filterBy, value } = req.query;

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
  },
};

export default ordersController;

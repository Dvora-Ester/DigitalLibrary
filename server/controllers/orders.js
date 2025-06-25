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

    const userId = req.user.id;
    const { sortBy } = req.query;
    console.log("Fetching orders for user ID:", userId);

    try {
      const orders = await ordersModel.getAllByUserId(userId, sortBy);
      const filteredOrders = orders.map(order => ({
        Id: order.Id,
        date: order.date
      }));

      res.json(filteredOrders);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },

  add1: async (req, res) => {
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
  add: async (req, res) => {
    try {
      const { orderedBookIds, email } = req.body;
      const userId = req.user.id;

      if (!orderedBookIds || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const line_items = [];
      for (const bookId of orderedBookIds) {
        const book = await booksModel.getById(bookId);
        if (!book) {
          return res.status(400).json({ error: `Book with ID ${bookId} does not exist` });
        }
        line_items.push({
          price_data: {
            currency: "usd",
            product_data: { name: book.title },
            unit_amount: Math.round(book.price * 100),
          },
          quantity: 1,
        });
      }

      // יצירת session תשלום ב-Stripe, ושמירת מידע מזהה להזמנה
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        customer_email: email,
        mode: "payment",
        success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/payment-cancel`,
        metadata: {
          userId: userId,
          orderedBookIds: JSON.stringify(orderedBookIds)
        }
      });

      // מחזירים ללקוח את כתובת התשלום
      res.status(200).json({ url: session.url });

    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  },
  getById: async (req, res) => {
    const { orderId } = req.params;
    console.log("Fetching order with ID:", orderId);
    try {
      const order = await ordersModel.getById(orderId);
      console.log("Order fetched successfully:", order);
      res.json(order);
    } catch (err) {
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
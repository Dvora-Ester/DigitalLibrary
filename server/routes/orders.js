import express from "express";
import Stripe from "stripe";
import ordersController from "../controllers/orders.js";
import { isAdmin, verifyToken } from "../middleware/outh.js";

const orderRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
console.log("hello i am in order stripe");
// שליפת הזמנות
orderRouter.get("/getAllOrdersByUserId/:userId", verifyToken, ordersController.getAllByUserId);
orderRouter.get("/getOrderById/:orderId", verifyToken, ordersController.getById);
orderRouter.get("/search/", verifyToken, ordersController.search);

// יצירת session
orderRouter.post("/addOrder", verifyToken, ordersController.createCheckoutSession);

// עדכון, מחיקה
orderRouter.delete("/deleteOrder/:orderId", verifyToken, isAdmin, ordersController.delete);
orderRouter.put("/updateOrder/:orderId", verifyToken, ordersController.update);

// קבלת תשלום והוספת הזמנה
orderRouter.get("/confirmOrder", async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "Missing session_id" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const userId = session.metadata.userId;
    const email = session.customer_email;
    const orderedBookIds = JSON.parse(session.metadata.orderedBookIds);

    await ordersController.add({
      body: { userId, email, orderedBookIds, stripeSessionId: session_id },
      user: { id: userId, Email: email }
    }, res);
  } catch (err) {
    console.error("❌ Failed to confirm order:", err);
    res.status(500).json({ error: "Failed to confirm order" });
  }
});

export default orderRouter;
import express from "express";
import ordersController from "../controllers/orders.js";
import { isAdmin, verifyToken } from "../middleware/outh.js"; // Ensure you have the correct path to your auth middleware

const orderRouter = express.Router();

orderRouter.get("/getAllOrdersByUserId",verifyToken, ordersController.getAllByUserId);
console.log("Order router initialized");
orderRouter.post("/addOrder",verifyToken ,ordersController.add);
orderRouter.delete("/deleteOrder/:orderId",verifyToken,isAdmin, ordersController.delete);
orderRouter.put("/updateOrder/:orderId",verifyToken, ordersController.update);
orderRouter.get("/search/",verifyToken, ordersController.search);

export default orderRouter;
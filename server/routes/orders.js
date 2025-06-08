import express from "express";
import ordersController from "../controllers/orders.js";

const orderRouter = express.Router();

orderRouter.get("/getAllOrdersByUserId/:userId", ordersController.getAllByUserId);
console.log("Order router initialized");
orderRouter.post("/addOrder/:userId", ordersController.add);
orderRouter.delete("/deleteOrder/:id", ordersController.delete);
orderRouter.put("/updateOrder/:order_id", ordersController.update);
orderRouter.get("/search/:userId", ordersController.search);

export default orderRouter;
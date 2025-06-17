import express from "express";
import orderDetailsController from "../controllers/orderDetail.js";
import { verifyToken } from "../middleware/outh.js"; // Ensure you have the correct path to your auth middleware

const orderDetailRouter = express.Router();

orderDetailRouter.get("/getOrdersDetailByOrdersrIdAndBookId/:orderId/:bookId",verifyToken, orderDetailsController.getOrderDetailsByOrdersrIdAndBookId);
console.log("Order router initialized");
orderDetailRouter.post("/addOrderDetails",verifyToken ,orderDetailsController.add);
// orderDetailRouter.addOrderDetailsdelete("/deleteOrdersDetail/:orderId",verifyToken, ordersDetailController.delete);
// orderDetailRouter.put("/updateOrdersDetail/:orderId",verifyToken, ordersDetailController.update);
// orderDetailRouter.get("/search/",verifyToken, ordersDetailController.search);

export default orderDetailRouter;
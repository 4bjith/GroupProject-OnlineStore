import express from 'express'
import { allOrders, createOrder, deleteOrder, getCustomersOrder, getStoreOrders, updateOrderStatus } from '../controller/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/order",createOrder)
orderRouter.get("/orders", allOrders)
orderRouter.get("/order/customer/:id", getCustomersOrder)
orderRouter.get("/order/store/:id", getStoreOrders)
orderRouter.put("/order/:id", updateOrderStatus)
orderRouter.delete("/order/:id", deleteOrder)

export default orderRouter;
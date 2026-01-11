import express from "express";
import { allOrders, createOrder, deleteOrder, getCustomersOrder, getStoreOrders, updateOrderStatus } from "../controller/orderController.js";
import { monthlySalesController, ownerSalesAnalysisController, topSellingProductsController, dashboardStatsController } from "../controller/salesController.js";

const orderRouter = express.Router();

orderRouter.post("/create", createOrder)
orderRouter.get("/customer/:id", getCustomersOrder)
orderRouter.get("/store/:id", getStoreOrders)
orderRouter.get("/all", allOrders)
orderRouter.put("/status/:id", updateOrderStatus)
orderRouter.delete("/delete/:id", deleteOrder)

orderRouter.get("/sales", ownerSalesAnalysisController)
orderRouter.get("/sales/monthly", monthlySalesController)
orderRouter.get("/sales/top-products", topSellingProductsController)
orderRouter.get("/dashboard/stats", dashboardStatsController)

export default orderRouter;
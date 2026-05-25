import express from "express";
import { allOrders, createOrder, deleteOrder, getCustomersOrder, getStoreOrders, updateOrderStatus } from "../controller/orderController.js";
import { monthlySalesController, ownerSalesAnalysisController, topSellingProductsController, dashboardStatsController, salesChartController, platformStatsController } from "../controller/salesController.js";

const orderRouter = express.Router();

orderRouter.post("/order", createOrder)
orderRouter.get("/orders", allOrders)
orderRouter.get("/order/customer/:id", getCustomersOrder)
orderRouter.get("/order/store/:id", getStoreOrders)
orderRouter.put("/order/:id", updateOrderStatus)
orderRouter.delete("/order/:id", deleteOrder)

orderRouter.get("/sales", ownerSalesAnalysisController)
orderRouter.get("/sales/monthly", monthlySalesController)
orderRouter.get("/sales/top-products", topSellingProductsController)
orderRouter.get("/dashboard/stats", dashboardStatsController)
orderRouter.get("/platform/stats", platformStatsController)
orderRouter.get("/sales/chart", salesChartController)

export default orderRouter;
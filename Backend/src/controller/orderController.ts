import express from "express";
import { Order as OrderModel } from "../model/orderModel.js";
import UserModel from "../model/User.js";

// Controller to create a new order
export const createOrder = async (req: express.Request, res: express.Response) => {
    try {
        const {
            storeId,
            email,
            items,
            shippingAddress,
            totalAmount,
            paymentMethod,
            paymentStatus,
            shippingPrice,
        } = req.body as {
            storeId: string;
            email: string;
            items: any[];
            shippingAddress: {
                addressLine1: string;
                city: string;
                postalCode: string;
                country: string;
            };
            totalAmount: number;
            paymentMethod: string;
            paymentStatus: string;
            shippingPrice: number;
        };

        // validate required fields
        if (!storeId || !email || !items || !shippingAddress || !totalAmount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newOrder = await OrderModel.create({
            storeId,
            userId: user._id,
            items,
            shippingAddress,
            totalAmount,
            paymentMethod,
            paymentStatus,
            shippingPrice,
        }); // creating new order

        // check if order creation was successful
        if (!newOrder) {
            return res.status(404).json({ status: "error", message: "Failed to create New order" });
        }

        // respond with success message
        return res.status(201).json({ message: "Order Created !" });
    } catch (error) {
        res.status(500).send(error)
    }
}

// Controller to get orders for a specific user

export const getCustomersOrder = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params as { id: string };
        const { limit, page } = req.query as { limit?: string, page?: string };

        if (!id) {
            res.status(400).send("User Id missing")
        }

        const customerOrders = await OrderModel.find({ userId: id }).populate("items.productId").populate("storeId").populate("userId")
            .limit(limit ? parseInt(limit as string) : 10)
            .skip(page && limit ? (parseInt(page as string) - 1) * parseInt(limit as string) : 0);

        if (!customerOrders) {
            res.status(404).json({ message: "failed to fetch || No order has been created by the current user" });
        }

        res.status(200).json({
            message: "order successfully fetched",
            length: customerOrders.length,
            page: page ? parseInt(page as string) : 1,
            orders: customerOrders
        })

    } catch (error) {
        res.status(500).send(error)
    }
}

// Controller to get orders for a specific store 
export const getStoreOrders = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params as { id: string };
        const { limit, page } = req.query as { limit?: string, page?: string };
        if (!id) {
            res.status(400).send("Store Id missing")
        }

        const storeOrders = await OrderModel.find({ storeId: id }).populate("items.productId").populate("storeId").populate("userId")
            .limit(limit ? parseInt(limit as string) : 10)
            .skip(page && limit ? (parseInt(page as string) - 1) * parseInt(limit as string) : 0);

        if (!storeOrders) {
            res.status(404).json({ message: "failed to fetch || No order has been created for the current store" });
        }

        res.status(200).json({
            message: "order successfully fetched",
            length: storeOrders.length,
            page: page ? parseInt(page as string) : 1,
            orders: storeOrders
        })
    } catch (error) {
        res.status(500).send(error)
    }
};

// Controller to get all orders with pagination
export const allOrders = async (req: express.Request, res: express.Response) => {
    try {
        const { limit, page } = req.query;

        // fetch orders with pagination
        const orders = await OrderModel.find({}).populate("items.productId").populate("storeId").populate("userId").sort({createdAt : -1})
            .limit(limit ? parseInt(limit as string) : 10)
            .skip(page && limit ? (parseInt(page as string) - 1) * parseInt(limit as string) : 0);

        // check if orders exist
        if (!orders) {
            res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({
            message: "Orders fetched successfully",
            length: orders.length,
            page: page ? parseInt(page as string) : 1,
            orders
        }); // respond with orders
    } catch (error) {
        res.status(500).send(error)
    }
}


// update order status 

export const updateOrderStatus = async (req: express.Request, res: express.Response) => {
    try {
        const { id: orderId } = req.params as { id: string };
        const {

            status,
            paymentStatus,
            paymentMethod
        } = req.body as {

            status: string,
            paymentStatus: string,
            paymentMethod: string
        };

        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        };
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (status) order.status = status as "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
        if (paymentStatus) order.paymentStatus = paymentStatus as "Pending" | "Completed" | "Failed";
        if (paymentMethod) order.paymentMethod = paymentMethod as "Credit Card" | "PayPal" | "Bank Transfer" | "Cash on Delivery" | null;
        await order.save();

        return res.status(200).json({ message: "Order updated successfully", order });
    } catch (error) {
        res.status(500).send(error)
    }
}

// delete order controller 
export const deleteOrder = async (req: express.Request, res: express.Response) => {
    try {
        const { id: orderId } = req.params as { id: string };
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }
        const order = await OrderModel.findByIdAndDelete(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).send(error)
    }
}

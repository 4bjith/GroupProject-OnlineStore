import express from "express";
import { Order } from "../model/orderModel.js";
import mongoose from "mongoose";
import Store from "../model/Store.js";

const getStartDate = (period: string): Date => {
    const now = new Date();
    if (period === '7days') {
        const date = new Date();
        date.setDate(now.getDate() - 7);
        return date;
    }
    if (period === '30days') {
        const date = new Date();
        date.setDate(now.getDate() - 30);
        return date;
    }
    if (period === '1year') {
        return new Date(now.getFullYear(), 0, 1);
    }
    // Default to This Year
    return new Date(now.getFullYear(), 0, 1);
};

export const saleAnalysisController = async (req: express.Request, res: express.Response) => {
    try {
        const { storeId } = req.query as { storeId: string };

        console.log("Raw Query Params:", req.query);

        if (!storeId) {
            res.status(400).json({ message: "storeId is required in query parameters" });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            res.status(400).json({ message: "Invalid storeId format" });
            return;
        }

        const salesData = await Order.aggregate([
            {
                $match: {
                    storeId: new mongoose.Types.ObjectId(storeId),
                },
            },
            {
                $group: {
                    _id: "$storeId",
                    totalSales: { $sum: "$totalAmount" },
                    averageSales: { $avg: "$totalAmount" },
                    maxSales: { $max: "$totalAmount" },
                    minSales: { $min: "$totalAmount" },
                },
            },
        ]);

        console.log("Aggregation Result:", JSON.stringify(salesData, null, 2));

        res.status(200).json({ salesData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const ownerSalesAnalysisController = async (req: express.Request, res: express.Response) => {
    try {
        const { ownerId, period } = req.query as { ownerId: string, period?: string };

        if (!ownerId) {
            res.status(400).json({ message: "ownerId is required in query parameters" });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            res.status(400).json({ message: "Invalid ownerId format" });
            return;
        }

        // Find all stores owned by this user
        const stores = await Store.find({ ownerId });

        if (!stores || stores.length === 0) {
            res.status(200).json({ salesData: [] });
            return;
        }

        const storeIds = stores.map(store => store._id);
        const startDate = getStartDate(period || '1year');

        const salesData = await Order.aggregate([
            {
                $match: {
                    storeId: { $in: storeIds },
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: "$storeId",
                    totalSales: { $sum: "$totalAmount" },
                    averageSales: { $avg: "$totalAmount" },
                    maxSales: { $max: "$totalAmount" },
                    minSales: { $min: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "stores",
                    localField: "_id",
                    foreignField: "_id",
                    as: "storeDetails"
                }
            },
            {
                $unwind: "$storeDetails"
            },
            {
                $project: {
                    storeName: "$storeDetails.name",
                    totalSales: 1,
                    averageSales: 1,
                    maxSales: 1,
                    minSales: 1,
                    orderCount: 1
                }
            }
        ]);

        res.status(200).json({ salesData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const monthlySalesController = async (req: express.Request, res: express.Response) => {
    try {
        const { ownerId, period } = req.query as { ownerId: string, period?: string };

        if (!ownerId) {
            res.status(400).json({ message: "ownerId is required in query parameters" });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            res.status(400).json({ message: "Invalid ownerId format" });
            return;
        }

        // Find all stores owned by this user
        const stores = await Store.find({ ownerId });

        if (!stores || stores.length === 0) {
            res.status(200).json({ monthlySales: Array(12).fill(0) });
            return;
        }

        const storeIds = stores.map(store => store._id);
        const startDate = getStartDate(period || '1year');

        const salesData = await Order.aggregate([
            {
                $match: {
                    storeId: { $in: storeIds },
                    createdAt: {
                        $gte: startDate
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalSales: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        // Initialize array for 12 months with 0
        const monthlySales = Array(12).fill(0);

        // Map aggregation results to the array (Mongo months are 1-indexed)
        salesData.forEach(item => {
            monthlySales[item._id - 1] = item.totalSales;
        });

        res.status(200).json({ monthlySales });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const topSellingProductsController = async (req: express.Request, res: express.Response) => {
    try {
        const { ownerId, page = 1, limit = 5, period } = req.query as { ownerId: string, page?: string, limit?: string, period?: string };
        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 5;
        const skip = (pageNum - 1) * limitNum;

        if (!ownerId) {
            res.status(400).json({ message: "ownerId is required in query parameters" });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            res.status(400).json({ message: "Invalid ownerId format" });
            return;
        }

        // Find all stores owned by this user
        const stores = await Store.find({ ownerId });

        if (!stores || stores.length === 0) {
            res.status(200).json({ topSellingProducts: [], totalDocs: 0 });
            return;
        }

        const storeIds = stores.map(store => store._id);
        const startDate = getStartDate(period || '1year');

        const aggregationPipeline: any[] = [
            {
                $match: {
                    storeId: { $in: storeIds },
                    createdAt: { $gte: startDate }
                }
            },
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.productId",
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                }
            },
            {
                $sort: { "totalQuantity": -1 }
            },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limitNum },
                        {
                            $lookup: {
                                from: "products",
                                localField: "_id",
                                foreignField: "_id",
                                as: "productDetails"
                            }
                        },
                        { $unwind: "$productDetails" },
                        {
                            $project: {
                                _id: 1,
                                name: "$productDetails.title",
                                image: { $arrayElemAt: ["$productDetails.images", 0] },
                                price: "$productDetails.price",
                                sales: "$totalQuantity",
                                rev: "$totalRevenue"
                            }
                        }
                    ],
                    totalDocs: [
                        { $count: "count" }
                    ]
                }
            }
        ];

        const result = await Order.aggregate(aggregationPipeline);

        const topSellingProducts = result[0].data;
        const totalDocs = result[0].totalDocs[0]?.count || 0;

        res.status(200).json({ topSellingProducts, totalDocs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
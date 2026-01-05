import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true }
            }
        ],
        shippingAddress: {
            addressLine1: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true }
        },
        totalAmount: { 
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"], 
            default: "Pending"
        },
        paymentMethod: {
            type: String,
            enum: ["Credit Card", "PayPal", "Bank Transfer", "Cash on Delivery"]
        },
        paymentStatus: { 
            type: String, 
            enum: ["Pending", "Completed", "Failed"], 
            default: "Pending" 
        },
        shippingPrice: {
            type: Number,
            required: true
        },
        isPaid: { 
            type: Boolean, 
            default: false 
        },
        paidAt: { type: Date },
        isDelivered: {
             type: Boolean, 
            default: false
        },
        deliveredAt: { type: Date }
    },
    {
        timestamps: true
    }
);

export const Order = mongoose.model("Order", orderSchema);
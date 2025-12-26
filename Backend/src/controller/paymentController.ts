import express from "express";
import PaymentModel from "../model/paymentModel.js";
import UserModel from "../model/User.js";
import jwt from "jsonwebtoken";

// Helper to get authenticated user ID
const getUserIdFromRequest = async (req: express.Request): Promise<string | null> => {
    try {
        if (!req.user) return null;
        const { email } = req.user as jwt.JwtPayload;
        if (!email) return null;

        // We assume the authenticated "User" is the "Merchant"
        const user = await UserModel.findOne({ email });
        return user ? user._id.toString() : null;
    } catch (error) {
        return null;
    }
};

/* ==========================================================================
   CREATE Payment Details (One-time setup)
   POST /api/payment/create
   ========================================================================== */
export const createPaymentDetails = async (req: express.Request, res: express.Response) => {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // Check if payment details already exist
        const existingPayment = await PaymentModel.findOne({ merchantId: userId });
        if (existingPayment) {
            return res.status(400).json({ message: "Payment details already exist for this merchant" });
        }

        const { kyc, bank, upi } = req.body;

        const newPayment = await PaymentModel.create({
            merchantId: userId,
            kyc,
            bank,
            upi
        });

        return res.status(201).json({ message: "Payment details created successfully", payment: newPayment });
    } catch (error) {
        console.error("Error creating payment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/* ==========================================================================
   GET Payment Details
   GET /api/payment/get
   ========================================================================== */
export const getPaymentDetails = async (req: express.Request, res: express.Response) => {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Explicitly selecting fields that might be hidden by 'select: false' in schema if the owner requests it?
        // Usually sensitive info like full card numbers/bank numbers might be masked or returned only if explicitly requested.
        // However, the schema has `select: false` for pan.number, aadhaar.number, bank.accountNumber.
        // If the owner wants to see them, we must use .select('+field').

        const payment = await PaymentModel.findOne({ merchantId: userId })
            .select("+kyc.pan.number +kyc.aadhaar.number +bank.accountNumber");

        if (!payment) {
            return res.status(404).json({ message: "Payment details not found" });
        }

        return res.status(200).json({ payment });
    } catch (error) {
        console.error("Error fetching payment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/* ==========================================================================
   UPDATE Payment Details
   PUT /api/payment/update
   ========================================================================== */
export const updatePaymentDetails = async (req: express.Request, res: express.Response) => {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { kyc, bank, upi } = req.body;

        const payment = await PaymentModel.findOne({ merchantId: userId });
        if (!payment) {
            return res.status(404).json({ message: "Payment details not found" });
        }

        // Cast to any to bypass missing TS interfaces for the document
        const paymentDoc = payment as any;

        // Update fields if provided
        if (kyc) {
            // Handle nested updates carefully
            if (kyc.pan) {
                paymentDoc.kyc.pan.number = kyc.pan.number || paymentDoc.kyc.pan.number;
                paymentDoc.kyc.pan.holderName = kyc.pan.holderName || paymentDoc.kyc.pan.holderName;
                paymentDoc.kyc.pan.verified = false;
            }
            if (kyc.aadhaar) {
                paymentDoc.kyc.aadhaar.number = kyc.aadhaar.number || paymentDoc.kyc.aadhaar.number;
                paymentDoc.kyc.aadhaar.verified = false;
            }
            paymentDoc.kyc.status = "pending";
        }

        if (bank) {
            if (bank.accountHolderName) paymentDoc.bank.accountHolderName = bank.accountHolderName;
            if (bank.bankName) paymentDoc.bank.bankName = bank.bankName;
            if (bank.accountNumber) paymentDoc.bank.accountNumber = bank.accountNumber;
            if (bank.ifsc) paymentDoc.bank.ifsc = bank.ifsc;
            if (bank.branch) paymentDoc.bank.branch = bank.branch;
            // Reset verification
            paymentDoc.bank.verified = false;
        }

        if (upi) {
            if (upi.upiId) paymentDoc.upi.upiId = upi.upiId;
            paymentDoc.upi.verified = false;
        }

        await payment.save();

        return res.status(200).json({ message: "Payment details updated successfully", payment });
    } catch (error) {
        console.error("Error updating payment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/* ==========================================================================
   DELETE Payment Details
   DELETE /api/payment/delete
   ========================================================================== */
export const deletePaymentDetails = async (req: express.Request, res: express.Response) => {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const deletedPayment = await PaymentModel.findOneAndDelete({ merchantId: userId });

        if (!deletedPayment) {
            return res.status(404).json({ message: "Payment details not found" });
        }

        return res.status(200).json({ message: "Payment details deleted successfully" });
    } catch (error) {
        console.error("Error deleting payment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

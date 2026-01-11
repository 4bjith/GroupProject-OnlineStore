import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // 🔗 Merchant Reference
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      unique: true,
    },

    // 🪪 KYC DETAILS
    kyc: {
      pan: {
        number: {
          type: String,
          uppercase: true,
          match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          select: false, // hide from API
        },
        holderName: String,
        verified: {
          type: Boolean,
          default: false,
        },
      },

      aadhaar: {
        number: {
          type: String,
          minlength: 12,
          maxlength: 12,
          select: false, // hide
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },

      status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending",
      },

      rejectedReason: String,
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },

    // 🏦 BANK ACCOUNT (PAYOUT)
    bank: {
      accountHolderName: String,
      bankName: String,
      accountNumber: {
        type: String,
        select: false, // sensitive
      },
      ifsc: {
        type: String,
        uppercase: true,
      },
      branch: String,
      verified: {
        type: Boolean,
        default: false,
      },
    },

    // 📱 UPI (OPTIONAL)
    upi: {
      upiId: String,
      verified: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const PaymentModel = mongoose.model("Payment", PaymentSchema);

export default PaymentModel;
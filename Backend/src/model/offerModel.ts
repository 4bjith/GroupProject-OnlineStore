import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const OfferModel = mongoose.model("Offer", offerSchema);
export default OfferModel;

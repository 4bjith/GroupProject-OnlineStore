import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String, 
        required: true,
    },
    slug: {
        type: String,
        required: true, 
        unique: true,
    },
    domain: {
        type: String,
        unique: true,
        sparse: true,
    },
    currency: {
        type: String,
        required: true,
    },
    templateId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        required: true,
    },
    commissionRate: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Store = mongoose.model('Store', StoreSchema);

export default Store;
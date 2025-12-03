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
    currency: {
        type: String,
        required: true,
    },
    template: { 
        type: String,
        required: true,
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
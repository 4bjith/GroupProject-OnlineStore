import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    catname: {
        type: String,
        required: true,
    },
    catimage: {
        type: String,
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const categoryModel = mongoose.model('Category', CategorySchema);

export default categoryModel;
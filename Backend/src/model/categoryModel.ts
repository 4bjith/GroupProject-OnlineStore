import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    categoryname: {
        type: String,
        required: true,
    },
    categoryimage: {
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
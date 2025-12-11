import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  images: [{ type: String }],
  stock: { type: Number, required: true },
  stockKeepingUnit: { type: String },
  specifications: [{ key: String, value: String }],
  tags: [{ type: String }],
  market: { type: String },
  isActive: { type: Boolean, default: true },
  isFinite: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
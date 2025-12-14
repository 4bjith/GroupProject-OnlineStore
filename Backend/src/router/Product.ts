import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
} from "../controller/productController.js";

import { upload } from "../multer.js";

const router = express.Router();

// CREATE PRODUCT (with images)
router.post("/products", upload.array("images", 10), createProduct);

// READ
router.get("/products/:id", getProductById);
router.get("/product", getAllProducts);

// UPDATE
router.put("/products/:id", upload.array("images", 10), updateProductById);

// DELETE
router.delete("/products/:id", deleteProductById);

export default router;

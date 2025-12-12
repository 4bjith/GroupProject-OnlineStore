import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProductById, deleteProductById } from '../controller/productController.js';

const router = express.Router();

router.post('/products', createProduct);

router.get('/products/:id', getProductById);
router.get('/product', getAllProducts);
router.put('/products/:id', updateProductById);
router.delete('/products/:id', deleteProductById);

export default router;
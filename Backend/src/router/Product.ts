import express from 'express';
import { createProduct, getAllProducts, getProductById } from '../controller/productController.js';

const router = express.Router();

router.post('/products', createProduct);

router.get('/products/:id', getProductById);
router.get('/products', getAllProducts);

export default router;
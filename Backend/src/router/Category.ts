import express from 'express';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controller/categoryController.js';


const router = express.Router();

router.get("/category",getAllCategories)
router.post("/category/create",createCategory)
router.put("/category/update/:id",updateCategory)
router.delete("/category/delete/:id",deleteCategory)

export default router

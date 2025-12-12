import express from 'express';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controller/categoryController.js';
import { upload } from '../multer.js';


const router = express.Router();

router.get("/category", getAllCategories)
router.post("/category/create", upload.single('categoryimage'), createCategory)
router.put("/category/update/:id", upload.single('categoryimage'), updateCategory)
router.delete("/category/delete/:id", deleteCategory)

export default router

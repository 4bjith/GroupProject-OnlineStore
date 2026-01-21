import express from 'express';
import { createCategory, deleteCategory, getAdminCategories, getAllCategories, getCategorybystoreid, updateCategory } from '../controller/categoryController.js';
import { upload } from '../multer.js';
import { LoginCheck } from '../Middleware/LoginCheck.js';


const router = express.Router();

router.get("/category", getAllCategories)
router.get("/admin-categories", LoginCheck, getAdminCategories)
router.get("/category/:storeId", getCategorybystoreid)
router.post("/category/create", upload.single('catimage'), createCategory)
router.put("/category/update/:id", upload.single('catimage'), updateCategory)
router.delete("/category/delete/:id", deleteCategory)

export default router

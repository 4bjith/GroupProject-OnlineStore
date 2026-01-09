import express from 'express';
import { createStore, deleteStore, getAllStores, getStore, updateStore } from '../controller/StoreController.js';
import { upload } from '../multer.js';
const router = express.Router();

router.post('/stores',upload.single("logo"), createStore);
router.get('/stores/:id', getStore);
router.get('/stores', getAllStores);
router.put('/stores/:id',upload.single("logo"), updateStore);
router.delete('/stores/:id', deleteStore);

export default router;
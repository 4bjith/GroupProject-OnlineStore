import express from 'express';
import { createStore, deleteStore, getStore, updateStore } from '../controller/StoreController.js';
const router = express.Router();

router.post('/stores', createStore);
router.get('/stores/:id', getStore);
router.put('/stores/:id', updateStore);
router.delete('/stores/:id', deleteStore);

export default router;
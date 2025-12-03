import express from 'express';
import { createStore } from '../controller/Store.js';
const router = express.Router();

router.post('/stores', createStore);

export default router;
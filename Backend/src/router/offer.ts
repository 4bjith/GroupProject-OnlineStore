import express from 'express';
import { createOffer, getOffers, deleteOffer } from '../controller/offerController.js';

const router = express.Router();

router.post('/offers', createOffer);
router.get('/offers', getOffers);
router.delete('/offers/:id', deleteOffer);

export default router;

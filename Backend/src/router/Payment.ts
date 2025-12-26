import express from 'express';
import { createPaymentDetails, deletePaymentDetails, getPaymentDetails, updatePaymentDetails } from '../controller/paymentController.js';


const router = express.Router();

router.get('/payment', getPaymentDetails)
router.post('/payment/create', createPaymentDetails)
router.put('/payment/update/:id', updatePaymentDetails)
router.delete('/payment/delete/:id', deletePaymentDetails)

export default router

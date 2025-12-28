import express from 'express';
import { createPaymentDetails, deletePaymentDetails, getPaymentDetails, updatePaymentDetails } from '../controller/paymentController.js';
import { LoginCheck } from '../Middleware/LoginCheck.js';


const router = express.Router();

router.get('/payment', LoginCheck, getPaymentDetails)
router.post('/payment/create', LoginCheck, createPaymentDetails)
router.put('/payment/update/:id', LoginCheck, updatePaymentDetails)
router.delete('/payment/delete/:id', LoginCheck, deletePaymentDetails)

export default router

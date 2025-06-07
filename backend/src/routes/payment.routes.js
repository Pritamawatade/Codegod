import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createOrder, saveOrder } from '../controllers/payment.controller.js';


const paymentRoute = express.Router();

paymentRoute.post('/create-order', authMiddleware, createOrder)
paymentRoute.post('/save-payment', authMiddleware, saveOrder)
export default paymentRoute;    
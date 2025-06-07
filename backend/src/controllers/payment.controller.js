import { db } from '../libs/db.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import razorpayInstance from '../utils/razorpay.js';

const createOrder = async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // Razorpay accepts paisa
      currency: currency || 'INR',
      receipt: receipt || 'receipt_order_' + Date.now(),
    };

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json(new ApiResponse(200, order, 'Order created'));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, 'Something went wrong at createOrder', err);
  }
};

const saveOrder = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    sheetId,
    userId,
  } = req.body;

  try {
    const payment = await db.payment.create({
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpaySignature: razorpay_signature,
        userId,
        sheetId,
      },
    });

    await db.userPurchasedSheet.create({
      data: {
        userId,
        sheetId,
      },
    });

    return res.status(200).json(new ApiResponse(200, payment, 'Payment saved'));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, 'Something went wrong at saveOrder', err);
  }
};

export { createOrder, saveOrder };

import express from 'express';
import {
  createPaymentMode,
  getPaymentModes,
  updatePaymentMode,
  deletePaymentMode,
} from '../controllers/paymentModeController.js';

const router = express.Router();

router.get('/select', getPaymentModes);
router.post('/insert', createPaymentMode);
router.put('/update', updatePaymentMode);
router.delete('/delete', deletePaymentMode);

export default router;

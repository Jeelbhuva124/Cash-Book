import express from 'express';
import {
  createCashbook,
  getCashbooks,
  updateCashbook,
  deleteCashbook,
} from '../controllers/cashbookController.js';

const router = express.Router();

// GET and POST cashbooks
router.get('/select', getCashbooks);
router.post('/select', getCashbooks);

// POST create new cashbook
router.post('/insert', createCashbook);

// PUT update existing cashbook
router.put('/update', updateCashbook);

// DELETE remove cashbook
router.delete('/delete', deleteCashbook);

export default router;

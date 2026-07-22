import express from 'express';
import {
  createCashbook,
  getCashbooks,
  updateCashbook,
  deleteCashbook,
} from '../controllers/cashbookController.js';

const router = express.Router();

// GET all cashbooks
router.get('/select', getCashbooks);

// POST create new cashbook
router.post('/insert', createCashbook);

// PUT update existing cashbook
router.put('/update', updateCashbook);

// DELETE remove cashbook
router.delete('/delete', deleteCashbook);

export default router;

import express from 'express';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';

const router = express.Router();

// GET all transactions
router.get('/select', getTransactions);

// POST create new transaction
router.post('/insert', createTransaction);

// PUT update existing transaction
router.put('/update', updateTransaction);

// DELETE remove transaction(s)
router.delete('/delete', deleteTransaction);

export default router;

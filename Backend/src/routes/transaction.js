import express from 'express';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getPartyLedger,
} from '../controllers/transactionController.js';

const router = express.Router();

// GET and POST transactions
router.get('/select', getTransactions);
router.post('/select', getTransactions);

// GET and POST party ledger
router.get('/party-ledger', getPartyLedger);
router.post('/party-ledger', getPartyLedger);

// POST create new transaction
router.post('/insert', createTransaction);

// PUT update existing transaction
router.put('/update', updateTransaction);

// DELETE remove transaction(s)
router.delete('/delete', deleteTransaction);

export default router;

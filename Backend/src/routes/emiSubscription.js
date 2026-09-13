import express from 'express';
import {
  getEmiSubscriptions,
  createEmiSubscription,
  markAsPaid,
  deleteEmiSubscription,
} from '../controllers/emiSubscriptionController.js';

const router = express.Router();

// GET all EMIs & Subscriptions
router.get('/select', getEmiSubscriptions);

// POST create new record
router.post('/insert', createEmiSubscription);

// POST mark as paid
router.post('/mark-paid', markAsPaid);

// DELETE record
router.delete('/delete/:id', deleteEmiSubscription);

export default router;

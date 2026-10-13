import express from 'express';
import {
  getEmiSubscriptions,
  createEmiSubscription,
  markAsPaid,
  deleteEmiSubscription,
} from '../controllers/emiSubscriptionController.js';

const router = express.Router();

// GET and POST all EMIs & Subscriptions
router.get('/select', getEmiSubscriptions);
router.post('/select', getEmiSubscriptions);
router.get('/', getEmiSubscriptions);
router.post('/', getEmiSubscriptions);

// POST create new record
router.post('/insert', createEmiSubscription);

// POST mark as paid
router.post('/mark-paid', markAsPaid);

// DELETE record
router.delete('/delete/:id', deleteEmiSubscription);
router.delete('/delete', deleteEmiSubscription);

export default router;

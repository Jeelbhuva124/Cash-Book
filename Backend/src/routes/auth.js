import express from 'express';
import authController from '../controllers/authController.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * ─── AUTHENTICATION & SYNC ROUTES ───
 * Base URL: http://localhost:5001/api/auth
 */

// Sync endpoint after Firebase Client Sign-in
router.post('/sync-user', authController.syncUser);
router.post('/insert', authController.syncUser);

// Get User Profile (Protected - Requires Auth)
router.get('/select', requireAuth, authController.getUserProfile);

// Admin-Only Test Route (Protected - Requires Admin Role)
router.get('/admin-check', requireAuth, requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Access Granted: You are an Admin!',
    data: [req.user],
  });
});

export default router;

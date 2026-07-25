import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// ADMIN AUTHENTICATION
router.post('/login', adminController.login);

// ADMIN ACTION-BASED ROUTES (AGENTS.md CONVENTION)
router.get('/select', adminController.select);
router.post('/select', adminController.select);

router.post('/insert', adminController.insert);

router.post('/update', adminController.update);

router.post('/delete', adminController.delete);

router.get('/stats', adminController.stats);
router.post('/stats', adminController.stats);

export default router;

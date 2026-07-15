import express from 'express';
import userController from '../controllers/user.js';

const router = express.Router();

// SIGNUP / SAVE / UPDATE USER PROFILE
router.post('/signup', userController.saveEntry);
router.post('/save', userController.saveEntry);

// LOGIN USER
router.post('/login', userController.loginEntry);
router.post('/verify-otp', userController.verifyOtp);

// GOOGLE AUTH
router.post('/google-auth', userController.googleAuthEntry);

// GET ALL USER ENTRIES
router.get('/get-all', userController.getAllEntries);

// DELETE USER
router.post('/delete', userController.deleteEntry);

export default router;

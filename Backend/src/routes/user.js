import express from 'express';
import userController from '../controllers/user.js';

const router = express.Router();

// SIGNUP / SAVE / UPDATE USER PROFILE
router.post('/signup', userController.saveEntry);
router.post('/save', userController.saveEntry);

// LOGIN USER & OTP
router.post('/login', userController.loginEntry);
router.post('/verify-otp', userController.verifyOtp);

// ADMIN AUTHENTICATION
router.post('/admin-login', userController.adminLogin);
router.post('/verify-admin', userController.verifyAdmin);

// GOOGLE AUTH
router.post('/google-auth', userController.googleAuthEntry);

// GET ALL USER ENTRIES
router.get('/get-all', userController.getAllEntries);
router.get('/select', userController.getAllEntries);

// DELETE USER
router.post('/delete', userController.deleteEntry);

export default router;

import { getAuth } from 'firebase-admin/auth';
import { getApps } from 'firebase-admin/app';
import User from '../models/user.js';

/**
 * Middleware: Verify Firebase ID Token & attach MongoDB User to req.user
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No Bearer token provided',
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (getApps().length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Server Error: Firebase Admin SDK is not initialized',
      });
    }

    // 1. Verify token with Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(idToken);

    // 2. Find MongoDB user using firebase_uid
    const mongoUser = await User.findOne({ firebase_uid: decodedToken.uid });

    if (!mongoUser) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User account not synchronized in database',
      });
    }

    // 3. Attach MongoDB user object to req.user
    req.user = mongoUser;
    req.firebaseToken = decodedToken;

    next();
  } catch (error) {
    console.error('[requireAuth Error]:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired Firebase ID token',
    });
  }
};

/**
 * Middleware: Enforce Admin Role (Strict 403 Forbidden response)
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required',
    });
  }
  next();
};

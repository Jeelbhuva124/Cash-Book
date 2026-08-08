import { getAuth } from 'firebase-admin/auth';
import { getApps } from 'firebase-admin/app';
import User from '../models/user.js';

export const authController = {
  /**
   * Sync/Signup Endpoint: /api/auth/sync-user or /api/auth/save
   * Verifies Firebase token, creates user if missing, and forcefully sets role to 'user'.
   * COMPLETELY IGNORES role field from request body to prevent self-elevation.
   */
  syncUser: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const idToken = authHeader?.startsWith('Bearer ')
        ? authHeader.split('Bearer ')[1]
        : req.body.id_token || req.body.idToken;

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: 'Firebase ID Token is required',
        });
      }

      if (getApps().length === 0) {
        return res.status(500).json({
          success: false,
          message: 'Server Error: Firebase Admin SDK is not initialized',
        });
      }

      // Verify token via Firebase Admin SDK
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const { uid, email, name } = decodedToken;

      const userEmail = (email || req.body.email || '').toLowerCase();
      const userName = name || req.body.name || userEmail.split('@')[0] || '';

      // Check if user exists in MongoDB
      let user = await User.findOne({ firebase_uid: uid });

      if (!user) {
        // SECURITY RULE: Extract ONLY email, name, and firebase_uid.
        // Completely IGNORE any 'role' field passed in req.body.
        // Forcefully set role to 'user' for new accounts.
        user = new User({
          firebase_uid: uid,
          email: userEmail,
          name: userName,
          role: 'user', // FORCEFULLY SET TO USER (NO SELF-ELEVATION)
        });

        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: 'User synchronized successfully',
        data: [user],
      });
    } catch (error) {
      console.error('[syncUser Error]:', error.message);
      return res.status(400).json({
        success: false,
        message: `Authentication sync failed: ${error.message}`,
      });
    }
  },

  /**
   * Select Endpoint: Returns authenticated user's details
   */
  getUserProfile: async (req, res) => {
    return res.status(200).json({
      success: true,
      data: [req.user],
    });
  },
};

export default authController;

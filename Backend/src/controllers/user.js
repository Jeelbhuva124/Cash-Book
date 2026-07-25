import User from '../models/user.js';
import { getAuth } from 'firebase-admin/auth';
import { getApps } from 'firebase-admin/app';
import https from 'https';
import mongoose from 'mongoose';
import emailService from '../Service/emailService.js';

// In-memory store for OTPs to prevent database clutter and ensure high speed
const otpStore = new Map();

// Helper function to call Firebase Auth REST API for sign-in
const firebaseSignIn = (email, password, apiKey) => {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            email,
            password,
            returnSecureToken: true
        });

        const options = {
            hostname: 'identitytoolkit.googleapis.com',
            port: 443,
            path: `/v1/accounts:signInWithPassword?key=${apiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(parsed);
                    } else {
                        reject(new Error(parsed.error?.message || 'Authentication failed'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => { reject(e); });
        req.write(postData);
        req.end();
    });
};

const decodeFirebaseToken = (idToken) => {
    try {
        const parts = idToken.split('.');
        if (parts.length !== 3) throw new Error('Invalid token format');
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
        return JSON.parse(payloadJson);
    } catch (err) {
        throw new Error('Failed to decode token: ' + err.message);
    }
};

const userController = {
    saveEntry: async (req, res) => {
        const { id, username, email_id, password, user_role, is_admin } = req.body;

        try {
            const isAdminRole = is_admin || user_role === 'admin' || (email_id && email_id.toLowerCase().includes('admin'));
            const role = isAdminRole ? 'admin' : (user_role || 'user');

            if (id && mongoose.Types.ObjectId.isValid(id)) {
                const updatedUser = await User.findByIdAndUpdate(
                    id,
                    { username, email_id, password, user_role: role, is_admin: isAdminRole },
                    { new: true, runValidators: true }
                );

                if (!updatedUser) {
                    return res.status(404).json({ success: false, message: "User not found for update" });
                }

                return res.status(200).json({ success: true, message: "User updated successfully", data: [updatedUser] });
            } else {
                if (email_id && password) {
                    if (getApps().length > 0) {
                        try {
                            const auth = getAuth();
                            await auth.createUser({
                                email: email_id,
                                password: password,
                                displayName: username || undefined
                            });
                            console.log(`[Firebase] User created successfully: ${email_id}`);
                        } catch (fbErr) {
                            if (fbErr.code === 'auth/email-already-exists') {
                                console.log(`[Firebase] User already exists in Firebase: ${email_id}`);
                            } else {
                                console.error("[Firebase] Signup Error:", fbErr.message);
                                return res.status(400).json({ success: false, message: `Firebase Auth Error: ${fbErr.message}` });
                            }
                        }
                    } else {
                        console.warn(`[Warning] Firebase Admin SDK not initialized. Proceeding with local signup.`);
                    }
                }

                const existingUser = await User.findOne({ email_id: email_id?.toLowerCase() });
                if (existingUser) {
                    return res.status(400).json({ success: false, message: "User already exists with this email" });
                }

                const newUser = new User({ 
                    username, 
                    email_id, 
                    password,
                    user_role: role,
                    is_admin: isAdminRole 
                });
                await newUser.save();

                return res.status(200).json({ success: true, message: "User saved successfully", data: [newUser] });
            }
        } catch (err) {
            console.error("Save User Error:", err.message);
            return res.status(500).json({ success: false, message: err.message });
        }
    },

    getAllEntries: async (req, res) => {
        try {
            const users = await User.find({});
            return res.status(200).json({ success: true, data: users });
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    },

    deleteEntry: async (req, res) => {
        const { id } = req.body;
        if (!id) return res.status(400).json({ success: false, message: "User ID is required" });
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid User ID format" });

        try {
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) return res.status(404).json({ success: false, message: "User not found" });
            return res.status(200).json({ success: true, message: "User deleted successfully", data: [deletedUser] });
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    },

    loginEntry: async (req, res) => {
        const { email_id } = req.body;
        if (!email_id) return res.status(400).json({ success: false, message: "Email is required" });

        try {
            let dbUser = await User.findOne({ email_id: email_id.toLowerCase() });
            if (!dbUser) return res.status(404).json({ success: false, message: "User not found. Please register first." });

            // Generate OTP
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
            otpStore.set(email_id.toLowerCase(), { otp, expires: otpExpires });

            // Send OTP email
            await emailService.sendOtpEmail(dbUser.email_id, otp);

            return res.status(200).json({
                success: true,
                otpRequired: true,
                email_id: dbUser.email_id,
                user_role: dbUser.user_role || 'user',
                is_admin: dbUser.is_admin || false,
                message: "A 4-digit verification code has been sent to your email."
            });
        } catch (err) {
            console.error("Login User Error:", err.message);
            return res.status(500).json({ success: false, message: err.message || "Internal server error" });
        }
    },

    verifyOtp: async (req, res) => {
        const { email_id, otp } = req.body;
        if (!email_id || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

        try {
            const dbUser = await User.findOne({ email_id: email_id.toLowerCase() });
            if (!dbUser) return res.status(404).json({ success: false, message: "User not found. Please register first." });

            // OTP verification
            const storedOtpInfo = otpStore.get(email_id.toLowerCase());
            if (!storedOtpInfo || storedOtpInfo.otp !== otp) {
                return res.status(400).json({ success: false, message: "Invalid verification code" });
            }

            if (new Date() > storedOtpInfo.expires) {
                otpStore.delete(email_id.toLowerCase());
                return res.status(400).json({ success: false, message: "Verification code has expired" });
            }

            // Clear OTP once verified
            otpStore.delete(email_id.toLowerCase());

            // Generate Custom Firebase Auth Token
            let firebaseToken = null;
            if (getApps().length > 0) {
                try {
                    const auth = getAuth();
                    firebaseToken = await auth.createCustomToken(dbUser.id);
                } catch (fbErr) {
                    console.error("[Firebase] Custom Token Generation Error:", fbErr.message);
                }
            }

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: dbUser.id,
                    username: dbUser.username,
                    email_id: dbUser.email_id,
                    user_role: dbUser.user_role || 'user',
                    is_admin: dbUser.is_admin || false,
                    firebaseToken: firebaseToken
                }
            });
        } catch (err) {
            console.error("Verify OTP Error:", err.message);
            return res.status(500).json({ success: false, message: err.message || "Internal server error" });
        }
    },

    // ─── ADMIN AUTHENTICATION ENDPOINTS ───
    adminLogin: async (req, res) => {
        const { email_id, password, admin_key } = req.body;
        if (!email_id || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required for admin authentication" });
        }

        try {
            let dbUser = await User.findOne({ email_id: email_id.toLowerCase() });

            // Auto-provision admin user if logging in as admin root
            if (!dbUser && (email_id.toLowerCase().includes('admin') || admin_key === 'admin123')) {
                dbUser = new User({
                    username: 'Admin Root',
                    email_id: email_id.toLowerCase(),
                    password: password,
                    user_role: 'admin',
                    is_admin: true
                });
                await dbUser.save();
            }

            if (!dbUser) {
                return res.status(404).json({ success: false, message: "Admin user account not found" });
            }

            if (dbUser.password !== password) {
                return res.status(401).json({ success: false, message: "Invalid admin password" });
            }

            // Grant admin rights if email contains admin or secret key matches
            if (!dbUser.is_admin && (email_id.toLowerCase().includes('admin') || admin_key === 'admin123')) {
                dbUser.user_role = 'admin';
                dbUser.is_admin = true;
                await dbUser.save();
            }

            if (!dbUser.is_admin && dbUser.user_role !== 'admin') {
                return res.status(403).json({ success: false, message: "Access denied. User does not have administrative privileges." });
            }

            return res.status(200).json({
                success: true,
                message: "Admin authentication successful",
                user: {
                    id: dbUser.id,
                    username: dbUser.username,
                    email_id: dbUser.email_id,
                    user_role: dbUser.user_role,
                    is_admin: dbUser.is_admin
                }
            });
        } catch (err) {
            console.error("Admin Login Error:", err.message);
            return res.status(500).json({ success: false, message: err.message || "Internal server error" });
        }
    },

    verifyAdmin: async (req, res) => {
        const { email_id, user_id } = req.body;
        try {
            let query = {};
            if (user_id && mongoose.Types.ObjectId.isValid(user_id)) {
                query._id = user_id;
            } else if (email_id) {
                query.email_id = email_id.toLowerCase();
            } else {
                return res.status(400).json({ success: false, message: "User ID or Email is required for verification" });
            }

            const dbUser = await User.findOne(query);
            if (!dbUser) return res.status(404).json({ success: false, is_admin: false, message: "User not found" });

            const isAdmin = dbUser.is_admin === true || dbUser.user_role === 'admin';
            return res.status(200).json({
                success: true,
                is_admin: isAdmin,
                user_role: dbUser.user_role || (isAdmin ? 'admin' : 'user'),
                user: {
                    id: dbUser.id,
                    username: dbUser.username,
                    email_id: dbUser.email_id,
                    user_role: dbUser.user_role,
                    is_admin: dbUser.is_admin
                }
            });
        } catch (err) {
            return res.status(500).json({ success: false, is_admin: false, message: err.message });
        }
    },

    googleAuthEntry: async (req, res) => {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ success: false, message: "Firebase ID Token is required" });

        try {
            let email, name, uid;

            if (getApps().length > 0) {
                const auth = getAuth();
                const decodedToken = await auth.verifyIdToken(idToken);
                email = decodedToken.email;
                name = decodedToken.name;
                uid = decodedToken.uid;
            } else {
                const payload = decodeFirebaseToken(idToken);
                email = payload.email;
                name = payload.name;
                uid = payload.user_id || payload.sub;
            }

            if (!email) return res.status(400).json({ success: false, message: "No email found in Google account" });

            let dbUser = await User.findOne({ email_id: email.toLowerCase() });

            if (!dbUser) {
                const isAdmin = email.toLowerCase().includes('admin');
                dbUser = new User({
                    username: name || email.split('@')[0],
                    email_id: email,
                    password: `google_${uid}`,
                    user_role: isAdmin ? 'admin' : 'user',
                    is_admin: isAdmin
                });
                await dbUser.save();
            }

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: dbUser.id,
                    username: dbUser.username,
                    email_id: dbUser.email_id,
                    user_role: dbUser.user_role || 'user',
                    is_admin: dbUser.is_admin || false,
                    firebaseToken: idToken
                }
            });
        } catch (err) {
            console.error("Google Auth Error:", err.message);
            return res.status(401).json({ success: false, message: err.message || "Google authentication failed" });
        }
    }
};

export default userController;

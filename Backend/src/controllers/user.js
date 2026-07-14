import User from '../models/user.js';
import { getAuth } from 'firebase-admin/auth';
import { getApps } from 'firebase-admin/app';
import https from 'https';
import mongoose from 'mongoose';

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
        const { id, username, email_id, password } = req.body;

        try {
            if (id && mongoose.Types.ObjectId.isValid(id)) {
                const updatedUser = await User.findByIdAndUpdate(
                    id,
                    { username, email_id, password },
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

                const newUser = new User({ username, email_id, password });
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
        const { email_id, password } = req.body;
        if (!email_id || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

        try {
            const apiKey = process.env.FIREBASE_API_KEY;
            let firebaseAuthFailed = false;
            let firebaseUser = null;

            if (apiKey) {
                try {
                    firebaseUser = await firebaseSignIn(email_id, password, apiKey);
                    console.log(`[Firebase] User authenticated: ${email_id}`);
                } catch (fbErr) {
                    console.error("[Firebase] Login Error:", fbErr.message);
                    if (fbErr.message === 'PASSWORD_LOGIN_DISABLED' || fbErr.message?.includes('DISABLED')) {
                        firebaseAuthFailed = true;
                    } else {
                        return res.status(401).json({ success: false, message: fbErr.message || "Invalid credentials" });
                    }
                }
            }

            const dbUser = await User.findOne({ email_id: email_id.toLowerCase() });
            if (!dbUser) return res.status(404).json({ success: false, message: "User not found in local database" });

            if (!apiKey || firebaseAuthFailed) {
                if (dbUser.password !== password) {
                    return res.status(401).json({ success: false, message: "Invalid password" });
                }
            }

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: dbUser.id,
                    username: dbUser.username,
                    email_id: dbUser.email_id,
                    firebaseToken: firebaseUser?.idToken || null
                }
            });
        } catch (err) {
            console.error("Login User Error:", err.message);
            return res.status(500).json({ success: false, message: err.message || "Internal server error" });
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
                dbUser = new User({
                    username: name || email.split('@')[0],
                    email_id: email,
                    password: `google_${uid}`
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

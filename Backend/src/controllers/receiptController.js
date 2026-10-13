import Receipt from '../models/receipt.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');

// @desc    Upload a new receipt
// @route   POST /api/receipts
// @access  Private
export const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    let { item_title, purchase_date, warranty_expiry_date, user_email, user_id } = req.body;
    
    user_email = (user_email || 'guest').toLowerCase().trim();
    const userId = user_id ? String(user_id).trim() : '';

    if (!item_title || !purchase_date) {
      return res.status(400).json({ success: false, message: 'Item title and purchase date are required.' });
    }

    // Convert local path to a relative URL
    // Multer saves as: uploads\filename.jpg
    const imageUrl = `/uploads/${req.file.filename}`;

    const newReceipt = new Receipt({
      user_email,
      user_id: userId,
      item_title: item_title.trim(),
      purchase_date,
      warranty_expiry_date: warranty_expiry_date || null,
      image_url: imageUrl
    });

    await newReceipt.save();

    res.status(201).json({ success: true, data: newReceipt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all receipts for logged in user
// @route   GET /api/receipts
// @access  Private
export const getReceipts = async (req, res) => {
  try {
    const { user_email, user_id, email, email_id } = {
      ...(req.query || {}),
      ...(req.body || {}),
    };
    const targetUserId = user_id ? String(user_id).trim() : '';
    const rawEmail = user_email || email_id || email || '';
    const targetEmail = rawEmail ? String(rawEmail).toLowerCase().trim() : '';
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let query = {};
    if (targetUserId) {
      if (targetEmail) {
        await Receipt.updateMany(
          {
            user_email: new RegExp(`^${escapeRegex(targetEmail)}$`, 'i'),
            $or: [{ user_id: '' }, { user_id: { $exists: false } }, { user_id: null }]
          },
          { $set: { user_id: targetUserId } }
        );
      }
      query.user_id = targetUserId;
    } else if (targetEmail) {
      query.user_email = new RegExp(`^${escapeRegex(targetEmail)}$`, 'i');
    }

    const receipts = await Receipt.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: receipts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a receipt
// @route   DELETE /api/receipts/:id
// @access  Private
export const deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    let { user_email, user_id } = req.body;
    user_email = (user_email || 'guest').toLowerCase().trim();
    const userId = user_id ? String(user_id).trim() : '';

    const isMatch = (userId && receipt.user_id && receipt.user_id === userId) ||
                    (receipt.user_email?.toLowerCase() === user_email);

    if (!isMatch) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this receipt' });
    }

    // Extract filename from image_url (e.g. /uploads/image-123.jpg -> image-123.jpg)
    const filename = receipt.image_url ? receipt.image_url.split('/').pop() : null;
    if (filename) {
      const filePath = path.join(uploadDir, filename);

      // Delete the file from local filesystem
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error deleting file:', err);
        }
      });
    }

    await receipt.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update a receipt
// @route   PUT /api/receipts/:id
// @access  Private
export const updateReceipt = async (req, res) => {
  try {
    let { item_title, purchase_date, warranty_expiry_date, user_email, user_id } = req.body;
    user_email = (user_email || 'guest').toLowerCase().trim();
    const userId = user_id ? String(user_id).trim() : '';

    let receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    const isMatch = (userId && receipt.user_id && receipt.user_id === userId) ||
                    (receipt.user_email?.toLowerCase() === user_email);

    if (!isMatch) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this receipt' });
    }

    receipt.item_title = item_title ? item_title.trim() : receipt.item_title;
    receipt.purchase_date = purchase_date || receipt.purchase_date;
    receipt.warranty_expiry_date = warranty_expiry_date !== undefined ? warranty_expiry_date : receipt.warranty_expiry_date;
    if (userId) {
      receipt.user_id = userId;
    }

    await receipt.save();

    res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

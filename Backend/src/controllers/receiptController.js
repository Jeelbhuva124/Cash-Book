import Receipt from '../models/receipt.js';
import fs from 'fs';
import path from 'path';

// @desc    Upload a new receipt
// @route   POST /api/receipts
// @access  Private
export const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    let { item_title, purchase_date, warranty_expiry_date, user_email } = req.body;
    
    if (!user_email) user_email = 'guest';

    if (!item_title || !purchase_date) {
      return res.status(400).json({ success: false, message: 'Item title and purchase date are required.' });
    }

    // Convert local path to a relative URL
    // Multer saves as: uploads\filename.jpg
    const imageUrl = `/uploads/${req.file.filename}`;

    const newReceipt = new Receipt({
      user_email,
      item_title,
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
    let { user_email } = req.query;
    if (!user_email) user_email = 'guest';

    const receipts = await Receipt.find({ user_email }).sort({ createdAt: -1 });
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

    let { user_email } = req.body;
    if (!user_email) user_email = 'guest';

    if (receipt.user_email !== user_email) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this receipt' });
    }

    // Extract filename from image_url (e.g. /uploads/image-123.jpg -> image-123.jpg)
    const filename = receipt.image_url.split('/').pop();
    const filePath = path.resolve('uploads', filename);

    // Delete the file from local filesystem
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error deleting file:', err);
      }
    });

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
    let { item_title, purchase_date, warranty_expiry_date, user_email } = req.body;
    if (!user_email) user_email = 'guest';

    let receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    if (receipt.user_email !== user_email) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this receipt' });
    }

    receipt.item_title = item_title || receipt.item_title;
    receipt.purchase_date = purchase_date || receipt.purchase_date;
    receipt.warranty_expiry_date = warranty_expiry_date !== undefined ? warranty_expiry_date : receipt.warranty_expiry_date;

    await receipt.save();

    res.status(200).json({ success: true, data: receipt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

import mongoose from 'mongoose';
import Cashbook from '../models/cashbook.js';

// Create a new Cashbook
export const createCashbook = async (req, res) => {
  try {
    const { cashbook_name, description, hex_code, user_email, user_id } = req.body;

    if (!cashbook_name) {
      return res.status(400).json({
        success: false,
        message: 'cashbook_name is required',
        received: req.body,
      });
    }

    const newCashbook = new Cashbook({
      cashbook_name: cashbook_name.trim(),
      description: description ? description.trim() : '',
      hex_code: hex_code ? hex_code.trim() : '#8B5CF6',
      user_email: user_email ? user_email.toLowerCase().trim() : '',
      user_id: user_id ? user_id.trim() : '',
    });

    await newCashbook.save();

    return res.status(201).json({
      success: true,
      message: 'Cashbook created successfully',
      data: newCashbook,
    });
  } catch (error) {
    console.error('Create Cashbook Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create cashbook',
      error: error.message,
    });
  }
};

// Get Cashbooks (Filter by user_email or user_id if provided)
export const getCashbooks = async (req, res) => {
  try {
    const { user_email, user_id } = req.query;
    let query = {};

    if (user_email) {
      query.user_email = user_email.toLowerCase();
    }
    if (user_id) {
      query.user_id = user_id;
    }

    const cashbooks = await Cashbook.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: cashbooks,
    });
  } catch (error) {
    console.error('Get Cashbooks Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch cashbooks',
      error: error.message,
    });
  }
};

// Update Cashbook (via req.body ID)
export const updateCashbook = async (req, res) => {
  try {
    const { id, cashbook_name, description, hex_code } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Cashbook ID is required in body',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Cashbook ID format',
      });
    }

    let updateFields = {};

    if (cashbook_name !== undefined) {
      updateFields.cashbook_name = cashbook_name.trim();
    }
    if (description !== undefined) {
      updateFields.description = description.trim();
    }
    if (hex_code !== undefined) {
      updateFields.hex_code = hex_code.trim();
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update fields provided',
      });
    }

    const updatedCashbook = await Cashbook.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedCashbook) {
      return res.status(404).json({
        success: false,
        message: 'Cashbook not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cashbook updated successfully',
      data: updatedCashbook,
    });
  } catch (error) {
    console.error('Update Cashbook Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update cashbook',
      error: error.message,
    });
  }
};

// Delete Cashbook (via req.body ID)
export const deleteCashbook = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Cashbook ID is required in body',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Cashbook ID format',
      });
    }

    const deletedCashbook = await Cashbook.findByIdAndDelete(id);

    if (!deletedCashbook) {
      return res.status(404).json({
        success: false,
        message: 'Cashbook not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cashbook deleted successfully',
      data: deletedCashbook,
    });
  } catch (error) {
    console.error('Delete Cashbook Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete cashbook',
      error: error.message,
    });
  }
};

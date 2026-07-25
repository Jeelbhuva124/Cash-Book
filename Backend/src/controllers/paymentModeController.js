import mongoose from 'mongoose';
import PaymentMode from '../models/paymentMode.js';

// Create a new Payment Mode
export const createPaymentMode = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const docs = req.body.map(pm => {
        if (!pm.payment_mode || !pm.chalan_id) {
          throw new Error('payment_mode and chalan_id are required');
        }
        return {
          payment_mode: pm.payment_mode.trim(),
          chalan_id: pm.chalan_id.trim(),
          active: pm.active !== undefined ? pm.active : true,
          created_by: pm.created_by ? pm.created_by.trim() : 'Guest',
          updated_by: pm.updated_by ? pm.updated_by.trim() : 'Guest',
          user_email: pm.user_email ? pm.user_email.toLowerCase().trim() : '',
        };
      });

      const inserted = await PaymentMode.insertMany(docs);
      return res.status(201).json({
        success: true,
        message: `${inserted.length} payment modes created successfully`,
        data: inserted,
      });
    }

    const { payment_mode, chalan_id, active, created_by, updated_by, user_email } = req.body;

    if (!payment_mode || !chalan_id) {
      return res.status(400).json({
        success: false,
        message: 'payment_mode and chalan_id are required in body',
        received: req.body,
      });
    }

    const newPaymentMode = new PaymentMode({
      payment_mode: payment_mode.trim(),
      chalan_id: chalan_id.trim(),
      active: active !== undefined ? active : true,
      created_by: created_by ? created_by.trim() : 'Guest',
      updated_by: updated_by ? updated_by.trim() : 'Guest',
      user_email: user_email ? user_email.toLowerCase().trim() : '',
    });

    await newPaymentMode.save();

    return res.status(201).json({
      success: true,
      message: 'Payment mode created successfully',
      data: newPaymentMode,
    });
  } catch (error) {
    console.error('Create Payment Mode Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment mode',
      error: error.message,
    });
  }
};

// Get All Payment Modes
export const getPaymentModes = async (req, res) => {
  try {
    const paymentModes = await PaymentMode.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: paymentModes,
    });
  } catch (error) {
    console.error('Get Payment Modes Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment modes',
      error: error.message,
    });
  }
};

// Update existing Payment Mode
export const updatePaymentMode = async (req, res) => {
  try {
    const { id, payment_mode, active, updated_by } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Payment Mode ID is required in body',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Payment Mode ID format',
      });
    }

    let updateFields = {};
    if (payment_mode !== undefined) updateFields.payment_mode = payment_mode.trim();
    if (active !== undefined) updateFields.active = active;
    if (updated_by !== undefined) updateFields.updated_by = updated_by.trim();

    const updatedPaymentMode = await PaymentMode.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedPaymentMode) {
      return res.status(404).json({
        success: false,
        message: 'Payment Mode not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment mode updated successfully',
      data: updatedPaymentMode,
    });
  } catch (error) {
    console.error('Update Payment Mode Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update payment mode',
      error: error.message,
    });
  }
};

// Delete Payment Mode (Supports single or bulk deletes)
export const deletePaymentMode = async (req, res) => {
  try {
    const { id, ids } = req.body;

    if (ids && Array.isArray(ids)) {
      const validIds = ids.filter(i => mongoose.Types.ObjectId.isValid(i));
      if (validIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid Payment Mode IDs provided for bulk delete',
        });
      }
      await PaymentMode.deleteMany({ _id: { $in: validIds } });
      return res.status(200).json({
        success: true,
        message: `${validIds.length} payment modes deleted successfully`,
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Payment Mode ID or IDs array is required in body',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Payment Mode ID format',
      });
    }

    const deletedPaymentMode = await PaymentMode.findByIdAndDelete(id);

    if (!deletedPaymentMode) {
      return res.status(404).json({
        success: false,
        message: 'Payment Mode not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment mode deleted successfully',
      data: deletedPaymentMode,
    });
  } catch (error) {
    console.error('Delete Payment Mode Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete payment mode(s)',
      error: error.message,
    });
  }
};

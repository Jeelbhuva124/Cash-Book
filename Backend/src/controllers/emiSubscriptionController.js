import mongoose from 'mongoose';
import EmiSubscription from '../models/emiSubscription.js';
import Transaction from '../models/transaction.js';

// Get all EMI and Subscriptions
export const getEmiSubscriptions = async (req, res) => {
  try {
    const records = await EmiSubscription.find().sort({ due_date: 1 });
    return res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error('Get EmiSubscription Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch EMI & Subscriptions',
      error: error.message,
    });
  }
};

// Create new EMI/Subscription (Supports array for bulk seed)
export const createEmiSubscription = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const inserted = await EmiSubscription.insertMany(req.body);
      return res.status(201).json({
        success: true,
        message: `${inserted.length} records created successfully`,
        data: inserted,
      });
    }

    const newRecord = new EmiSubscription(req.body);
    await newRecord.save();

    return res.status(201).json({
      success: true,
      message: 'Record created successfully',
      data: newRecord,
    });
  } catch (error) {
    console.error('Create EmiSubscription Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create record(s)',
      error: error.message,
    });
  }
};

// Mark as Paid
export const markAsPaid = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'EMI/Subscription ID is required',
      });
    }

    const record = await EmiSubscription.findById(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // 1. Create an expense transaction in the main Transaction collection
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    const newTransaction = new Transaction({
      title: `${record.type} Paid: ${record.title}`,
      type: 'expense',
      amount: record.amount,
      date: currentDate,
      time: currentTime,
      chalan_id: record.chalan_id || '1',
      category: record.type,
      subcategory: record.title,
      payment_mode: 'Auto-Debit', // Default assumed payment mode
      remark: `Automatically generated via ${record.type} Tracker`,
      created_by: record.created_by,
      user_email: record.user_email,
    });

    await newTransaction.save();

    // 2. Emit transaction_created event
    const io = req.app.get('io');
    if (io) {
      io.emit('transaction_created', newTransaction);
    }

    // 3. Update the due date (Add 1 month)
    const currentDue = new Date(record.due_date);
    currentDue.setMonth(currentDue.getMonth() + 1);
    
    // Format back to YYYY-MM-DD
    const newDueDate = currentDue.toISOString().split('T')[0];

    record.last_paid_date = currentDate;

    // Check if we passed the end_date
    if (record.end_date && new Date(newDueDate) > new Date(record.end_date)) {
      record.status = 'Completed';
    } else {
      record.due_date = newDueDate;
    }

    await record.save();

    return res.status(200).json({
      success: true,
      message: 'Marked as paid successfully. Transaction created.',
      data: record,
    });
  } catch (error) {
    console.error('Mark as Paid Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark as paid',
      error: error.message,
    });
  }
};

// Delete EMI/Subscription
export const deleteEmiSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await EmiSubscription.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
      data: deleted,
    });
  } catch (error) {
    console.error('Delete EmiSubscription Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete record',
      error: error.message,
    });
  }
};

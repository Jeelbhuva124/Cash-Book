import mongoose from 'mongoose';
import Transaction from '../models/transaction.js';

// Create a new Transaction (Supports single object or array of objects for bulk insert)
export const createTransaction = async (req, res) => {
  try {
    // Handle Array Bulk Insert
    if (Array.isArray(req.body)) {
      const docs = req.body.map(tx => {
        if (!tx.title || !tx.type || tx.amount === undefined || !tx.date || !tx.time || !tx.chalan_id) {
          throw new Error('Missing required fields in one of the transactions');
        }
        return {
          title: tx.title.trim(),
          type: tx.type.toLowerCase().trim(),
          amount: Number(tx.amount),
          date: tx.date.trim(),
          time: tx.time.trim(),
          chalan_id: tx.chalan_id.trim(),
          category: tx.category ? tx.category.trim() : '',
          subcategory: tx.subcategory ? tx.subcategory.trim() : '',
          payment_mode: tx.payment_mode ? tx.payment_mode.trim() : 'Cash',
          remark: tx.remark ? tx.remark.trim() : 'Null',
          created_by: tx.created_by ? tx.created_by.trim() : 'Guest',
          user_email: tx.user_email ? tx.user_email.toLowerCase().trim() : '',
        };
      });

      const inserted = await Transaction.insertMany(docs);

      return res.status(201).json({
        success: true,
        message: `${inserted.length} transactions created successfully`,
        data: inserted,
      });
    }

    // Handle Single Insert
    const { 
      title, type, amount, date, time, chalan_id, 
      category, subcategory, payment_mode, remark, created_by, user_email 
    } = req.body;

    if (!title || !type || amount === undefined || !date || !time || !chalan_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required transaction fields: title, type, amount, date, time, chalan_id',
        received: req.body,
      });
    }

    const newTransaction = new Transaction({
      title: title.trim(),
      type: type.toLowerCase().trim(),
      amount: Number(amount),
      date: date.trim(),
      time: time.trim(),
      chalan_id: chalan_id.trim(),
      category: category ? category.trim() : '',
      subcategory: subcategory ? subcategory.trim() : '',
      payment_mode: payment_mode ? payment_mode.trim() : 'Cash',
      remark: remark ? remark.trim() : 'Null',
      created_by: created_by ? created_by.trim() : 'Guest',
      user_email: user_email ? user_email.toLowerCase().trim() : '',
    });

    await newTransaction.save();

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: newTransaction,
    });
  } catch (error) {
    console.error('Create Transaction Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create transaction(s)',
      error: error.message,
    });
  }
};

// Get All Transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Get Transactions Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message,
    });
  }
};

// Update existing Transaction
export const updateTransaction = async (req, res) => {
  try {
    const { 
      id, title, type, amount, date, time, chalan_id, 
      category, subcategory, payment_mode, remark, created_by 
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required in body',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Transaction ID format',
      });
    }

    let updateFields = {};

    if (title !== undefined) updateFields.title = title.trim();
    if (type !== undefined) updateFields.type = type.toLowerCase().trim();
    if (amount !== undefined) updateFields.amount = Number(amount);
    if (date !== undefined) updateFields.date = date.trim();
    if (time !== undefined) updateFields.time = time.trim();
    if (chalan_id !== undefined) updateFields.chalan_id = chalan_id.trim();
    if (category !== undefined) updateFields.category = category.trim();
    if (subcategory !== undefined) updateFields.subcategory = subcategory.trim();
    if (payment_mode !== undefined) updateFields.payment_mode = payment_mode.trim();
    if (remark !== undefined) updateFields.remark = remark.trim();
    if (created_by !== undefined) updateFields.created_by = created_by.trim();

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    console.error('Update Transaction Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
      error: error.message,
    });
  }
};

// Delete Transaction (supports single 'id' and bulk 'ids' array in req.body)
export const deleteTransaction = async (req, res) => {
  try {
    const { id, ids } = req.body;

    // Handle Bulk Delete
    if (ids && Array.isArray(ids)) {
      const validIds = ids.filter(i => mongoose.Types.ObjectId.isValid(i));
      
      if (validIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid Transaction IDs provided for bulk delete',
        });
      }

      await Transaction.deleteMany({ _id: { $in: validIds } });

      return res.status(200).json({
        success: true,
        message: `${validIds.length} transactions deleted successfully`,
      });
    }

    // Handle Single Delete
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID or IDs array is required in body',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Transaction ID format',
      });
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: deletedTransaction,
    });
  } catch (error) {
    console.error('Delete Transaction Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete transaction(s)',
      error: error.message,
    });
  }
};

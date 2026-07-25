import mongoose from 'mongoose';
import Subcategory from '../models/subcategory.js';

// Create a new Subcategory
export const createSubcategory = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const docs = req.body.map(sub => {
        if (!sub.subcategory_name || !sub.category_id || !sub.category_name || !sub.chalan_id) {
          throw new Error('subcategory_name, category_id, category_name, and chalan_id are required');
        }
        return {
          subcategory_name: sub.subcategory_name.trim(),
          category_id: sub.category_id.trim(),
          category_name: sub.category_name.trim(),
          chalan_id: sub.chalan_id.trim(),
          active: sub.active !== undefined ? sub.active : true,
          created_by: sub.created_by ? sub.created_by.trim() : 'Guest',
          updated_by: sub.updated_by ? sub.updated_by.trim() : 'Guest',
          user_email: sub.user_email ? sub.user_email.toLowerCase().trim() : '',
        };
      });

      const inserted = await Subcategory.insertMany(docs);
      return res.status(201).json({
        success: true,
        message: `${inserted.length} subcategories created successfully`,
        data: inserted,
      });
    }

    const { 
      subcategory_name, category_id, category_name, chalan_id, 
      active, created_by, updated_by, user_email 
    } = req.body;

    if (!subcategory_name || !category_id || !category_name || !chalan_id) {
      return res.status(400).json({
        success: false,
        message: 'subcategory_name, category_id, category_name, and chalan_id are required in body',
        received: req.body,
      });
    }

    const newSubcategory = new Subcategory({
      subcategory_name: subcategory_name.trim(),
      category_id: category_id.trim(),
      category_name: category_name.trim(),
      chalan_id: chalan_id.trim(),
      active: active !== undefined ? active : true,
      created_by: created_by ? created_by.trim() : 'Guest',
      updated_by: updated_by ? updated_by.trim() : 'Guest',
      user_email: user_email ? user_email.toLowerCase().trim() : '',
    });

    await newSubcategory.save();

    return res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      data: newSubcategory,
    });
  } catch (error) {
    console.error('Create Subcategory Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create subcategory',
      error: error.message,
    });
  }
};

// Get All Subcategories
export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    console.error('Get Subcategories Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message,
    });
  }
};

// Update existing Subcategory
export const updateSubcategory = async (req, res) => {
  try {
    const { id, subcategory_name, category_id, category_name, active, updated_by } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory ID is required in body',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Subcategory ID format',
      });
    }

    let updateFields = {};
    if (subcategory_name !== undefined) updateFields.subcategory_name = subcategory_name.trim();
    if (category_id !== undefined) updateFields.category_id = category_id.trim();
    if (category_name !== undefined) updateFields.category_name = category_name.trim();
    if (active !== undefined) updateFields.active = active;
    if (updated_by !== undefined) updateFields.updated_by = updated_by.trim();

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedSubcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Subcategory updated successfully',
      data: updatedSubcategory,
    });
  } catch (error) {
    console.error('Update Subcategory Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update subcategory',
      error: error.message,
    });
  }
};

// Delete Subcategory (Supports single or bulk deletes)
export const deleteSubcategory = async (req, res) => {
  try {
    const { id, ids } = req.body;

    if (ids && Array.isArray(ids)) {
      const validIds = ids.filter(i => mongoose.Types.ObjectId.isValid(i));
      if (validIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid Subcategory IDs provided for bulk delete',
        });
      }
      await Subcategory.deleteMany({ _id: { $in: validIds } });
      return res.status(200).json({
        success: true,
        message: `${validIds.length} subcategories deleted successfully`,
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory ID or IDs array is required in body',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Subcategory ID format',
      });
    }

    const deletedSubcategory = await Subcategory.findByIdAndDelete(id);

    if (!deletedSubcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Subcategory deleted successfully',
      data: deletedSubcategory,
    });
  } catch (error) {
    console.error('Delete Subcategory Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete subcategory(s)',
      error: error.message,
    });
  }
};

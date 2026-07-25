import mongoose from 'mongoose';
import Category from '../models/category.js';

// Create a new Category (Supports single or array for bulk import)
export const createCategory = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const docs = req.body.map(cat => {
        if (!cat.category_name || !cat.chalan_id) {
          throw new Error('category_name and chalan_id are required');
        }
        return {
          category_name: cat.category_name.trim(),
          chalan_id: cat.chalan_id.trim(),
          active: cat.active !== undefined ? cat.active : true,
          created_by: cat.created_by ? cat.created_by.trim() : 'Guest',
          updated_by: cat.updated_by ? cat.updated_by.trim() : 'Guest',
          user_email: cat.user_email ? cat.user_email.toLowerCase().trim() : '',
        };
      });

      const inserted = await Category.insertMany(docs);
      return res.status(201).json({
        success: true,
        message: `${inserted.length} categories created successfully`,
        data: inserted,
      });
    }

    const { category_name, chalan_id, active, created_by, updated_by, user_email } = req.body;

    if (!category_name || !chalan_id) {
      return res.status(400).json({
        success: false,
        message: 'category_name and chalan_id are required in body',
        received: req.body,
      });
    }

    const newCategory = new Category({
      category_name: category_name.trim(),
      chalan_id: chalan_id.trim(),
      active: active !== undefined ? active : true,
      created_by: created_by ? created_by.trim() : 'Guest',
      updated_by: updated_by ? updated_by.trim() : 'Guest',
      user_email: user_email ? user_email.toLowerCase().trim() : '',
    });

    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    console.error('Create Category Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message,
    });
  }
};

// Get All Categories (Sorted by creation)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get Categories Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

// Update existing Category (via body ID)
export const updateCategory = async (req, res) => {
  try {
    const { id, category_name, active, updated_by } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required in body',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Category ID format',
      });
    }

    let updateFields = {};
    if (category_name !== undefined) updateFields.category_name = category_name.trim();
    if (active !== undefined) updateFields.active = active;
    if (updated_by !== undefined) updateFields.updated_by = updated_by.trim();

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    console.error('Update Category Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message,
    });
  }
};

// Delete Category (Supports single or bulk array delete)
export const deleteCategory = async (req, res) => {
  try {
    const { id, ids } = req.body;

    if (ids && Array.isArray(ids)) {
      const validIds = ids.filter(i => mongoose.Types.ObjectId.isValid(i));
      if (validIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid Category IDs provided for bulk delete',
        });
      }
      await Category.deleteMany({ _id: { $in: validIds } });
      return res.status(200).json({
        success: true,
        message: `${validIds.length} categories deleted successfully`,
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID or IDs array is required in body',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Category ID format',
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: deletedCategory,
    });
  } catch (error) {
    console.error('Delete Category Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category(s)',
      error: error.message,
    });
  }
};

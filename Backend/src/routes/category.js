import express from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/select', getCategories);
router.post('/insert', createCategory);
router.put('/update', updateCategory);
router.delete('/delete', deleteCategory);

export default router;

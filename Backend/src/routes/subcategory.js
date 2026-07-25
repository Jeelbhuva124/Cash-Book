import express from 'express';
import {
  createSubcategory,
  getSubcategories,
  updateSubcategory,
  deleteSubcategory,
} from '../controllers/subcategoryController.js';

const router = express.Router();

router.get('/select', getSubcategories);
router.post('/insert', createSubcategory);
router.put('/update', updateSubcategory);
router.delete('/delete', deleteSubcategory);

export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadReceipt, getReceipts, deleteReceipt, updateReceipt } from '../controllers/receiptController.js';

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Routes
router.route('/')
  .post(upload.single('image'), uploadReceipt)
  .get(getReceipts);

router.route('/:id')
  .put(updateReceipt)
  .delete(deleteReceipt);

export default router;

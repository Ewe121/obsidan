import express from 'express';
import {
  uploadFile,
  uploadThumbnail,
  deleteFile,
  getSignature
} from '../controllers/uploadController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadMultiple, uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

// Upload routes
router.post('/file', uploadSingle('file'), uploadFile);
router.post('/thumbnail', uploadSingle('thumbnail'), uploadThumbnail);
router.delete('/:public_id', deleteFile);
router.get('/signature', getSignature);

export default router;
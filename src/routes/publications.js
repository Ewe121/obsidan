import express from 'express';
import {
  getPublications,
  getPublication,
  createPublication,
  updatePublication,
  deletePublication
} from '../controllers/publicationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validatePublication } from '../middleware/validation.js';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPublications)
  .post(
    protect, 
    authorize('admin'), 
    uploadMultiple(['file', 'thumbnail']), 
    validatePublication, 
    createPublication
  );

router.route('/:id')
  .get(getPublication)
  .put(
    protect, 
    authorize('admin'), 
    uploadMultiple(['file', 'thumbnail']), 
    validatePublication, 
    updatePublication
  )
  .delete(protect, authorize('admin'), deletePublication);

export default router;
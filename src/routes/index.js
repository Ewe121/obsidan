import express from 'express';
import authRoutes from './auth.js';
import adminRoutes from './admin.js';
import publicationRoutes from './publications.js';
import uploadRoutes from './upload.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/publications', publicationRoutes);
router.use('/upload', uploadRoutes);

export default router;
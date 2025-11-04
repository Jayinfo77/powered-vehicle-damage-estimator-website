import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteUserAccount
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', protect, getProfile);

router.put('/profile', protect, upload.single('profileImage'), updateProfile);

router.put('/change-password', protect, changePassword);
router.delete('/delete', protect, deleteUserAccount);

export default router;

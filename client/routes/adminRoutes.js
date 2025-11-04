// routes/adminRoutes.js

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import {
  getAllUsers,
  updateUserRole,
  getAllNotifications,
  markNotificationRead,
  createNotification,
  deleteUser,
  getAllPredictions,
  deletePrediction,

} from '../controllers/adminController.js';

const router = express.Router();

// Apply authentication and admin middleware to all admin routes
router.use(protect);
router.use(admin);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser); // ✅ Fixed route

// Notification management routes
router.get('/notifications', getAllNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.post('/notifications', createNotification);

// Predictions management routes
router.get('/predictions', getAllPredictions);
router.delete('/predictions/:id', deletePrediction);


export default router;

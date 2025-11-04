// routes/userNotifications.js
import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get notifications for logged-in user (targeted + all users)
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({
      $or: [{ userId: userId }, { userId: null }]
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

export default router;

// routes/adminNotifications.js
import express from 'express';
import Notification from '../models/Notification.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ GET all notifications (admin only)
router.get('/notifications', protect, admin, async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// ✅ POST create notification (admin only)
router.post('/notifications', protect, admin, async (req, res) => {
  const { title, message, userId } = req.body;
  try {
    const notification = new Notification({
      title,
      message,
      userId: userId || null, // null = all users
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create notification' });
  }
});

// ✅ PUT mark as read
router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    if (notification.userId &&
      notification.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

export default router;

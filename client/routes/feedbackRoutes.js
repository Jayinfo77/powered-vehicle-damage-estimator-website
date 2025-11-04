import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// POST feedback
router.post('/', async (req, res) => {
  try {
    const { name, city, review } = req.body;

    // Basic validation
    if (!name || !review) {
      return res.status(400).json({ message: 'Name and review are required.' });
    }

    const newFeedback = new Feedback({ name, city, review });
    const savedFeedback = await newFeedback.save();

    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

// GET all feedbacks (latest 10)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Failed to fetch feedbacks' });
  }
});

export default router;

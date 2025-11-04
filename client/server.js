import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import predictRoutes from './routes/predictRoutes.js';
import adminNotificationsRoutes from './routes/adminNotifications.js';
import userNotificationsRoutes from './routes/userNotifications.js';
import feedbackRoutes from './routes/feedbackRoutes.js';



import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files for profile image uploads
app.use('/uploads/profile_images', express.static(path.join(__dirname, 'uploads', 'profile_images')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// API Routes
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/predict', predictRoutes);
// Use auth middleware before these routes to protect as needed
// ✅ Corrected mounting
app.use('/api/admin', adminNotificationsRoutes);
app.use('/api/notifications/user', userNotificationsRoutes); // <== this fixes the double path
app.use('/api/feedbacks', feedbackRoutes);






// Custom error handlers (should be after all routes)
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

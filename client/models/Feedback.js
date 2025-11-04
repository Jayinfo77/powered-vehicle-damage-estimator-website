import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  city: {
    type: String,
    trim: true,
    default: '',
  },
  review: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;

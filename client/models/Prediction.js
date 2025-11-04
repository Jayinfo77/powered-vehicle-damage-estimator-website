import mongoose from 'mongoose';

const predictionSchema = mongoose.Schema(
  {
    vehicleName: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    damageType: { type: String, required: true },
    confidence: { type: Number, required: true },
    estimatedCost: { type: Number, required: true },
    imageName: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;

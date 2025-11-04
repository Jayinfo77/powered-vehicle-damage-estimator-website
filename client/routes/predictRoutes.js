// routes/predictRoutes.js
import express from 'express';
import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/', upload.array('images'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('vehicle_name', req.body.vehicle_name);
    formData.append('vehicle_model', req.body.vehicle_model);

    for (const file of req.files) {
      formData.append('images', file.buffer, file.originalname);
    }

    const response = await axios.post('http://localhost:5000/api/predict', formData, {
      headers: formData.getHeaders(),
    });

    res.json(response.data);
  } catch (error) {
    console.error('Prediction failed:', error.message);
    res.status(500).json({ message: 'Prediction failed', error: error.message });
  }
});

export default router;

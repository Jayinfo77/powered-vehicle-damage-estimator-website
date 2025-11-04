import { useState } from 'react';
import { FaCar, FaCogs, FaUpload } from 'react-icons/fa';
import axios from 'axios';

export default function Predict() {
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [images, setImages] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle image file input changes (local previews)
  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length + images.length > 6) {
      alert('You can upload a maximum of 6 images.');
      return;
    }
    setImages((prev) => [...prev, ...selected]);
  };

  // On form submit, send data + images to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleBrand || !vehicleModel || images.length === 0) {
      alert('Please complete all fields and upload images.');
      return;
    }

    const formData = new FormData();
    formData.append('vehicle_name', vehicleBrand);
    formData.append('vehicle_model', vehicleModel);
    images.forEach((img) => formData.append('images', img));

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Expect response.data.results to be array of predictions
      setResults(response.data.results);

      // Clear images after successful upload if you want
      // setImages([]);

    } catch (error) {
      alert('Error predicting damage.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Vehicle Damage Prediction</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Brand Select */}
        <div className="flex items-center border border-gray-300 rounded px-4 py-2 shadow-sm">
          <FaCar className="text-gray-500 mr-3" />
          <select
            value={vehicleBrand}
            onChange={(e) => {
              setVehicleBrand(e.target.value);
              setVehicleModel('');
            }}
            required
            className="w-full outline-none bg-transparent"
          >
            <option value="">Select Vehicle Brand</option>
            {['toyota', 'honda', 'suzuki', 'hyundai', 'mahindra'].map((brand) => (
              <option key={brand} value={brand}>
                {brand.toUpperCase()}
              </option>
            ))}
            <option value="unknown">UNKNOWN</option>
          </select>
        </div>

        {/* Vehicle Model Select */}
        <div className="flex items-center border border-gray-300 rounded px-4 py-2 shadow-sm">
          <FaCogs className="text-gray-500 mr-3" />
          <select
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            required
            disabled={!vehicleBrand}
            className="w-full outline-none bg-transparent"
          >
            <option value="">Select Vehicle Model</option>
            {vehicleBrand &&
              vehicleBrand !== 'unknown' &&
              {
                toyota: ['innova', 'corolla', 'hilux'],
                honda: ['civic', 'city', 'crv'],
                suzuki: ['swift', 'wagon_r', 'ciaz'],
                hyundai: ['tucson', 'creta', 'accent'],
                mahindra: ['scorpio', 'xuv500', 'thar'],
              }[vehicleBrand].map((model) => (
                <option key={model} value={model}>
                  {model.toUpperCase()}
                </option>
              ))}
            <option value="unknown">UNKNOWN</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="flex items-center space-x-4">
          <label
            htmlFor="image-upload"
            className="flex items-center cursor-pointer px-4 py-2 border rounded-md bg-white hover:bg-blue-50"
          >
            <FaUpload className="mr-2 text-blue-500" /> Upload Images
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
          <p className="text-sm text-gray-500">(Max 6 images)</p>
        </div>

        {/* Local Previews of selected images */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="border rounded-md p-2 bg-white shadow-sm">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`preview-${idx}`}
                  className="w-full h-32 object-cover rounded"
                />
                <p className="text-xs text-center mt-1 text-gray-600">{img.name}</p>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 shadow-md"
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {/* Prediction Results from backend */}
      {results.length > 0 && (
        <div className="mt-10 space-y-6">
          <h3 className="text-xl font-bold text-center text-gray-800 mb-6">Prediction Results</h3>
          {results.map((res, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Backend annotated image from URL */}
              {res.annotated_image_url ? (
                <img
                  src={res.annotated_image_url}
                  alt={`annotated-${idx}`}
                  className="w-40 h-40 object-contain rounded border"
                  loading="lazy"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center border rounded text-gray-400 text-sm">
                  No Image
                </div>
              )}

              {/* Prediction details */}
              <div className="flex-1">
                {res.error ? (
                  <p className="text-red-600 font-semibold">Error: {res.error}</p>
                ) : (
                  <>
                    <p><strong>Damage:</strong> {res.damage}</p>
                    <p><strong>Confidence:</strong> {res.confidence}%</p>
                    <p><strong>Estimated Cost :</strong> Rs {res.estimated_cost}</p>
                  
                  
                  </>
                )}
                {res.filename && <p className="text-xs mt-2 text-gray-500">File: {res.filename}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

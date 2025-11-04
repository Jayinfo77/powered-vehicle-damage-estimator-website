import { useEffect, useState } from 'react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/predictions');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected data format");
        setHistory(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 0.9)
      return (
        <span className="bg-green-600 text-white px-2 py-1 text-xs rounded ml-2">
          High
        </span>
      );
    if (confidence >= 0.6)
      return (
        <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded ml-2">
          Moderate
        </span>
      );
    return (
      <span className="bg-red-500 text-white px-2 py-1 text-xs rounded ml-2">
        Low
      </span>
    );
  };

  if (loading) {
    return (
      <p className="text-center text-gray-600 mt-16 text-lg font-medium">
        Loading prediction history...
      </p>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center text-red-600 font-semibold mt-16 text-lg">
          Error loading history: {error}
        </p>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center text-gray-500 mt-16 text-lg italic">
          No prediction history found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold mb-12 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
        Prediction History
      </h2>

      <ul className="space-y-8">
        {history.map((item) => {
          const damage = (item.damage_type || item.damageType || '').replace(/_/g, ' ');
          const confidence = Number(item.confidence) || 0;

          const imageUrl =
            item.annotated_image_url ||
            (item.annotated_image_name
              ? `http://localhost:5000/api/predicted/${item.annotated_image_name}`
              : null);

          return (
            <li
              key={item._id || item.image_name || Math.random()}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-2xl transition-all"
            >
              <div className="flex-1 space-y-2">
                <p className="text-xl font-semibold text-gray-900">
                  Vehicle:{' '}
                  <span className="font-normal capitalize">
                    {item.vehicle_name || item.vehicleName} -{' '}
                    {item.vehicle_model || item.vehicleModel}
                  </span>
                </p>
                <p className="text-gray-700 text-lg">
                  Damage:{' '}
                  <span className="font-medium text-red-600 capitalize">
                    {damage}
                  </span>
                </p>
                <p className="text-gray-700 text-lg">
                  Confidence:{' '}
                  <span className="font-semibold">
                    {(confidence * 100).toFixed(2)}%
                  </span>
                  {getConfidenceBadge(confidence)}
                </p>
                <p className="text-gray-700 text-lg">
                  Estimated Cost:{' '}
                  <span className="font-semibold text-green-600">
                    {item.estimated_cost || item.estimatedCost || 'N/A'}
                  </span>
                </p>
                <p className="text-gray-500 text-sm italic">
                  Date:{' '}
                  {item.timestamp
                    ? new Date(item.timestamp).toLocaleString()
                    : item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>

              <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0 flex justify-center items-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`Annotated damage of ${item.vehicle_name || item.vehicleName}`}
                    onClick={() => setPreviewImg(imageUrl)}
                    className="w-56 h-36 cursor-pointer rounded-xl object-cover border border-gray-300 shadow-md hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-56 h-36 flex items-center justify-center rounded-xl bg-gray-100 border border-dashed border-gray-300 text-gray-400 italic">
                    No Image
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Image Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}
        >
          <img
            src={previewImg}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
          />
        </div>
      )}
    </div>
  );
}

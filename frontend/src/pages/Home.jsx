import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';
import {
  AiOutlineUpload,
  AiOutlineSearch,
  AiOutlineFileDone,
} from 'react-icons/ai';
import {
  MdSpeed,
  MdAttachMoney,
  MdDashboard,
  MdHistory,
  MdAdminPanelSettings,
  MdEmail,
} from 'react-icons/md';

import banner1 from '../assets/banner1.jpeg';
import banner2 from '../assets/banner2.jpeg';
import banner3 from '../assets/banner3.jpeg';
import banner4 from '../assets/banner4.jpeg';
import banner5 from '../assets/banner5.jpeg';

import aiImage from '../assets/features/ai-damage-detection.jpg';
import costImage from '../assets/features/instant-cost-estimation.jpg';
import historyImage from '../assets/features/history-report-management.jpg';

const slides = [
  {
    img: banner1,
    text: 'Upload damaged vehicle images and instantly get AI-based damage prediction, cost estimates & reports.',
  },
  {
    img: banner2,
    text: 'Fast and accurate damage classification with detailed cost estimations.',
  },
  {
    img: banner3,
    text: 'Keep track of your vehicle damage history and generate reports anytime.',
  },
  {
    img: banner4,
    text: 'Admin control panel with alerts to keep your system secure and updated.',
  },
  {
    img: banner5,
    text: 'User-friendly dashboard to easily navigate and manage your damage predictions.',
  },
];

// -- Hero Slider Component
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timeoutRef = useRef(null);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => {
        if (prev === slides.length - 1) {
          setDirection(-1);
          return prev - 1;
        }
        if (prev === 0) {
          setDirection(1);
          return prev + 1;
        }
        return prev + direction;
      });
    }, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [current, direction]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="relative h-[80vh] overflow-hidden">
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[current].img})` }}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      {/* Text Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto h-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-4"
        >
          Welcome to{' '}
          <span className="text-yellow-300"> Powered Vehicles Damage Estimator</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-white mb-6"
        >
          {slides[current].text}
        </motion.p>
        <Link
          to="/predict"
          className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold px-6 py-3 rounded-lg shadow"
        >
          Get Started
        </Link>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full ${
              i === current ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

// -- How It Works Section
function HowItWorks() {
  const steps = [
    {
      icon: <AiOutlineUpload size={40} className="mx-auto text-blue-600" />,
      step: 'Upload Image',
      desc: 'Capture or upload a photo of your damaged vehicle.',
    },
    {
      icon: <AiOutlineSearch size={40} className="mx-auto text-green-600" />,
      step: 'Predict Damage',
      desc: 'AI analyzes and classifies the damage.',
    },
    {
      icon: <AiOutlineFileDone size={40} className="mx-auto text-purple-600" />,
      step: 'Get Report',
      desc: 'Get estimated repair cost and report.',
    },
  ];

  return (
    <section className="py-16 px-4 md:px-6 text-center">
      <h2 className="text-3xl font-bold mb-10">How It Works</h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
        {steps.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            {item.icon}
            <h3 className="text-xl font-semibold mt-4 mb-2">{item.step}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// -- New Features Section (your provided code)
const featuresData = [
  {
    title: "AI-Powered Damage Detection",
    description:
      "Our advanced AI analyzes vehicle images to accurately identify damage types such as scratches, dents, or broken parts in seconds.",
    img: aiImage,
  },
  {
    title: "Instant Cost Estimation",
    description:
      "Get instant and reliable repair cost estimates based on the damage severity and your vehicle's model, helping you plan your budget effectively.",
    img: costImage,
  },
  {
    title: "History & Report Management",
    description:
      "Keep track of all your past damage predictions and repair estimates with a clean and intuitive history dashboard.",
    img: historyImage,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6 },
  }),
};

function Features() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <motion.h1
        className="text-4xl font-extrabold text-center mb-12 text-blue-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Features of Powered Vehicles Damage Estimator
      </motion.h1>

      <motion.p
        className="text-center max-w-3xl mx-auto text-gray-700 text-lg mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Powered by cutting-edge AI technology, our system provides fast, accurate damage detection and cost estimation to help you manage vehicle repairs efficiently.
      </motion.p>

      <div className="grid gap-12 md:grid-cols-3">
        {featuresData.map(({ title, description, img }, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={i}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={img}
              alt={title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-3 text-blue-600">{title}</h2>
              <p className="text-gray-700">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.section
        className="mt-20 max-w-4xl mx-auto bg-blue-50 rounded-lg p-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-6">How It Works</h2>
        <p className="text-gray-800 text-lg leading-relaxed max-w-xl mx-auto mb-8">
          Simply upload photos of your damaged vehicle, and our AI model will analyze them to detect the type and extent of damage.  
          You'll receive a detailed damage report with confidence levels and estimated repair costs instantly.  
          Manage your damage history and get quick insights anytime.
        </p>
        <Link
          to="/login"
          state={{ from: '/predict' }} // 👈 Redirect destination after login
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
        >
          Try it Now
        </Link>
      </motion.section>
    </div>
  );
}



// -- Repair Centers Section
function RepairCenters() {
  const cities = [
    'Biratnagar',
    'Dharan',
    'Itahari',
    'Kathmandu',
    'Pokhara',
    'Butwal',
    'Hetauda',
    'Nepalgunj',
    'Dhangadhi',
    'Rajbiraj',
    'Janakpur',
    'Birgunj',
  ];

  return (
    <section className="py-16 px-4 bg-gray-100 text-center">
      <h2 className="text-3xl font-extrabold mb-12 text-gray-900">
        Nearby Repair & Service Centers
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {cities.map((city) => (
          <a
            key={city}
            href={`https://www.google.com/maps/search/vehicle garage in ${city} Nepal`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between"
          >
            <div className="flex items-center justify-center mb-4">
              <FiMapPin className="text-blue-600 text-3xl mr-3 group-hover:text-blue-700 transition" />
              <h3 className="text-2xl font-semibold text-blue-700 group-hover:text-blue-800 transition">
                {city}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Explore garages near <span className="font-semibold">{city}</span>
            </p>
            <span className="inline-block text-blue-500 font-medium group-hover:underline">
              View on Google Maps →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

// -- Feedback List + Form Component
function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [formData, setFormData] = useState({ name: '', city: '', review: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/feedbacks');
        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        console.error('Error loading feedbacks:', err);
      } finally {
        setLoadingFeedbacks(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, city, review } = formData;
    if (!name.trim() || !review.trim()) {
      return alert('Name and Review are required');
    }
    setSubmitting(true);

    try {
      const res = await fetch('http://localhost:5001/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), city: city.trim(), review: review.trim() }),
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      const newFeedback = await res.json();
      setFeedbacks((prev) => [newFeedback, ...prev]);
      setFormData({ name: '', city: '', review: '' });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 mb-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">What Our Users Say</h2>
      <p className="text-center text-gray-600 mt-2 max-w-xl mx-auto">
        Hear directly from our users about their experience with Vehicle Damage Estimator.
      </p>

      {loadingFeedbacks ? (
        <p className="mt-6 text-center text-gray-700">Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p className="mt-6 text-center text-gray-500 italic">No feedbacks yet.</p>
      ) : (
        <div className="overflow-x-auto py-6">
          <ul className="flex space-x-6">
            {feedbacks.map(({ _id, name, city, review }) => (
              <li
                key={_id}
                className="bg-white rounded-2xl shadow-lg p-6 min-w-[300px] flex-shrink-0 hover:shadow-2xl transition"
              >
                <p className="text-lg italic">"{review}"</p>
                <p className="mt-4 font-semibold text-gray-900">
                  — {name}
                  {city && <span className="text-gray-500">, {city}</span>}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Feedback form */}
      <form
        onSubmit={handleSubmit}
        className="mt-10 max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md"
      >
        <h3 className="text-2xl font-bold mb-4">Leave Your Feedback</h3>
        <input
          type="text"
          placeholder="Your Name *"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-yellow-400"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="City"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-yellow-400"
          value={formData.city}
          onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
        />
        <textarea
          placeholder="Your feedback *"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-yellow-400 resize-none"
          rows={4}
          value={formData.review}
          onChange={(e) => setFormData((prev) => ({ ...prev, review: e.target.value }))}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold px-6 py-3 rounded shadow disabled:opacity-50 transition"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </section>
  );
}

// -- Confidence badge helper
function ConfidenceBadge({ confidence }) {
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
}

// -- Past Predictions Section
function PastPredictions() {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorHistory, setErrorHistory] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/predictions');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Unexpected data format');
        setHistory(data);
      } catch (err) {
        setErrorHistory(err.message || 'Failed to fetch history');
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <section className="max-w-6xl mx-auto p-6 mb-16">
      <h2 className="text-4xl font-extrabold mb-12 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
        Past Predicted
      </h2>

      {loadingHistory ? (
        <p className="text-center text-gray-600 text-lg font-medium">
          Loading past predictions...
        </p>
      ) : errorHistory ? (
        <p className="text-center text-red-600 font-semibold text-lg">
          Error loading past predictions: {errorHistory}
        </p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-500 italic text-lg">
          No past predictions found.
        </p>
      ) : (
        <div className="overflow-x-auto py-6">
          <ul className="flex space-x-8">
            {history.map((item, index) => {
              const damage = (item.damage_type || item.damageType || '').replace(
                /_/g,
                ' '
              );
              const confidence = Number(item.confidence) || 0;

              const imageUrl =
                item.annotated_image_url ||
                (item.annotated_image_name
                  ? `http://localhost:5000/api/predicted/${item.annotated_image_name}`
                  : null);

              return (
                <li
                  key={item._id || item.image_name || `prediction-${index}`}
                  className="bg-white rounded-2xl shadow-lg p-6 flex-shrink-0 min-w-[350px] flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-2xl transition-all"
                >
                  <div className="flex-1 space-y-2">
                    <p className="text-xl font-semibold text-gray-900 capitalize">
                      Damage: {damage}
                      <ConfidenceBadge confidence={confidence} />
                    </p>
                    <p className="text-gray-700 font-medium">Confidence: {(confidence * 100).toFixed(2)}%</p>
                    <p className="text-gray-700 font-medium">
                      Estimated Cost: Rs. {item.estimated_cost || 'N/A'}
                    </p>
                    <p className="text-gray-500 text-sm italic">
                      Date: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`Annotated damage image for ${damage}`}
                      className="h-28 w-28 rounded cursor-pointer shadow-md hover:scale-105 transition-transform"
                      onClick={() => setPreviewImg(imageUrl)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-28 w-28 bg-gray-200 flex items-center justify-center rounded text-gray-400 font-semibold">
                      No Image
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Image preview modal */}
      <AnimatePresence>
        {previewImg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImg(null)}
          >
            <motion.img
              src={previewImg}
              alt="Full preview"
              className="max-w-4xl max-h-[90vh] rounded shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 rounded-full p-2 text-xl"
              aria-label="Close image preview"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// -- Main Home component
export default function Home() {
  return (
    <>
      <HeroSlider />
      <HowItWorks />
      <Features />       {/* <-- Your updated Features component here */}
      <FeedbackSection />
      <PastPredictions />
      
      <RepairCenters />
    </>
  );
} 
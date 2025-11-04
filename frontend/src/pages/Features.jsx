import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import aiImage from '../assets/features/ai-damage-detection.jpg';
import costImage from '../assets/features/instant-cost-estimation.jpg';
import historyImage from '../assets/features/history-report-management.jpg';

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

export default function Features() {
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

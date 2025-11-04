import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Predict from './pages/Predict';
import History from './pages/History';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import Features from './pages/Features';
import PrivateRoute from './components/PrivateRoute';

import AdminDashboard from './pages/AdminDashboard';  // <-- Import AdminDashboard
    // <-- Import GarageMap

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/predict"
              element={
                <PrivateRoute>
                  <Predict />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <History />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Admin route */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminRequired={true}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

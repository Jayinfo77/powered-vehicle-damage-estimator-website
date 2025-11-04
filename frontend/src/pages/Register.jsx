import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  HiMail,
  HiLockClosed,
  HiUser,
  HiEye,
  HiEyeOff,
} from 'react-icons/hi';
import logo from '../assets/logo.png'; // ✅ Make sure this path is correct

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPwd) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/auth/register', {
        name,
        email,
        password,
      });

      navigate('/login'); // Redirect after successful registration
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        {/* ✅ Logo Section */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Vehicle Damage Estimator Logo" className="h-16 w-16" />
        </div>

        <h2 className="text-3xl font-bold mb-4 text-center text-blue-700">
         Powered Vehicles Damage Estimator
        </h2>

        <p className="text-center text-sm text-gray-500 mb-6">
          Create your account to start using the system
        </p>

        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <HiUser className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Your Name"
                className="w-full outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <HiMail className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <HiLockClosed className="text-gray-400 mr-2" />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="ml-2 text-gray-500 focus:outline-none"
              >
                {showPwd ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <HiLockClosed className="text-gray-400 mr-2" />
              <input
                type={showConfirmPwd ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full outline-none"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                className="ml-2 text-gray-500 focus:outline-none"
              >
                {showConfirmPwd ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

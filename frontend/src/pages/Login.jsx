import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import logo from '../assets/logo.png'; // ✅ Make sure this path is correct

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));

      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        {/* ✅ Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Vehicle Damage Estimator Logo" className="h-16 w-16" />
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center text-blue-700"> Powered Vehicles Damage Estimator</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Welcome back! Please login to continue.</p>

        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <HiMail className="text-gray-400 mr-2" />
              <input
                type="email"
                id="email"
                className="w-full outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
            <div className="flex items-center border border-gray-300 rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <HiLockClosed className="text-gray-400 mr-2" />
              <input
                type={showPwd ? 'text' : 'password'}
                id="password"
                className="w-full outline-none"
                placeholder="••••••••"
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

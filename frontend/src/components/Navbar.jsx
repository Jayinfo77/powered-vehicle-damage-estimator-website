import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiMenu,
  HiX,
  HiBell,
  HiUserCircle,
  HiHome,
  HiLightBulb,
  HiChartBar,
  HiExclamationCircle,
  HiClipboardList,
  HiUserAdd,
  HiLogin,
  HiCog,
  HiLogout,
} from 'react-icons/hi';
import logo from '../assets/logo.png';
import axios from 'axios';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    try {
      const parsedUser = user ? JSON.parse(user) : null;
      setUserInfo(parsedUser);
    } catch (err) {
      console.error('Failed to parse userInfo:', err);
    }
    setMenuOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userInfo?.token) return;
    const fetchNotifications = async () => {
      setNotifLoading(true);
      try {
        const headers = { Authorization: `Bearer ${userInfo.token}` };
        const { data } = await axios.get('http://localhost:5001/api/notifications/user', { headers });
        setNotifications(data);
      } catch {
        setNotifError('Failed to fetch notifications');
      } finally {
        setNotifLoading(false);
      }
    };
    fetchNotifications();
  }, [userInfo]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/login');
  };

  const navClass = (path) =>
    pathname === path
      ? 'text-yellow-400 border-b-2 border-yellow-400 font-semibold'
      : 'text-gray-300 hover:text-yellow-400 transition-colors duration-200';

  const loggedInLinks = [
    { name: 'Home', path: '/', icon: <HiHome className="inline mr-2 mb-1" /> },
    { name: 'Features', path: '/features', icon: <HiLightBulb className="inline mr-2 mb-1" /> },
    { name: 'History', path: '/history', icon: <HiChartBar className="inline mr-2 mb-1" /> },
    { name: 'Predict', path: '/predict', icon: <HiExclamationCircle className="inline mr-2 mb-1" /> },
    ...(userInfo?.role === 'admin'
      ? [{ name: 'Admin Dashboard', path: '/admin', icon: <HiClipboardList className="inline mr-2 mb-1" /> }]
      : []),
  ];

  const loggedOutLinks = [
    { name: 'Home', path: '/', icon: <HiHome className="inline mr-2 mb-1" /> },
    { name: 'Features', path: '/features', icon: <HiLightBulb className="inline mr-2 mb-1" /> },
    { name: 'Register', path: '/register', icon: <HiUserAdd className="inline mr-2 mb-1" /> },
    { name: 'Login', path: '/login', icon: <HiLogin className="inline mr-2 mb-1" /> },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="bg-black shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl sm:text-2xl font-bold text-yellow-400"> Powered Vehicles Damage Estimator</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-lg font-medium">
          {(userInfo ? loggedInLinks : loggedOutLinks).map(({ name, path, icon }) => (
            <Link key={path} to={path} className={navClass(path)}>
              {icon}
              {name}
            </Link>
          ))}

          {/* Notifications */}
          {userInfo && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative text-gray-300 hover:text-yellow-400"
              >
                <HiBell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-xl z-50">
                  <div className="p-3 border-b font-semibold text-gray-800">Notifications</div>
                  {notifLoading ? (
                    <p className="p-4 text-center text-gray-600">Loading...</p>
                  ) : notifError ? (
                    <p className="p-4 text-red-600 text-center">{notifError}</p>
                  ) : notifications.length === 0 ? (
                    <p className="p-4 text-center text-gray-600">No notifications</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {notifications.map((n) => (
                        <li
                          key={n._id}
                          className={`p-3 hover:bg-gray-100 cursor-pointer ${
                            n.isRead ? 'bg-white' : 'bg-yellow-100 font-medium'
                          }`}
                        >
                          <p className="truncate">{n.title}</p>
                          <p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile Dropdown */}
          {userInfo && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="ml-3 w-9 h-9 rounded-full border-2 border-yellow-400 overflow-hidden hover:ring-2 hover:ring-yellow-300 transition"
              >
                {userInfo.profileImage ? (
                  <img
                    src={`http://localhost:5001/uploads/profile_images/${userInfo.profileImage}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HiUserCircle className="w-full h-full text-gray-300" />
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 text-sm text-gray-600 border-b">
                    {userInfo.name || userInfo.email}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    <HiUserCircle className="inline mr-2" />
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    <HiCog className="inline mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <HiLogout className="inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-300 hover:text-yellow-400"
        >
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-black border-t border-gray-700 shadow-inner">
          <ul className="flex flex-col space-y-2 px-6 py-4 text-lg font-medium">
            {(userInfo ? loggedInLinks : loggedOutLinks).map(({ name, path, icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`block ${
                    pathname === path ? 'text-yellow-400 font-semibold' : 'text-gray-300 hover:text-yellow-400'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {icon}
                  {name}
                </Link>
              </li>
            ))}
            {userInfo && (
              <>
                <li className="text-gray-400 text-sm">Logged in as: {userInfo.name || userInfo.email}</li>
                <li>
                  <Link to="/settings" className="text-gray-300 hover:text-yellow-400">
                    <HiCog className="inline mr-2 mb-1" />
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logoutHandler}
                    className="text-left w-full text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <HiLogout className="inline mr-2 mb-1" />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
} 
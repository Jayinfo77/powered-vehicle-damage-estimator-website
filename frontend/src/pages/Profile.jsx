import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || !userInfo.token) return;

    setName(userInfo.name || '');
    setEmail(userInfo.email || '');
    if (userInfo.profileImage) {
      setPreviewImage(`http://localhost:5001/uploads/profile_images/${userInfo.profileImage}`);
    } else {
      setPreviewImage('');
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/users/profile', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        if (res.data.profileImage) {
          setPreviewImage(`http://localhost:5001/uploads/profile_images/${res.data.profileImage}`);
        } else {
          setPreviewImage('');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    fetchProfile();
  }, [userInfo]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (profileImage) formData.append('profileImage', profileImage);

    try {
      const res = await axios.put('http://localhost:5001/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(res.data);
      if (res.data.profileImage) {
        setPreviewImage(`http://localhost:5001/uploads/profile_images/${res.data.profileImage}`);
      }
      setMessage('✅ Profile updated successfully!');

      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          ...userInfo,
          name: res.data.name,
          email: res.data.email,
          profileImage: res.data.profileImage,
        })
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setMessage(`❌ ${msg}`);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    try {
      await axios.put(
        'http://localhost:5001/api/users/change-password',
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      setOldPassword('');
      setNewPassword('');
      setPasswordMessage('✅ Password changed successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password';
      setPasswordMessage(`❌ ${msg}`);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const deleteAccountHandler = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    setDeleteMessage('');
    try {
      await axios.delete('http://localhost:5001/api/users/delete', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      localStorage.removeItem('userInfo');
      setDeleteMessage('✅ Your account has been deleted.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete account';
      setDeleteMessage(`❌ ${msg}`);
    }
  };

  if (!user && !name && !email) {
    return <p className="text-center mt-10 text-lg text-gray-600">Loading profile...</p>;
  }

  // Eye icon SVGs
  const EyeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  const EyeOffIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.944-9.543-7a9.956 9.956 0 012.137-3.518m1.254-1.523A9.958 9.958 0 0112 5c4.478 0 8.269 2.944 9.543 7a9.956 9.956 0 01-4.694 5.52M3 3l18 18"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-3xl p-10 md:p-12">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-10 text-center tracking-wide">
          My Profile
        </h2>

        {/* PROFILE UPDATE */}
        <form
          onSubmit={handleProfileUpdate}
          className="space-y-8"
          autoComplete="off"
          noValidate
        >
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 mb-5">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-8 border-blue-300 shadow-lg"
                />
              ) : (
                <div className="w-36 h-36 rounded-full flex items-center justify-center bg-blue-200 border-8 border-blue-300 text-blue-800 font-bold text-2xl shadow-lg">
                  No Image
                </div>
              )}
            </div>
            <label
              htmlFor="profileImageInput"
              className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-semibold px-6 py-3 rounded-full shadow-md select-none"
            >
              Choose Profile Image
            </label>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setProfileImage(file);
                setPreviewImage(URL.createObjectURL(file));
              }}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="nameInput"
                className="block text-gray-700 font-semibold mb-2"
              >
                Name
              </label>
              <input
                id="nameInput"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="emailInput"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email
              </label>
              <input
                id="emailInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-5 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          {message && (
            <p
              className={`text-center font-semibold ${
                message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-400 text-white font-semibold py-3 px-14 rounded-full shadow-lg transition"
            >
              Update Profile
            </button>
          </div>
        </form>

        <hr className="my-12 border-gray-300" />

        {/* CHANGE PASSWORD */}
        <form
          onSubmit={handleChangePassword}
          className="space-y-8"
          autoComplete="off"
          noValidate
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Change Password
          </h3>

          {/* Old Password */}
          <div className="relative max-w-md mx-auto">
            <label
              htmlFor="oldPasswordInput"
              className="block mb-2 font-semibold text-gray-700"
            >
              Old Password
            </label>
            <input
              id="oldPasswordInput"
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="Enter old password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showOldPassword ? 'Hide old password' : 'Show old password'}
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-600 focus:outline-none"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setShowOldPassword(!showOldPassword);
              }}
            >
              {showOldPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.944-9.543-7a9.956 9.956 0 012.137-3.518m1.254-1.523A9.958 9.958 0 0112 5c4.478 0 8.269 2.944 9.543 7a9.956 9.956 0 01-4.694 5.52M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* New Password */}
          <div className="relative max-w-md mx-auto">
            <label
              htmlFor="newPasswordInput"
              className="block mb-2 font-semibold text-gray-700"
            >
              New Password
            </label>
            <input
              id="newPasswordInput"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-5 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="Enter new password"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-600 focus:outline-none"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setShowNewPassword(!showNewPassword);
              }}
            >
              {showNewPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.944-9.543-7a9.956 9.956 0 012.137-3.518m1.254-1.523A9.958 9.958 0 0112 5c4.478 0 8.269 2.944 9.543 7a9.956 9.956 0 01-4.694 5.52M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {passwordMessage && (
            <p
              className={`max-w-md mx-auto text-center font-semibold ${
                passwordMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {passwordMessage}
            </p>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-400 text-white font-semibold py-3 px-14 rounded-full shadow-lg transition"
            >
              Change Password
            </button>
          </div>
        </form>

        {/* DELETE & LOGOUT */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-14 max-w-md mx-auto">
          <button
            onClick={deleteAccountHandler}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-400 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition"
          >
            Delete My Account
          </button>

          <button
            onClick={logoutHandler}
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition"
          >
            Logout
          </button>
        </div>

        {deleteMessage && (
          <p
            className={`mt-6 text-center font-semibold ${
              deleteMessage.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {deleteMessage}
          </p>
        )}
      </div>
    </div>
  );
}

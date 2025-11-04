// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer
} from 'recharts';

const API_ADMIN = 'http://localhost:5001/api';
const API_PREDICT = 'http://localhost:5000/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF66C4'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [error, setError] = useState('');
  const [damageDistribution, setDamageDistribution] = useState([]);
  const [costData, setCostData] = useState([]);
  const [confidenceData, setConfidenceData] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const headers = { Authorization: `Bearer ${userInfo?.token}` };

  // Fetch functions
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await axios.get(`${API_ADMIN}/admin/users`, { headers });
      setUsers(data);
      setError('');
    } catch {
      setError('❌ Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchNotifications = async () => {
    setLoadingNotifs(true);
    try {
      const { data } = await axios.get(`${API_ADMIN}/admin/notifications`, { headers });
      setNotifications(data);
      setError('');
    } catch {
      setError('❌ Failed to load notifications');
    } finally {
      setLoadingNotifs(false);
    }
  };

  const fetchPredictions = async () => {
    setLoadingPredictions(true);
    try {
      const { data } = await axios.get(`${API_PREDICT}/predictions`);
      setPredictions(data);
      processAnalytics(data);
      setError('');
    } catch {
      setError('❌ Failed to load predictions');
    } finally {
      setLoadingPredictions(false);
    }
  };

  // Process analytics data for charts
  const processAnalytics = (data) => {
    const damageMap = {};
    const costMap = {};
    const confidenceMap = {};

    data.forEach(pred => {
      const damage = pred.damage_type;
      damageMap[damage] = (damageMap[damage] || 0) + 1;

      const date = new Date(pred.timestamp || pred.createdAt).toLocaleDateString();
      costMap[date] = (costMap[date] || 0) + pred.estimated_cost;

      if (!confidenceMap[date]) confidenceMap[date] = [];
      confidenceMap[date].push(pred.confidence * 100);
    });

    const distData = Object.entries(damageMap).map(([name, value]) => ({ name, value }));
    const costChartData = Object.entries(costMap).map(([date, cost]) => ({ date, cost }));
    const confidenceChartData = Object.entries(confidenceMap).map(([date, values]) => ({
      date,
      confidence: parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
    }));

    setDamageDistribution(distData);
    setCostData(costChartData);
    setConfidenceData(confidenceChartData);
  };

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
    fetchPredictions();
  }, []);

  // User role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`${API_ADMIN}/admin/users/${userId}/role`, { role: newRole }, { headers });
      fetchUsers();
    } catch {
      setError('❌ Failed to update role');
    }
  };

  // User delete
  const handleUserDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_ADMIN}/admin/users/${userId}`, { headers });
      fetchUsers();
    } catch {
      setError('❌ Failed to delete user');
    }
  };

  // Mark notification read
  const markAsRead = async (notifId) => {
    try {
      await axios.put(`${API_ADMIN}/admin/notifications/${notifId}/read`, {}, { headers });
      fetchNotifications();
    } catch {
      setError('❌ Failed to mark notification as read');
    }
  };

  // Notification form state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifUserId, setNotifUserId] = useState('');

  // Create notification
  const handleCreateNotification = async (e) => {
    e.preventDefault();
    const payload = {
      title: notifTitle,
      message: notifMessage,
      userId: notifUserId === '' ? null : notifUserId,
    };
    try {
      await axios.post(`${API_ADMIN}/admin/notifications`, payload, { headers });
      setNotifTitle('');
      setNotifMessage('');
      setNotifUserId('');
      fetchNotifications();
    } catch {
      setError('❌ Failed to create notification');
    }
  };

  // Delete prediction
  const handlePredictionDelete = async (predictionId) => {
    if (!window.confirm('Are you sure you want to delete this prediction?')) return;
    try {
      await axios.delete(`${API_PREDICT}/admin/predictions/${predictionId}`);
      fetchPredictions();
    } catch {
      setError('❌ Failed to delete prediction');
    }
  };

  // Tabs for navigation
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'predictions', label: 'Predictions' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">Admin Dashboard</h1>
      {error && <p className="text-red-600 text-center font-medium mb-4">{error}</p>}

      {/* Tab Buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg font-semibold ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow-lg rounded-xl p-6 min-h-[400px]">
        {activeTab === 'overview' && (
          <>
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
              <div className="bg-white shadow-md rounded-xl p-4">
                <h2 className="text-xl font-semibold text-center mb-2">Damage Type Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={damageDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {damageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white shadow-md rounded-xl p-4">
                <h2 className="text-xl font-semibold text-center mb-2">Estimated Cost Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cost" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-xl p-4 mb-14">
              <h2 className="text-xl font-semibold text-center mb-2">Average Confidence Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="confidence" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <section>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">👤 Users</h2>
            {loadingUsers ? (
              <p>Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-300 rounded shadow">
                  <thead className="bg-blue-100 text-gray-800">
                    <tr>
                      <th className="p-3 border">Name</th>
                      <th className="p-3 border">Email</th>
                      <th className="p-3 border">Role</th>
                      <th className="p-3 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="text-center even:bg-gray-50">
                        <td className="p-2 border">{u.name}</td>
                        <td className="p-2 border">{u.email}</td>
                        <td className="p-2 border capitalize">{u.role}</td>
                        <td className="p-2 border space-x-2">
                          <button
                            onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'user' : 'admin')}
                            className={`px-3 py-1 rounded text-white text-xs ${
                              u.role === 'admin' ? 'bg-red-500' : 'bg-green-600'
                            }`}
                          >
                            {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => handleUserDelete(u._id)}
                            className="px-3 py-1 bg-red-700 text-white text-xs rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === 'notifications' && (
          <section>
            <h2 className="text-2xl font-bold text-gray-700 mb-6">🔔 Notifications</h2>
            {loadingNotifs ? (
              <p>Loading notifications...</p>
            ) : (
              <>
                <ul className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <li
                      key={notif._id}
                      className={`p-4 border rounded-lg ${
                        notif.isRead ? 'bg-gray-100 border-gray-300' : 'bg-yellow-100 border-yellow-400'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{notif.title}</p>
                          <p>{notif.message}</p>
                          <p className="text-sm text-gray-600">
                            {notif.userId ? `To: ${notif.userId.name} (${notif.userId.email})` : 'To: All Users'}
                          </p>
                          <p className="text-xs text-gray-500 italic">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <button
                            onClick={() => markAsRead(notif._id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Create Notification Form */}
                <form onSubmit={handleCreateNotification} className="max-w-md bg-white p-4 rounded shadow border">
                  <h4 className="text-lg font-semibold mb-3">📤 Send Notification</h4>
                  <input
                    type="text"
                    placeholder="Title"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                  <textarea
                    placeholder="Message"
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    rows={3}
                    required
                  />
                  <select
                    value={notifUserId}
                    onChange={(e) => setNotifUserId(e.target.value)}
                    className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Send to All Users</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    Send Notification
                  </button>
                </form>
              </>
            )}
          </section>
        )}

        {activeTab === 'predictions' && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-700">📊 Predictions</h2>
            {loadingPredictions ? (
              <p>Loading predictions...</p>
            ) : predictions.length === 0 ? (
              <p>No predictions found.</p>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm border border-gray-300 rounded shadow">
                  <thead className="bg-blue-100 text-gray-800">
                    <tr>
                      <th className="p-2 border">Vehicle Name</th>
                      <th className="p-2 border">Model</th>
                      <th className="p-2 border">Damage Type</th>
                      <th className="p-2 border">Confidence</th>
                      <th className="p-2 border">Estimated Cost</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((p) => (
                      <tr key={p._id} className="text-center even:bg-gray-50">
                        <td className="p-2 border">{p.vehicle_name}</td>
                        <td className="p-2 border">{p.vehicle_model}</td>
                        <td className="p-2 border">{p.damage_type}</td>
                        <td className="p-2 border">{(p.confidence * 100).toFixed(2)}%</td>
                        <td className="p-2 border">Rs {p.estimated_cost}</td>
                        <td className="p-2 border">
                          {new Date(p.timestamp || p.createdAt).toLocaleString()}
                        </td>
                        <td className="p-2 border">
                          <button
                            onClick={() => handlePredictionDelete(p._id)}
                            className="bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

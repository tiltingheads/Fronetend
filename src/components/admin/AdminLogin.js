import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import { jwtDecode } from 'jwt-decode';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginUser({ username, password });
      const { token } = response.data;

      // Store token and decode
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);

      if (decodedToken.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access Denied: Admins only');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Admin Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-semibold text-gray-600">Username</label>
            <input
              type="text"
              name="username"
              required
              placeholder="Admin Username"
              className="p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label htmlFor="password" className="text-sm font-semibold text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Admin Password"
              className="p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="bg-indigo-600 text-white p-3 rounded-md font-semibold hover:bg-indigo-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

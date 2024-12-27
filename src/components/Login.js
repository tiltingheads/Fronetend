import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('https://backend-eh2a.onrender.com/api/login', {
        username,
        password,
      });

      // Assuming your backend returns a token or user data on successful login
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      // alert('Login successful!');
      window.location.href = '/about';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#dde5f4] p-2">
      <form
        className="bg-[#f1f7fe] p-4 rounded-3xl shadow-lg flex flex-col gap-6 w-full max-w-md"
        onSubmit={handleLogin}
      >
        {/* Logo */}
        <img
  src="/paw.svg"
  alt="Logo"
  className="w-24 h-24 mx-auto mb-1"
/>


        {/* Username */}
        <div className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow-md">
          <label htmlFor="username" className="text-[#4d4d4d] text-sm font-semibold">
            Username
          </label>
          <div className="flex items-center gap-3">
            <ion-icon name="person-outline" className="text-[#4d4d4d]"></ion-icon>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              className="outline-none border border-[#d1d5db] p-2 rounded-md text-[#4d4d4d] text-sm w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow-md">
          <label htmlFor="password" className="text-[#4d4d4d] text-sm font-semibold">
            Password
          </label>
          <div className="flex items-center gap-3">
            <ion-icon name="lock-closed-outline" className="text-[#4d4d4d]"></ion-icon>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Enter password"
              className="outline-none border border-[#d1d5db] p-2 rounded-md text-[#4d4d4d] text-sm w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ion-icon
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              className="text-[#4d4d4d] cursor-pointer"
              onClick={togglePasswordVisibility}
            ></ion-icon>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-[#3e4684] text-white rounded-xl font-semibold hover:bg-[#2c355b] transition duration-300"
        >
          Login
        </button>

        {/* Footer */}
        <div className="flex justify-center text-sm text-[#5e5e5e] mt-4">
          <span>Not registered yet? </span>
          <span className="text-[#3e4684] cursor-pointer hover:text-[#2c355b] ml-1"
           onClick={() => window.location.href = '/'}>
            Register now
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;

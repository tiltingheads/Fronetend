import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PetProfileRegistration from './components/PetProfileRegistration';
import ProfileSettings from './components/ProfileSettings';
import Login from './components/Login';
import AboutMe from './components/AboutMe';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './PrivateRoute';
import './App.css';
import AdminLogin from './components/admin/AdminLogin';

const App = () => {
  return (
    <Router>
      <div>
       
        <div className="p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PetProfileRegistration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit-profile" element={<ProfileSettings />} />
            <Route path="/about" element={<AboutMe />} />

            {/* Admin Route (Protected) */}
            <Route
              path="/admin"
              element={
                <PrivateRoute element={<AdminDashboard />} />
              }
            />
            <Route path="/admin-login" element={<AdminLogin/>} />

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

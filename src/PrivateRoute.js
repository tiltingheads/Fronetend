import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/admin-login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.role !== 'admin') {
      return <Navigate to="/" />;
    }
    return element;
  } catch (error) {
    return <Navigate to="/admin-login" />;
  }
};

export default PrivateRoute;

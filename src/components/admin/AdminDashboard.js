import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <ul>
        <li>
          <Link to="/admin/users" className="text-blue-500 hover:underline">View All Users</Link>
        </li>
        <li>
          <Link to="/admin/settings" className="text-blue-500 hover:underline">Admin Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;

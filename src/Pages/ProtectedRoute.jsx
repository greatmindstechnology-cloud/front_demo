import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // Retrieve the role from localStorage instead of sessionStorage
  const userRole = localStorage.getItem('role');

  // If no role is found, redirect to login
  if (!userRole) {
    return <Navigate to="/Login" replace />;
  }

  // Check if the user's role is in the allowedRoles array
  const isAllowed = allowedRoles.includes(userRole);
        // If allowed, render the nested routes (Outlet); otherwise, redirect to the appropriate dashboard
        if (isAllowed) {
          return <Outlet />;
        } else {
          // Redirect based on the user's role
          if (userRole === 'student') {
            return <Navigate to="/dashboard/student" replace />;
          } else if (userRole === 'trainer') {
            return <Navigate to="/dashboard/trainerdashboard" replace />;
          } else if (userRole === 'vendor') {
            return <Navigate to="/dashboard/vendorDashboard" replace />;
          } else if (userRole === 'admin') {
            return <Navigate to="/dashbaord/admin" replace />;
          } else if (userRole === 'super_admin') {
            return <Navigate to="/sdashboard/sadmin" replace />;
          } else {
            return <Navigate to="/dashboard" replace />;
          }
  }
};

export default ProtectedRoute;
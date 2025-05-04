import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './app/kiosk/pages/HomePage';
import NavigationPage from './app/kiosk/pages/NavigationPage';
import LoginPage from './app/kiosk/pages/Auth/LoginPage';
import PrivateRoute from './app/privateRoute/PrivateRoute';

// Admin Routes
import AdminPage from './app/admin/pages/AdminPage';
import NavigationFloorPage from './app/admin/pages/NavigationFloorPage';
import DashboardLayout from './app/admin/layouts/DashboardLayout';  // Import the DashboardLayout
import AnnouncementPage from './app/admin/pages/AnnouncementPage';
import AnalyticPage from './app/admin/pages/AnalyticPage';
import TeacherSchedule from './app/admin/pages/TeacherSchedule';
import Announcement from './app/kiosk/Announcement';
import ResetPasswordForm from './app/admin/components/ResetPasswordForm';

function App() {
  const token = localStorage.getItem("authToken"); // Get token from localStorage

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/navigation/ground" element={<NavigationPage />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/reset" element={<ResetPasswordForm />} />

        {/* Redirect to dashboard if already authenticated */}
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" /> : <LoginPage />}
        />

        {/* Protected Admin Routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute element={DashboardLayout} />}
        >
          {/* Nested Routes inside Dashboard */}
          <Route path="home" element={<AdminPage />} />
          <Route path="floor" element={<NavigationFloorPage />} />
          <Route path="announcement" element={<AnnouncementPage />} />
          <Route path="teachers" element={<TeacherSchedule />} />
          <Route path="analytics" element={<AnalyticPage />} />
          {/* Add other routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import Sidebar from '../components/SidebarComponent';
import { Outlet } from 'react-router-dom';  // Outlet is where child routes will be rendered

const DashboardLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area - This is where sub-routes will be rendered */}
      <div className="flex-grow p-4 h-[97vh]">
        {/* This will render the content of the active route */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

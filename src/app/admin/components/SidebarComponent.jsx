import React from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../../utils/logout";
import { handleLogoutNotification } from "../../../utils/logoutHelper";

const Sidebar = () => {
  const location = useLocation();  // Get the current location (path)
  const currentPath = location.pathname;  // Get the current route path

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    const apiEndpoint = import.meta.env.VITE_API_URL;

    const shouldClearToken = await logout(apiEndpoint, token);

    if (shouldClearToken) {
      handleLogoutNotification('/login');
    }
  };

  const navItems = [
    // { id: "home", label: "Home", icon: "fa-house", url: "/dashboard/home" },
    { id: "navigation", label: "Navigation", icon: "fa-chart-tree-map", url: "/dashboard/floor" },
    { id: "announcement", label: "Announcement", icon: "fa-megaphone", url: "/dashboard/announcement" },
    { id: "teachers", label: "Teacher", icon: "fa-megaphone", url: "/dashboard/teachers" },
    { id: "analytics", label: "Analytics", icon: "fa-megaphone", url: "/dashboard/analytics" },
  ];

  return (
    <div className="bg-gray-800 text-white h-screen p-4 transition-all duration-300 w-16 md:w-64 flex flex-col items-center md:items-start">
      {/* Logo */}
      <div className="mb-6 flex items-center justify-center w-full">
        <img src="/resources/logo/logo.png" className="w-24" alt="Logo" />
      </div>

      {/* Menu Items */}
      <nav className="space-y-4 w-full h-screen p-2 relative">
        <div className="w-full border-b-2 border-slate-700 mb-4">
          <span className="text-slate-500 hidden md:inline-block">Menu</span>
        </div>

        {/* Render Navigation Items */}
        {navItems.map((item) => (
          <Link
            to={item.url}
            key={item.id}
            className={`flex items-center gap-2 space-x-3 md:space-x-0 md:block cursor-pointer hover:text-white ${
              currentPath === item.url ? "text-white" : "text-gray-400"
            }`}
          >
            <i className={`fa-solid ${item.icon} text-2xl md:text-xl`}></i>
            <span className="ps-2 text-xl hidden md:inline-block">{item.label}</span>
          </Link>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute bottom-0 flex items-center gap-2 space-x-3 md:space-x-0 md:block text-red-400 cursor-pointer hover:text-red-500"
        >
          <i className="fa-solid fa-right-from-bracket text-2xl md:text-xl"></i>
          <span className="ps-2 text-xl hidden md:inline-block">Logout</span>
        </button>
      </nav>
    </div>
  );
};

// Sidebar.propTypes = {
//   activeItem: PropTypes.string.isRequired,
// };

export default Sidebar;

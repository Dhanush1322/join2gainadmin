import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardMain from '../components/DashboardMain';
import './DashboardPage.css';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const navigate = useNavigate();

  
  // ✅ Logout function - Remove token & Redirect
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    navigate("/admin"); // Redirect to login page
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      {/* ✅ Pass isSidebarOpen and handleLogout to Sidebar */}
      <Sidebar isOpen={isSidebarOpen} handleLogout={handleLogout} />
      <div className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <DashboardMain />
      </div>
    </div>
  );
};

export default DashboardPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './DashboardPage.css';
import ViewMatrixForm from './ViewMatrixForm';

function ViewMatrix() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  // ✅ Logout function - Remove token & Redirect
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    navigate("/admin"); // Redirect to login page
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Update windowWidth state on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute marginLeft based on window width
  const marginLeft = windowWidth <= 768 ? '4px' : '260px';

  return (
    <div className="dashboard">
      {/* ✅ Pass handleLogout to Sidebar */}
      <Sidebar isOpen={isSidebarOpen} handleLogout={handleLogout} />
      <div className="dashboard-content">
        <Navbar toggleSidebar={toggleSidebar} />
        <div style={{ marginTop: '100px', marginLeft }}>
          <ViewMatrixForm />
        </div>
      </div>
    </div>
  );
}

export default ViewMatrix;

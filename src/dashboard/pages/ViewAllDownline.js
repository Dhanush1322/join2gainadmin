
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './DashboardPage.css';
import ViewPlanTable from '../components/ViewPlanTable';
import ViewAllDownlineTable from '../components/ViewAllDownlineTable';
function ViewAllDownline() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL

  // ✅ Logout function - Remove token & Redirect
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    navigate("/"); // Redirect to login page
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
          {/* Pass the id as a prop to ViewPlanTable */}
          <ViewAllDownlineTable userId={id} /> {/* Passing userId prop */}
        </div>
      </div>
    </div>
  );
}

export default ViewAllDownline;

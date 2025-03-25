import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, User, LogOut, Edit, Eye, FileText } from 'lucide-react';
import './Sidebar.css';
import Logo from '../logo/logoo.png';

const Sidebar = ({ handleLogout, isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleLogoutClick = () => {
    setLoading(true);
    setTimeout(() => {
      handleLogout();
      setLoading(false);
    }, 2000);
  };

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <img src={Logo} alt="Logo" width="80" className="sidebar-logo" />
      <hr className="sidebar-divider" />

      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/Dashboard"><User size={20} /> Dashboard</Link>
        </li>
        <hr className="sidebar-divider" />

        {/* Profile Section */}
        <li className="sidebar-item" onClick={() => toggleMenu('profile')}>
          <div className="sidebar-link">
            <User size={20} /> <span>Profile Kit</span>
          </div>
          {activeMenu === 'profile' && (
            <ul className="submenu">
              <li className="submenu-item">
                <Link to="/change-password"><Eye size={18} /> Change Password</Link>
              </li>
            </ul>
          )}
        </li>
        <hr className="sidebar-divider" />

        {/* User KYC */}
        <li className="sidebar-item">
          <Link to="/Kyc"><User size={20} /> All User KYC</Link>
        </li>
        <hr className="sidebar-divider" />

        {/* User Details */}
        <li className="sidebar-item" onClick={() => toggleMenu('userDetails')}>
          <div className="sidebar-link">
            <User size={20} /> <span>User Details</span>
          </div>
          {activeMenu === 'userDetails' && (
            <ul className="submenu">
              <li className="submenu-item"><Link to="/AddNewMember"><Edit size={18} /> User List</Link></li>
              <li className="submenu-item"><Link to="/ViewMatrix"><Eye size={18} /> Rejected User</Link></li>
              <li className="submenu-item"><Link to="/Dowline"><Eye size={18} /> Blocked User</Link></li>
            </ul>
          )}
        </li>
        <hr className="sidebar-divider" />

        {/* Investments List */}
        <li className="sidebar-item" onClick={() => toggleMenu('investments')}>
          <div className="sidebar-link">
            <FileText size={20} /> <span>Investments List</span>
          </div>
          {activeMenu === 'investments' && (
            <ul className="submenu">
              <li className="submenu-item"><Link to="/ReTopupList"><Edit size={18} /> Re Topup List</Link></li>
              <li className="submenu-item"><Link to="/ApprovedList"><Eye size={18} /> Approved List</Link></li>
              <li className="submenu-item"><Link to="/RejectedList"><Eye size={18} /> Rejected List</Link></li>
            </ul>
          )}
        </li>
        <hr className="sidebar-divider" />

        {/* Reports Section */}
        <li className="sidebar-item" onClick={() => toggleMenu('reports')}>
          <div className="sidebar-link">
            <FileText size={20} /> <span>Reports</span>
          </div>
          {activeMenu === 'reports' && (
            <ul className="submenu">
              <li className="submenu-item"><Link to="/TDSReport"><Edit size={18} /> TDS Report</Link></li>
              <li className="submenu-item"><Link to="/IncomeEstimate"><Eye size={18} /> Income Estimate</Link></li>
              <li className="submenu-item"><Link to="/RankAchievers"><Eye size={18} /> Rank Achievers</Link></li>
            </ul>
          )}
        </li>
        <hr className="sidebar-divider" />

        {/* Logout */}
        <li className="sidebar-item" onClick={handleLogoutClick}>
          <div className="sidebar-link logout">
            <LogOut size={20} /> <span>{loading ? "Logging out..." : "Logout"}</span>
          </div>
        </li>
        <hr className="sidebar-divider" />
      </ul>
    </div>
  );
};

export default Sidebar;

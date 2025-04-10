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
        <li className="sidebar-item">
          <Link to="/AddUser"><User size={20} /> Add User</Link>
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
                <Link to="/ChangePassword"><Eye size={18} /> Change Password</Link>
              </li>
            </ul>
          )}
        </li>
        <hr className="sidebar-divider" />

        {/* Members Section */}
        <li className="sidebar-item" onClick={() => toggleMenu('members')}>
          <div className="sidebar-link">
            <User size={20} /> <span>Members</span>
          </div>
          {activeMenu === 'members' && (
            <ul className="submenu">
              <li className="submenu-item"><Link to="/ViewMembers"><Eye size={18} /> View Members</Link></li>
              {/* Members Section 
              <li className="submenu-item"><Link to="/DeactivatedMember"><Eye size={18} /> Deactivated Members</Link></li>*/}
              <li className="submenu-item"><Link to="/AwardAchivers"><Eye size={18} /> Award Achievers</Link></li>
              <li className="submenu-item"><Link to="/InvestmentRequst"><Eye size={18} /> Investment Requests</Link></li>
              <li className="submenu-item"><Link to="/InvestmentHistory"><Eye size={18} /> Investment History</Link></li>
            </ul>
          )}
        </li>
        <hr className="sidebar-divider" />

        {/* KYC Section */}
        <li className="sidebar-item" onClick={() => toggleMenu('kyc')}>
          <div className="sidebar-link">
            <User size={20} /> <span>KYC</span>
          </div>
          {activeMenu === 'kyc' && (
            <ul className="submenu">
              <li className="submenu-item"><Link to="/KycApproved"><Eye size={18} /> KYC Approved</Link></li>
              <li className="submenu-item"><Link to="/KYCHistory"><Eye size={18} /> KYC History</Link></li>
            </ul>
          )}
        </li>
        <hr className="sidebar-divider" />

        {/* Account Transactions Section */}
        <li className="sidebar-item" onClick={() => toggleMenu('transactions')}>
          <div className="sidebar-link">
            <User size={20} /> <span>ROI Income</span>
          </div>
          {activeMenu === 'transactions' && (
            <ul className="submenu">
              <li className="submenu-item"><Link to="/WithdrawRequst"><Edit size={18} />ROI Withdraw Request</Link></li>
              <li className="submenu-item"><Link to="/WithdrawHistory"><Eye size={18} />ROI Withdraw History</Link></li>

              {/* Account Transactions Section 
              <li className="submenu-item"><Link to="/AccountByDate"><Edit size={18} /> Account By Date</Link></li>
              <li className="submenu-item"><Link to="/AccountByUser"><Eye size={18} /> Account By User</Link></li>*/}
            </ul>
          )}
        </li>
        <hr className="sidebar-divider" />

        {/* Account Transactions Section */}
        <li className="sidebar-item" onClick={() => toggleMenu('Level')}>
          <div className="sidebar-link">
            <User size={20} /> <span>Level Incomes List</span>
          </div>
          {activeMenu === 'Level' && (
            <ul className="submenu">
              <li className="submenu-item"><Link to="/LevelInclomeList"><Edit size={18} />Level Withdraw Request</Link></li>
              <li className="submenu-item"><Link to="/LevelIncomePaidList"><Eye size={18} />Level Withdraw History</Link></li>

              {/* Account Transactions Section 
      <li className="submenu-item"><Link to="/AccountByDate"><Edit size={18} /> Account By Date</Link></li>
      <li className="submenu-item"><Link to="/AccountByUser"><Eye size={18} /> Account By User</Link></li>*/}
            </ul>
          )}
        </li>


        {/* Reports Section 
        <li className="sidebar-item" onClick={() => toggleMenu('reports')}>
          <div className="sidebar-link">
            <FileText size={20} /> <span>Reports</span>
          </div>
          {activeMenu === 'reports' && (
            <ul className="submenu">
              <li className="submenu-item"><Link to="/WalletReports"><Edit size={18} /> Wallet Reports</Link></li>
              <li className="submenu-item"><Link to="/TDSReports"><Eye size={18} /> TDS Reports</Link></li>
              <li className="submenu-item"><Link to="/IncomeEstimate"><Eye size={18} /> Income Estimate</Link></li>
              <li className="submenu-item"><Link to="/RankAchievers"><Eye size={18} /> Rank Achievers</Link></li>
            </ul>
          )}
        </li>
        <hr className="sidebar-divider" />*/}

        {/* More Links Section 
        <li className="sidebar-item" onClick={() => toggleMenu('moreLinks')}>
          <div className="sidebar-link">
            <FileText size={20} /> <span>More Links</span>
          </div>
          {activeMenu === 'moreLinks' && (
            <ul className="submenu">
              <li className="submenu-item"><Link to="/News"><Edit size={18} /> News</Link></li>
            </ul>
          )}
        </li>*/}
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

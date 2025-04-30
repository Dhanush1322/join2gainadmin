import React from "react";
import "./Navbar.css";
import { FaSearch, FaUserCircle, FaBars } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="navbar">
      <div className="hamburger-menu" onClick={toggleSidebar}>
        <FaBars />
      </div>

     
      <h3>Admin Dashboard</h3>

      <div className="navbar-profile">
        <FaUserCircle className="profile-icon" />
      </div>
    </div>
  );
};

export default Navbar;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import DashboardPage from "./dashboard/pages/DashboardPage";
import AdminLogin from "./dashboard/adminlogin/AdminLogin";
const App = () => {
  return (
    <div className="app-container">
      <Router>
        
        <Routes>
        <Route path="/" element={<AdminLogin />} />
          <Route path="/Dashboard" element={<DashboardPage />} />
          
        </Routes>
       
      </Router>
    </div>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import DashboardPage from "./dashboard/pages/DashboardPage";
import AdminLogin from "./dashboard/adminlogin/AdminLogin";
import ChangePassword from "./dashboard/pages/ChangePassword";
import ViewMembers from "./dashboard/pages/ViewMembers";
import ViewPlan from "./dashboard/pages/ViewPlan";
import DeactivatedMember from "./dashboard/pages/DeactivatedMember";
import AwardAchivers from "./dashboard/pages/AwardAchivers";
import InvestmentRequst from "./dashboard/pages/InvestmentRequst";
import InvestmentHistory from "./dashboard/pages/InvestmentHistory";
import KycApproved from "./dashboard/pages/KycApproved";
import KycHistory from "./dashboard/pages/KycHistory";
import WithdrawRequst from "./dashboard/pages/WithdrawRequst";
import WithdrawHistory from "./dashboard/pages/WithdrawHistory";
import News from "./dashboard/pages/News";
import VieAllProfile from "./dashboard/pages/VieAllProfile";
import ViewAllDownline from "./dashboard/pages/ViewAllDownline";
import LevelInclomeList from "./dashboard/pages/LevelInclomeList";
import LevelIncomePaidList from "./dashboard/pages/LevelIncomePaidList";
import AddUser from "./dashboard/pages/AddUser";
import AddKyc from "./dashboard/pages/AddKyc";
import AddTopup from "./dashboard/pages/AddTopup";

const App = () => {
  return (
    <div className="app-container">
      <Router>
        
        <Routes>
        <Route path="/" element={<AdminLogin />} />
          <Route path="/Dashboard" element={<DashboardPage />} />
          <Route path="/AddUser" element={<AddUser />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/ViewMembers" element={<ViewMembers />} />
          <Route path="/ViewPlan/:id"  element={<ViewPlan />} />
          <Route path="/DeactivatedMember" element={<DeactivatedMember />} />
          <Route path="/AwardAchivers" element={<AwardAchivers />} />
          <Route path="/InvestmentRequst" element={<InvestmentRequst />} />
          <Route path="/InvestmentHistory" element={<InvestmentHistory />} />
          <Route path="/InvestmentHistory" element={<InvestmentHistory />} />
          <Route path="/KycApproved" element={<KycApproved />} />
          <Route path="/KycHistory" element={<KycHistory />} />
          <Route path="/WithdrawRequst" element={<WithdrawRequst />} />
          <Route path="/WithdrawHistory" element={<WithdrawHistory />} />
          <Route path="/News" element={<News />} />
          <Route path="/VieAllProfile/:id" element={<VieAllProfile />} />
          <Route path="/ViewAllDownline/:id" element={<ViewAllDownline />} />
          <Route path="/LevelInclomeList" element={<LevelInclomeList />} />
          <Route path="/LevelIncomePaidList" element={<LevelIncomePaidList />} />
          <Route path="/AddKyc" element={<AddKyc />} />
          <Route path="/AddTopup" element={<AddTopup />} />
        </Routes>
       
      </Router>
    </div>
  );
};

export default App;

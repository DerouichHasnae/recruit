import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaBuilding, FaClipboard, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">RecruitPro</h2>
      <ul className="sidebar-menu">
        <li><Link to=""><FaHome className="icon" /> Dashboard</Link></li>
        <li><Link to="total-registered"><FaClipboard className="icon" /> Total Registered Users</Link></li>
        <li><Link to="company"><FaBuilding className="icon" /> Gestion des recruteurs</Link></li>
        <li><Link to="pages"><FaClipboard className="icon" /> Pages</Link></li>
        <li><Link to="reports"><FaClipboard className="icon" /> Reports</Link></li>
      </ul>
      <div className="logout">
        <Link to="/logout"><FaSignOutAlt className="icon" /> Logout</Link>
      </div>
    </div>
  );
};

export default Sidebar;

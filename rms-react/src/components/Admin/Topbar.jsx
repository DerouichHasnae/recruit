import React from "react";
import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <div className="topbar">
      <h3>Welcome, Admin</h3>
      <div className="topbar-actions">
        <div className="action-item">
          <Link to="/notifications"><i className="fas fa-bell"></i></Link>
        </div>
        <div className="action-item">
          <Link to="/settings"><i className="fas fa-cog"></i></Link>
        </div>
        <div className="action-item">
          <Link to="/"><i className="fas fa-sign-out-alt"></i> Logout</Link>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

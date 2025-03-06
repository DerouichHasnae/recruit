import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaHome,  FaBriefcase, FaHistory, FaChartBar, FaUser, FaSearch } from "react-icons/fa";

const UserDashboard = () => {
   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
    const toggleProfileMenu = () => {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    };
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>CRMS</h2>
        <p className="status">🔵 Online</p>
        <nav>
          <ul>
            <li><Link to="/candidates-dashboard"><FaHome /> Dashboard</Link></li>
            <li className="profile-menu">
                        <div className="profile-menu-trigger" onClick={toggleProfileMenu}>
                              <FaUser style={{ marginRight: "8px" }} /> Profile ▼
                          </div>
                          {isProfileMenuOpen && (
                            <div className="profile-dropdown-menu">
                              <Link to="/candidates-dashboard/profile">Profil</Link> 
                              <Link to="/candidates-dashboard/edite-profile">Éditer le profil</Link>
                              <Link to="/candidates-dashboard/notification">Notifications</Link>
                              <div className="menu-divider" />
                              <Link to="/candidates-dashboard/gestion-cv">👥 Gestion de CV</Link>
                              <Link to="/candidates-dashboard/competence">📝 Compétences  </Link>
                              <Link to="/candidates-dashboard/experience">💼 Expériences Professionnelles </Link>

                        </div>
                        )}
            </li>
            <li><Link to="/candidates-dashboard/view-vacancies"><FaBriefcase /> View Vacancy</Link></li>
            <li><Link to="/candidates-dashboard/applied-history"><FaHistory /> History of Applied Jobs</Link></li>
            <li><Link to="/candidates-dashboard/reports"><FaChartBar /> Reports</Link></li>
            <li><Link to="/candidates-dashboard/search-jobs"><FaSearch /> Search Job</Link></li>
            <li><Link to="/" className="back-button">⬅ Back to Home</Link></li> 
          </ul>
        </nav>
      </aside>

      {/* Contenu principal avec Outlet pour afficher les composants dynamiquement */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;

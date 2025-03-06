import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaHome, FaBriefcase, FaUsers, FaChartBar, FaUser, FaSearch } from "react-icons/fa";

const RecruiterDashboard = () => {
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
            <li><Link to="/recruiter-dashboard"><FaHome /> Dashboard</Link></li>
            
            {/* Menu Profil avec gestion de l'affichage */}
            <li className="profile-menu">
            <div className="profile-menu-trigger" onClick={toggleProfileMenu}>
                  <FaUser style={{ marginRight: "8px" }} /> Profile ▼
              </div>
              {isProfileMenuOpen && (
                <div className="profile-dropdown-menu">
                  <Link to="/recruiter-dashboard/edit-profile">Éditer le profil</Link>
                  <Link to="/recruiter-dashboard/settings">Paramètres du compte</Link>
                  <Link to="/recruiter-dashboard/privacy">Confidentialité</Link>
                  <Link to="/recruiter-dashboard/notifications">Notifications</Link>
                  <Link to="/recruiter-dashboard/support">Support & Aide</Link>
                  <div className="menu-divider" />
                  <Link to="/recruiter-dashboard/team">👥 Gestion d'équipe</Link>
                  <Link to="/recruiter-dashboard/subscription">💎 Abonnement Premium</Link>
                </div>
              )}
            </li>
            <li><Link to="/recruiter-dashboard/publier-offre"><FaUsers /> Publier une offre</Link></li>
            <li><Link to="/recruiter-dashboard/offres-publiées"><FaBriefcase />Les offres publiées</Link></li>
            <li><Link to="/recruiter-dashboard/search-candidates"><FaSearch /> Search Candidates</Link></li>
            <li><Link to="/" className="back-button">⬅ Logout</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content with Outlet for dynamic component rendering */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterDashboard;

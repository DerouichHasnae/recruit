import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaHome, FaBriefcase, FaUsers, FaChartBar, FaSearch, FaCaretDown, FaUserEdit,  FaCog, FaShieldAlt, FaBell, FaQuestionCircle } from "react-icons/fa";

const RecruiterDashboard = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>CRMS</h2>
        <p className="status">🔵 Online</p>
        <nav>
          <ul>
            <li><Link to="/recruiter-dashboard"><FaHome /> Dashboard</Link></li>
            
            <li 
              className="profile-menu-item"
              onMouseEnter={() => setShowProfileMenu(true)}
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <div className="profile-link">
                <FaChartBar /> Profile <FaCaretDown />
              </div>
              
              {showProfileMenu && (
                <div className="profile-dropdown-menu">
                  <Link to="#" className="menu-item">
                    <FaUserEdit /> Éditer le profil
                  </Link>
                  <Link to="#" className="menu-item">
                    <FaCog /> Paramètres
                  </Link>
                  <Link to="#" className="menu-item">
                    <FaShieldAlt /> Confidentialité
                  </Link>
                  <div className="menu-divider" />
                  <Link to="#" className="menu-item">
                    <FaBell /> Notifications
                  </Link>
                  <Link to="#" className="menu-item">
                    <FaQuestionCircle /> Support
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link to="/recruiter-dashboard/publier-offre">
                <FaUsers /> Publier une offre
              </Link>
            </li>
            
            <li>
              <Link to="/recruiter-dashboard/offres-publiées">
                <FaBriefcase /> Offres publiées
              </Link>
            </li>
            
            <li>
              <Link to="/recruiter-dashboard/search-candidates">
                <FaSearch /> Candidats
              </Link>
            </li>

            <li>
              <Link to="/" className="back-button">
                ⬅ Déconnexion
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterDashboard;
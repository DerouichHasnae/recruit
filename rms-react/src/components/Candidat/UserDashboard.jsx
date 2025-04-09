import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaHome, FaBriefcase, FaHistory, FaChartBar, FaUser, FaSearch, FaBell } from "react-icons/fa";
import axios from "axios";

const UserDashboard = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [entretiens, setEntretiens] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleNotifMenu = () => setIsNotifOpen(!isNotifOpen);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      // Charger le nombre de notifications
      axios.get(`http://localhost:5001/notifications/candidat/${userId}/count`)
        .then(res => setNotificationCount(res.data.count))
        .catch(err => console.error("Erreur de chargement du compteur", err));

      // Charger les entretiens programmés
      axios.get(`http://localhost:5001/notifications/candidat/${userId}`)
        .then(res => setEntretiens(res.data))
        .catch(err => console.error("Erreur de chargement des entretiens", err));
    }
  }, [userId]);

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>CRMS</h2>

        {/* Statut + Notifications */}
        <div className="status-notification" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p className="status">🔵 Online</p><hr />
          <div className="notification-icon" style={{ position: "relative" }}>
            <FaBell size={20} onClick={toggleNotifMenu} style={{ cursor: "pointer" }} />
            {notificationCount > 0 && (
              <span className="notif-badge">{notificationCount}</span>
            )}

            {/* Menu déroulant de notifications */}
            {isNotifOpen && (
              <div className="notif-dropdown">
                <h4>Notification</h4>
                <ul className="notif-list">
                  {entretiens.slice(0, 5).map((entretien, i) => (
                    <li key={i}>
                      <div className="entretien-preview">
                        <strong>{entretien.offre.title}</strong>
                        <p>{formatDate(entretien.interviewDate)}</p>
                        <a 
                          href={entretien.interviewLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="zoom-link"
                        >
                          Lien Zoom
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link to="/candidates-dashboard/notification" className="view-all-link">
                  Tout afficher
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
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
                  <Link to="/candidates-dashboard/notification">Entretiens</Link>
                  <div className="menu-divider" />
                  <Link to="/candidates-dashboard/gestion-cv">👥 Gestion de CV</Link>
                  <Link to="/candidates-dashboard/competence">📝 Compétences</Link>
                  <Link to="/candidates-dashboard/experience">💼 Expériences Professionnelles</Link>
                </div>
              )}
            </li>
            <li><Link to="/candidates-dashboard/view-vacancies"><FaSearch /> Search Job</Link></li>
            <li><Link to="/candidates-dashboard/applied-history"><FaHistory /> Historique des candidatures</Link></li>
            <li><Link to="/candidates-dashboard/reports"><FaChartBar /> Rapports</Link></li>
            <li><Link to="/"><i className="fas fa-sign-out-alt"></i> Déconnexion</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
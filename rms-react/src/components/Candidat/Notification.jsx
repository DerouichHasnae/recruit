import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './notif.css';

const Notification = () => {
  const [entretiens, setEntretiens] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5001/notifications/candidat/${userId}`)
        .then(res => setEntretiens(res.data))
        .catch(err => console.error("Erreur de chargement", err));
    }
  }, [userId]);

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="notification-page">
      <h2>Les notifications </h2>
      
      <div className="entretiens-container">
        {entretiens.length === 0 ? (
          <div className="no-entretiens">
            <p>Aucun entretien programmé pour le moment.</p>
            <Link to="/candidates-dashboard/view-vacancies" className="browse-jobs">
              Parcourir les offres d'emploi
            </Link>
          </div>
        ) : (
          entretiens.map((entretien) => (
            <div key={entretien.id} className="entretien-card">
          
              <div className="entretien-header">
              <h3>{entretien.offre.title}</h3>
              <div className="status-actions">
                <button className="status-badges">
                  Accepter
                </button>
                <button className="status-badge">
                  Rejeter
                </button>
              </div>
            </div>
                          
              <div className="entretien-details">
                <div className="detail-item">
                  <span className="detail-label">Date :</span>
                  <span className="detail-value">{formatDate(entretien.interviewDate)}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Lien Zoom :</span>
                  <a 
                    href={entretien.interviewLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="zoom-link"
                  >
                    Rejoindre l'entretien
                  </a>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Description :</span>
                  <p className="offre-description">{entretien.offre.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostulationsOffre.css";

const PostulationsOffre = () => {
  const { offreId } = useParams();
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [selectedCandidature, setSelectedCandidature] = useState(null); // Ajoutez cette ligne

  const selectedCandidatureRef = useRef(null); // Référence pour stocker la candidature sélectionnée

  const STATUS = {
    PENDING: "en_attente",
    ACCEPTED: "acceptee",
    REJECTED: "rejetee"
  };

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/candidatures/${offreId}`);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();
        setCandidatures(result);
      } catch (error) {
        console.error('Erreur fetch:', error);
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCandidatures();
  }, [offreId]);
  const handleReject = async (candidature) => {
    try {
      const response = await fetch(`http://localhost:5001/api/candidatures/${candidature.id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setCandidatures(candidatures.map(c => 
          c.id === candidature.id ? {...c, status: STATUS.REJECTED} : c
        ));
        setNotificationMessage(`Candidature rejetée avec succès`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setNotificationMessage(errorData.error || "Erreur lors du rejet");
      }
    } catch (error) {
      console.error('Erreur:', error);
      setNotificationMessage("Erreur de connexion au serveur");
    }
  };

  const handleAccept = async (candidature) => {
    try {
      // 1. Mise à jour du statut via l'API
      const response = await fetch(`http://localhost:5001/api/candidatures/${candidature.id}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // 2. Mise à jour de l'état local
        const updatedCandidature = await response.json();
        setCandidatures(candidatures.map(c => 
          c.id === candidature.id ? updatedCandidature : c
        ));
        
        // 3. Stockage de la candidature sélectionnée
        selectedCandidatureRef.current = updatedCandidature;
        setShowInterviewModal(true);
        setNotificationMessage(`Candidature acceptée - Prêt à programmer l'entretien`);
      } else {
        const errorData = await response.json();
        setNotificationMessage(errorData.error || "Erreur lors de l'acceptation");
      }
    } catch (error) {
      console.error('Erreur:', error);
      setNotificationMessage("Erreur de connexion au serveur");
    }
  };
  const handleScheduleInterview = async () => {
    // Vérification renforcée
    if (!selectedCandidatureRef.current?.id) {
      setNotificationMessage("Erreur: Aucune candidature sélectionnée");
      return;
    }

    if (!interviewDate) {
      setNotificationMessage("Veuillez sélectionner une date");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/candidatures/${selectedCandidatureRef.current.id}/schedule-interview`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            interviewDate: new Date(interviewDate).toISOString(),
            zoomLink: zoomLink || "Lien à communiquer"
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur serveur");
      }

      const updated = await response.json();
      setCandidatures(candidatures.map(c => 
        c.id === updated.id ? updated : c
      ));
      
      setShowInterviewModal(false);
      setInterviewDate("");
      setZoomLink("");
      setNotificationMessage("Entretien programmé avec succès!");
    } catch (error) {
      console.error('Erreur:', error);
      setNotificationMessage(error.message || "Échec de la programmation");
    }
  };
  const getStatusDisplay = (status) => {
    switch(status) {
      case STATUS.PENDING: return "🟠 En attente";
      case STATUS.ACCEPTED: return "✅ Acceptée";
      case STATUS.REJECTED: return "❌ Rejetée";
      default: return status;
    }
  };

  return (
    <div className="postulations-container">
      <button onClick={() => navigate(-1)} className="btn-retour">
        &larr; Retour aux offres
      </button>
      
      <h2 className="title">📋 Liste des candidatures</h2>
      
      {notificationMessage && (
        <div className="notification-banner">
          {notificationMessage}
          <button onClick={() => setNotificationMessage("")} className="close-notification">
            ×
          </button>
        </div>
      )}
      
      {loading ? (
        <p className="message">Chargement des candidatures...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="table-responsive">
          {candidatures.length > 0 ? (
            <table className="candidatures-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>CV</th>
                  <th>Lettre</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidatures.map((candidature) => (
                  <tr key={candidature.id}>
                    <td>
                      {candidature.candidat?.profileImage ? (
                        <img 
                          src={`http://localhost:5001/${candidature.candidat.profileImage}`} 
                          alt="Profile" 
                          className="profile-img"
                        />
                      ) : (
                        <div className="profile-placeholder">👤</div>
                      )}
                    </td>
                    <td>{candidature.candidat?.fullName || candidature.fullName}</td>
                    <td>{candidature.email}</td>
                    <td>{candidature.phoneNumber}</td>
                    <td>
                      <a 
                        href={`http://localhost:5001/${candidature.cvFile}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-cv"
                      >
                        Voir CV
                      </a>
                    </td>
                    <td>
                      <button 
                        className="btn-motivation"
                        onClick={() => window.open(`http://localhost:5001/${candidature.coverLetter}`, '_blank')}
                      >
                        Voir lettre
                      </button>
                    </td>
                    <td>
                      {getStatusDisplay(candidature.status)}
                      {candidature.interviewDate && (
                        <div className="interview-info">
                          {new Date(candidature.interviewDate).toLocaleString()}
                        </div>
                      )}
                    </td>
                  <td className="actions-cell">
  {candidature.status === STATUS.PENDING && (
    <>
      <button 
        className="btn-accepter"
        onClick={() => handleAccept(candidature)}
      >
        Accepter
      </button>
      <button 
        className="btn-refuser"
        onClick={() => handleReject(candidature)}
      >
        Refuser
      </button>
    </>
  )}
  {candidature.status === STATUS.ACCEPTED && !candidature.interviewDate && (
    <button
      className="btn-programmer"
      onClick={() => {
        selectedCandidatureRef.current = candidature;
        setShowInterviewModal(true);
      }}
    >
      Programmer entretien
    </button>
  )}
  {candidature.status === STATUS.ACCEPTED && candidature.interviewDate && (
    <a 
      href={candidature.interviewLink || zoomLink} 
      target="_blank" 
      rel="noopener noreferrer"
      className="btn-interview"
    >
      Rejoindre entretien
    </a>
  )}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="message">Aucune candidature pour cette offre</p>
          )}
        </div>
      )}

      {showInterviewModal && (
        <div className="modal-overlay">
          <div className="decision-modal">
            <h3>Programmer un entretien</h3>
            <div className="form-group">
              <label>Date et heure:</label>
              <input 
                type="datetime-local" 
                value={interviewDate} 
                onChange={(e) => setInterviewDate(e.target.value)} 
                required
              />
            </div>
            <div className="form-group">
              <label>Lien visio:</label>
              <input
                type="url"
                placeholder="https://zoom.us/j/123456789"
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
              />
            </div>
            <div className="modal-buttons">
              <button onClick={handleScheduleInterview}>
                Confirmer
              </button>
              <button onClick={() => setShowInterviewModal(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostulationsOffre;
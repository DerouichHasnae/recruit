import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OffresPubliees.css"
const OffresPubliees = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const recruiterId = localStorage.getItem('userId');
        
        if (!recruiterId) {
          setError("Veuillez vous connecter pour voir vos offres");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5001/offre?recruiterId=${recruiterId}`);
        
        if (response.ok) {
          const result = await response.json();
          setOffres(result);
        } else {
          setError("Erreur lors de la récupération des offres");
        }
      } catch (error) {
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  return (
    <div className="offres-container">
      <h2 className="title">📢 Liste des offres publiées</h2>
      {loading ? (
        <p className="message">Chargement des offres...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="offres-list">
          {offres.length > 0 ? (
            offres.map((offre) => (
              <div key={offre.id} className="offre-card">
                <h3 className="offre-title">{offre.title}</h3>
               <p className="offre-description">{offre.description}</p>
                <div className="offre-details">
                  <p><strong>📍 Localisation:</strong> {offre.location}</p>
                  <p><strong>💰 Salaire:</strong> {offre.salary}</p>
                  <p><strong>👤 Recruteur:</strong> {offre.recruiterName}</p>
                  <p><strong>🗓 Date de publication:</strong> {new Date(offre.publicationDate).toLocaleDateString()}</p>
                  <p><strong>⏳ Date d'expiration:</strong> {new Date(offre.expirationDate).toLocaleDateString()}</p>
                </div>
                {/* Boutons Modifier et Supprimer */}
                <div className="offre-actions">
                    <button className="btn-modifier">Modifier</button>
                    <button className="btn-supprimer">Supprimer</button>
                    <button 
                      className="btn-modifier"
                      onClick={() => navigate(`/offres/${offre.id}/candidatures`)}
                    >
                      Voir les postulations
                    </button>
                </div>
              </div>
            ))
          ) : (
            <p className="message">Aucune offre disponible</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OffresPubliees;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AppliedHistory.css';

const AppliedHistory = () => {
  const navigate = useNavigate();
  const [appliedOffers, setAppliedOffers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedOffers = async () => {
      setLoading(true);
      setError(null);

      try {
        const userId = localStorage.getItem("userId");  // Récupérer l'ID du candidat depuis le localStorage

        if (!userId) {
          throw new Error("Veuillez vous reconnecter");
        }

        // Utilisation de l'ID du candidat dans l'URL de la requête
        const response = await fetch(`http://localhost:5001/api/applied-history/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 403) {
          throw new Error("Accès refusé");
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erreur ${response.status}: Impossible de récupérer les postulations`);
        }

        const data = await response.json();
        setAppliedOffers(data || []);
      } catch (err) {
        setError(err.message);
        console.error("Erreur lors de la récupération des postulations:", err);
        if (err.message.includes("Veuillez vous reconnecter")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedOffers();
  }, [navigate]);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (error) {
    return <div className="error-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="content-box">
      <h2> mes postulations</h2>
      <p>View your job application history.</p>
  
      {appliedOffers.length > 0 ? (
        <div>
          {appliedOffers.map((application) => (
            <div key={application.id} className="application-card">
            {application.offre ? (
              <>
                <h3>{application.offre.title}</h3>
                <p>{application.offre.description}</p>
                <p><strong>Lieu :</strong> {application.offre.location}</p>
                <p><strong>Salaire :</strong> {application.offre.salary}</p>
                <p>
  <strong>Statut :</strong>{" "}
  <span className="statuus">
  {application.status}
</span>
</p>

                <p><strong>Postulé le :</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
              </>
            ) : (
              <p>Offre non disponible</p>
            )}
          </div>
          
          ))}
        </div>
      ) : (
        <p>No job offers found for this candidate.</p>
      )}
    </div>
  );
  
};

export default AppliedHistory;

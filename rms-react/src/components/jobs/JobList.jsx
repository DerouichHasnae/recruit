import React, { useEffect, useState } from "react";
import Header from "../header/Nav";
import "./JobList.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOffres = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/offre/candidat?limit=10&page=${currentPage}`);
        if (response.ok) {
          const data = await response.json();
          setJobs(data.results);
          setTotalPages(data.totalPages);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Erreur lors de la récupération des données");
        }
      } catch (error) {
        setError("Erreur de connexion au serveur: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, [currentPage]);

  const handlePostuler = async (offreId) => {
    try {
      const response = await fetch("http://localhost:5000/candidatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ offreId }),
      });

      if (!response.ok) throw new Error("Échec de la candidature");
      alert("Candidature envoyée avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="job-container">
        <div className="filters-section">
          <h2>Filtrer les offres</h2>
          <div className="filter-group">
            <label>Ville</label>
            <select>
              <option>Toutes</option>
              <option>Casablanca</option>
              <option>Marrakech</option>
              <option>Rabat</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Type de contrat</label>
            <select>
              <option>Tous</option>
              <option>CDI</option>
              <option>CDD</option>
              <option>Freelance</option>
            </select>
          </div>
        </div>

        <div className="job-listings">
          <h1>Consultez {jobs.length} offres d'emploi actives</h1>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading-message">Chargement des offres...</div>
          ) : (
            <div className="all-jobs">
              {jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <h3>{job.title}</h3>
                  <div className="job-meta">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary} DH</span>
                    <span>🏢 {job.entreprise?.nom}</span>
                  </div>
                  <p className="job-description">{job.description}</p>
                  <div className="job-details">
                    <p><strong>Recruteur:</strong> {job.recruiterName || "Non spécifié"}</p>
                    <p><strong>Publié le:</strong> {new Date(job.publicationDate).toLocaleDateString()}</p>
                    <p><strong>Expire le:</strong> {new Date(job.expirationDate).toLocaleDateString()}</p>
                  </div>
                  <button className="apply-button" onClick={() => handlePostuler(job.id)}>
                    Postuler
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobList;
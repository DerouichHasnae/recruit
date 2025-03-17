import React, { useEffect, useState } from "react";
import Header from "../header/Nav";
import "./JobList.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState({
    title: "",
    location: "",
    skills: ""
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOffres = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: 10,
          title: search.title,
          location: search.location,
          skills: search.skills
        });

        const response = await fetch(`http://localhost:5001/offre/candidat?${params}`);
        
        if (response.ok) {
          const data = await response.json();
          setJobs(data.results);
          setTotalPages(data.totalPages);
        } else {
          throw new Error("Erreur lors de la récupération des données");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, [currentPage, search]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePostuler = async (offreId) => {
    try {
      const response = await fetch("http://localhost:5001/candidatures", {
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
      {/* Header */}
      <Header />

      {/* Barre de recherche fixe */}
      <div className="search-bar-container">
        <div className="search-bar">
          <div className="search-group">
            <input
              type="text"
              placeholder="Titre du poste..."
              value={search.title}
              onChange={(e) => setSearch({ ...search, title: e.target.value })}
            />
          </div>
          <div className="search-group">
            <input
              type="text"
              placeholder="Localisation..."
              value={search.location}
              onChange={(e) => setSearch({ ...search, location: e.target.value })}
            />
          </div>
          <div className="search-group">
            <input
              type="text"
              placeholder="Compétences requises..."
              value={search.skills}
              onChange={(e) => setSearch({ ...search, skills: e.target.value })}
            />
          </div>
          <button className="search-button" onClick={handleSearch}>
            Rechercher
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="main-content">
        <div className="job-container">
          <h1>Offres d'emploi disponibles</h1>

          {loading ? (
            <div className="loading-message">Chargement des offres...</div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <p className="job-description">{job.description}</p>
                <div className="job-meta">
                  <p><strong>📍 Localisation:</strong> {job.location}</p>
                  <p><strong>💰 Salaire:</strong> {job.salary} DH</p>
                  <p><strong>👤 Recruteur:</strong> {job.recruiterName}</p>
                  <p><strong>🗓 Date de publication:</strong> {new Date(job.publicationDate).toLocaleDateString()}</p>
                  <p><strong>⏳ Date d'expiration:</strong> {new Date(job.expirationDate).toLocaleDateString()}</p>
                </div>
                <button className="apply-button" onClick={() => handlePostuler(job.id)}>
                  Postuler
                </button>
              </div>
              ))}
            </div>
          )}

          {/* Pagination */}
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
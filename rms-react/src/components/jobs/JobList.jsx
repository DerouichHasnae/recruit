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
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchJobData = async (searchParams) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: 20,
        ...searchParams,
        sort: "-publicationDate"
      });

      const response = await fetch(`http://localhost:5001/offre/candidat?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data.results || data);
      } else {
        throw new Error("Erreur lors de la récupération des données");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobData(search);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobData(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search.title, search.location, search.skills]);

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

  const nextCards = () => {
    if (currentIndex < jobs.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCards = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleJobs = jobs.slice(currentIndex, currentIndex + 3);

  return (
    <>
      <Header />
      
      {/* Background animation */}
      <div className="animated-background">
        <div className="particles"></div>
        <div className="particles"></div>
        <div className="particles"></div>
      </div>

      {/* Barre de recherche */}
      <div className="search-hero">
        <div className="search-container">
          <h2>Trouvez l'emploi de vos rêves</h2>
          <div className="search-fields">
            <input
              type="text"
              placeholder="🔍 Métier, mots-clés..."
              value={search.title}
              onChange={(e) => setSearch({ ...search, title: e.target.value })}
              className="search-input"
            />
            <input
              type="text"
              placeholder="📍 Ville, région..."
              value={search.location}
              onChange={(e) => setSearch({ ...search, location: e.target.value })}
              className="search-input"
            />
            <button className="search-btn">Rechercher</button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="job-board">
        <h1 className="job-board-title">📢 Offres d'emploi récentes</h1>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des offres...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="no-results">
            <p>Aucune offre ne correspond à vos critères</p>
            <button onClick={() => {
              setSearch({ title: "", location: "", skills: "" });
              fetchJobData({});
            }}>Réinitialiser les filtres</button>
          </div>
        ) : (
          <div className="job-carousel-container">
            <button 
              className="carousel-nav prev" 
              onClick={prevCards}
              disabled={currentIndex === 0}
            >
              &lt;
            </button>
            
            <div className="job-carousel">
              {visibleJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <span className="job-badge">Offre de la semaine</span>
                    <span className="job-category">| {job.department || 'Général'} |</span>
                    <span className="job-location">{job.location}</span>
                  </div>
                  
                  <h3 className="job-title">{job.title}</h3>
                  
                  <div className="job-highlights">
                    <p>💰 {job.salary} DH + primes déplafonnées</p>
                    <p>🏖 Week-end off</p>
                    {job.contractType && <p>📝 {job.contractType}</p>}
                  </div>
                  
                  <div className="job-details">
                    <p><strong>Description:</strong> {job.description}</p>
                    <p><strong>👤Recruteur:</strong> {job.recruiterName}</p>
                    <p><strong>🗓Publiée le:</strong> {new Date(job.publicationDate).toLocaleDateString()}</p>
                    <p><strong>⏳Expire le:</strong> {new Date(job.expirationDate).toLocaleDateString()}</p>
                  </div>
                  
                  <button 
                    className="apply-now-btn"
                    onClick={() => handlePostuler(job.id)}
                  >
                    Postuler maintenant
                  </button>
                </div>
              ))}
            </div>

            <button 
              className="carousel-nav next" 
              onClick={nextCards}
              disabled={currentIndex >= jobs.length - 3}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default JobList;
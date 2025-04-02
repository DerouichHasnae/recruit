import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewVacancies.css";

const ViewVacancies = () => {
  const [recommendedOffres, setRecommendedOffres] = useState([]);
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [skillsSearchTerm, setSkillsSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendedOffres = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          throw new Error("Veuillez vous reconnecter");
        }

        const response = await fetch(`http://localhost:5001/api/recommendations/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 403) {
          throw new Error("Accès réservé aux candidats");
        }

        if (!response.ok) {
          throw new Error("Erreur serveur");
        }

        const data = await response.json();
        const offres = data.recommendations || data || [];
        setRecommendedOffres(offres);
        setFilteredOffres(offres);

      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message);
        if (err.message.includes("Veuillez vous reconnecter")) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedOffres();
  }, [navigate]);

  useEffect(() => {
    // Filtrer les offres lorsque les termes de recherche changent
    const filtered = recommendedOffres.filter(offre => {
      // Gestion sécurisée des propriétés potentiellement undefined
      const title = offre.title || "";
      const companyName = offre.company?.name || "";
      const description = offre.description || "";
      const skills = Array.isArray(offre.matching_skills) ? offre.matching_skills.join(" ").toLowerCase() : "";
      
      const matchesTitleSearch = titleSearchTerm === "" || 
        title.toLowerCase().includes(titleSearchTerm.toLowerCase()) ||
        companyName.toLowerCase().includes(titleSearchTerm.toLowerCase()) ||
        description.toLowerCase().includes(titleSearchTerm.toLowerCase());
      
      const matchesSkillsSearch = skillsSearchTerm === "" || 
        skills.includes(skillsSearchTerm.toLowerCase());
      
      return matchesTitleSearch && matchesSkillsSearch;
    });
    
    setFilteredOffres(filtered);
  }, [titleSearchTerm, skillsSearchTerm, recommendedOffres]);

  const formattedOffres = filteredOffres.map(offre => ({
    id: offre.offre_id || offre.id || '',
    title: offre.title || "Titre non spécifié",
    company: offre.company?.name || "Entreprise inconnue",
    skills: Array.isArray(offre.matching_skills) ? offre.matching_skills.filter(Boolean) : [],
    description: offre.description || "",
    location: offre.location || "Non précisé",
    salary: offre.salary || "Non communiqué",
    date: offre.publicationDate ? new Date(offre.publicationDate) : null
  }));

  const handlePostuler = (offreId) => {
    navigate(`/postuler/${offreId}`);
  };

  const clearFilters = () => {
    setTitleSearchTerm("");
    setSkillsSearchTerm("");
  };

  // Fonction pour grouper les offres par paires
  const groupOffresInPairs = () => {
    const pairs = [];
    for (let i = 0; i < formattedOffres.length; i += 2) {
      pairs.push(formattedOffres.slice(i, i + 2));
    }
    return pairs;
  };

  const offresPairs = groupOffresInPairs();

  return (
    <div className="view-vacancies-container">
      <h2>Offres recommandées pour vous</h2>
      
      {/* Barres de recherche */}
      <div className="search-filter-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher par titre..."
            value={titleSearchTerm}
            onChange={(e) => setTitleSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher par compétences demandées..."
            value={skillsSearchTerm}
            onChange={(e) => setSkillsSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className="clear-filters"
          onClick={clearFilters}
          disabled={!titleSearchTerm && !skillsSearchTerm}
        >
          Réinitialiser
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement en cours...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button 
            className="apply-button"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      ) : formattedOffres.length > 0 ? (
        <>
          
          
          <div className="offres-container">
            {offresPairs.map((pair, index) => (
              <div key={index} className="offre-pair">
                {pair.map(offre => (
                  <div key={offre.id} className="offre-card">
                    <div className="offre-header">
                      <h3>{offre.title}</h3>
                      <span className="company">{offre.company}</span>
                    </div>
                    
                    {offre.skills.length > 0 && (
                      <div className="match-info">
                        <div className="skills-list">
                          {offre.skills.map((skill, i) => (
                            <span key={i} className="skill">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="description">{offre.description}</p>
                    
                    <div className="offre-details">
                      <div>
                        <span>📍 {offre.location}</span>
                        <span>💰 {offre.salary}</span>
                      </div>
                      {offre.date && (
                        <span>🗓 {offre.date.toLocaleDateString()}</span>
                      )}
                    </div>
                    
                    <button 
                      className="apply-button"
                      onClick={() => handlePostuler(offre.id)}
                    >
                      Postuler
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-results">
          <p>Aucune offre ne correspond à vos critères de recherche.</p>
          {(titleSearchTerm || skillsSearchTerm) && (
            <button 
              className="apply-button"
              onClick={clearFilters}
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewVacancies;
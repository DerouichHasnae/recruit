import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchCandidates.css';
import defaultProfile from '../../assets/images/3.jpeg';
const SearchCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minScore, setMinScore] = useState(0.3);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          throw new Error("Veuillez vous reconnecter");
        }

        const response = await fetch(`http://localhost:5001/api/candidates/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 403) {
          throw new Error("Accès refusé");
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erreur ${response.status}: Impossible de récupérer les candidats`);
        }

        const data = await response.json();
        setCandidates(data.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors de la récupération des candidats:', err);
        if (err.message.includes("Veuillez vous reconnecter")) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [navigate]);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          candidate.skills?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScore = candidate.match_score >= minScore;
    return matchesSearch && matchesScore;
  });

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (error) {
    return <div className="error-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="candidates-container">
      <h2 className="title">Candidats recommandés</h2>
      
      <div className="filters-container">
        <input
          type="text"
          placeholder="Rechercher par  compétences"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
    
        
        <button className="reset-button" onClick={() => {
          setSearchTerm('');
          setMinScore(0.3);
        }}>Réinitialiser</button>
      </div>
      
      {filteredCandidates.length === 0 ? (
        <p className="no-results">Aucun candidat trouvé</p>
      ) : (
        <div className="candidates-grid">
          {filteredCandidates.map(candidate => (
            <div className="candidate-card" key={candidate.candidat_id}>
              <div className="candidate-header">
              <img
  src={defaultProfile}
  alt="Photo de profil par défaut"
  className="profile-image"
/>


               
                <div>
                  <h3>{candidate.fullName || 'Nom inconnu'}</h3>
                  <p className="location">{candidate.location || 'Localisation non spécifiée'}</p>
                </div>
              </div>
              
            
              
              <hr className="divider" />
              
              <div className="skills-section">
                <p className="section-title">Compétences correspondantes:</p>
                <div className="skills-tags">
                  {candidate.matching_skills && candidate.matching_skills.length > 0 ? (
                    candidate.matching_skills.map((skill, i) => <span className="skill-tag" key={i}>{skill}</span>)
                  ) : (
                    <p>Aucune compétence correspondante</p>
                  )}
                </div>
              </div>
              
              <div className="all-skills">
                <p className="section-title">Toutes les compétences:</p>
                <p>{candidate.skills || 'Non spécifiées'}</p>
              </div>
              
              <div className="contact-button-container">
                <button className="contact-button">Contacter</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCandidates;
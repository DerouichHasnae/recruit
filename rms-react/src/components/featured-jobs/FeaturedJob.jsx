import React, { useEffect, useState } from "react";
import FeaturedJobItem from "./featuredJobItem";
import axios from "axios";
import "./FeaturedJob.css"; 

const FeaturedJob = ({ candidatId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/recommendations/${candidatId}`
        );
        setRecommendations(response.data.recommendations);
      } catch (err) {
        console.error("Erreur API :", err);
        setError("Impossible de charger les recommandations");
      } finally {
        setLoading(false);
      }
    };

    if (candidatId) fetchRecommendations();
  }, [candidatId]);

  if (loading) return <div className="loading-spinner">Chargement...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="featured-jobs-container">
      <h2 className="recommendations-title">Offres recommandées</h2>
      
      {recommendations.length > 0 ? (
        <div className="jobs-grid">
          {recommendations.map((job) => (
            <FeaturedJobItem
              key={job.id}
              id={job.id}
              title={job.title}
              location={job.location}
              salary={job.salary}
              companyName={job.company.name}
              matchScore={job.matchScore}
              matchingSkills={job.matchingSkills}
              publicationDate={new Date(job.publicationDate).toLocaleDateString()}
            />
          ))}
        </div>
      ) : (
        <p className="no-results">Aucune offre recommandée trouvée</p>
      )}
    </div>
  );
};

export default FeaturedJob;
import React from "react";
import { Link } from "react-router-dom";

const featuredJobItem = ({   id,
  title,
  location,
  salary,
  companyName,
  matchScore,
  matchingSkills,
  publicationDate
}) => {
  return (
    <div className="job-card">
      <div className="job-header">
        <h3>{title}</h3>
        <span className="company-name">{companyName}</span>
      </div>
      
      <div className="job-details">
        <p><strong>Localisation :</strong> {location}</p>
        <p><strong>Salaire :</strong> {salary}</p>
        <p><strong>Publié le :</strong> {publicationDate}</p>
      </div>
      
      <div className="match-info">
        <div className="match-score">
          <span>Correspondance : {matchScore} compétences</span>
        </div>
        {matchingSkills.length > 0 && (
          <div className="skills-list">
            <strong>Compétences correspondantes :</strong>
            <ul>
              {matchingSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <Link to={`/offres/${id}`} className="view-job-link">
        Voir l'offre
      </Link>
    </div>
  );
};
export default featuredJobItem;

import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div id="about-us" className="about-container"> 
      <div className="about-header">
        <h1>À Propos de <span className="highlight">RecruitPro</span></h1>
        <p className="subtitle">Votre partenaire stratégique en recrutement digital</p>
      </div>

      <div className="about-content">
        <div className="mission-section">
          <div className="mission-card">
            <h2>Notre Mission</h2>
            <p>
              Transformer le recrutement grâce à une technologie intelligente qui connecte 
              les talents exceptionnels aux entreprises innovantes. Notre plateforme 
              révolutionne le processus de recrutement avec des algorithmes avancés et 
              une approche humaine.
            </p>
          </div>

          <div className="values-card">
            <h2>Nos Valeurs</h2>
            <ul>
              <li>
                <span className="icon">✓</span>
                <span className="value-item">Transparence totale dans le processus</span>
              </li>
              <li>
                <span className="icon">✓</span>
                <span className="value-item">Innovation continue</span>
              </li>
              <li>
                <span className="icon">✓</span>
                <span className="value-item">Respect des candidats</span>
              </li>
              <li>
                <span className="icon">✓</span>
                <span className="value-item">Approche data-driven</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <h3>+2500</h3>
            <p>Entreprises partenaires</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Satisfaction clients</p>
          </div>
          <div className="stat-item">
            <h3>+50k</h3>
            <p>Candidats placés</p>
          </div>
        </div>

        <div className="team-section">
          <h2>Notre Équipe</h2>
          <p>
            Une équipe pluridisciplinaire combinant expertise RH et excellence technique.
            Fondateurs issus des leaders du secteur, nous mettons notre expérience à votre service.
          </p>
        </div>

        <div className="quote-section">
          <blockquote>
            "Donner à chaque talent l'opportunité de briller et à chaque entreprise 
            la chance de trouver ses perles rares."
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
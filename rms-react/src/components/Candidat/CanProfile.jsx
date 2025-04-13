import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CanProfile.css"; // Assurez-vous d'avoir un bon style CSS

const CanProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId"); // Vérifie si l'ID est stocké
      if (!userId) {
        setError("User ID is not found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/candidat/profile", {
          params: { userId: userId },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
        setError("Erreur lors du chargement du profil. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="loading">Chargement du profil...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!profile) {
    return <div className="error">Impossible de charger le profil.</div>;
  }

  return (
    <div className="profile-container">
      {/* 🟢 Header du Profil */}
      <div className="profile-header">
        <img
          src={
            profile.profileImage
              ? `http://localhost:5001/${profile.profileImage}`
              : "https://via.placeholder.com/150"
          }
          alt={`Photo de profil de ${profile.fullName}`}
          className="profile-picture"
        />
        <h2>{profile.fullName}</h2>
        <p className="email">{profile.email}</p>
      </div>

      {/* 🟢 Informations personnelles */}
      <div className="profile-details">
        <p>
          <strong>📍 Adresse :</strong> {profile.address}
        </p>
        <p>
          <strong>📞 Téléphone :</strong> {profile.phoneNumber}
        </p>
        <p>
          <strong>🎓 Âge :</strong> {profile.age}
        </p>
        <p>
          <strong>🎯 Genre :</strong> {profile.gender}
        </p>
      </div>

      {/* 🟢 Section Compétences */}
      <div className="section">
        <h3>📝 Compétences</h3>
        {profile.skills ? (
          <ul>
            {profile.skills.split(",").map((skill, index) => (
              <li key={index}>{skill.trim()}</li> // Utilisez trim() pour supprimer les espaces inutiles
            ))}
          </ul>
        ) : (
          <p>Aucune compétence ajoutée pour le moment.</p>
        )}
        <Link to="/candidates-dashboard/competence" className="btn">
          Ajouter mes compétences
        </Link>
      </div>

      {/* 🟢 Section Expériences */}
      <div className="section">
        <h3>💼 Expériences Professionnelles</h3>
        <p>Aucune expérience ajoutée pour le moment.</p>
        <Link to="/candidates-dashboard/experience" className="btn">
          Ajouter mes expériences
        </Link>
      </div>
            {/* 🟢 Bouton Éditer le profil */}
            <div className="edit-profile-container">
        <Link to="/candidates-dashboard/edit-profile" className="btn edit-btn">
          ✏️ Éditer le profil
        </Link>
      </div>

    </div>
    
    
  );
};

export default CanProfile;
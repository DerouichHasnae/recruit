import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CanProfile.css"; // Assurez-vous d'avoir un bon style CSS

const CanProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId"); // Vérifie si l'ID est stocké
      if (!userId) {
        console.error("User ID is not found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/candidat/profile", {
          params: { userId: userId },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="loading">Chargement du profil...</div>;
  }

  if (!profile) {
    return <div className="error">Impossible de charger le profil.</div>;
  }

  return (
    <div className="profile-container">
      {/* 🟢 Header du Profil */}
      <div className="profile-header">
        <img
          src={profile.profileImage ? `http://localhost:5000/${profile.profileImage}` : "/default-avatar.png"}
          alt={`Photo de profil de ${profile.fullName}`}
          className="profile-picture"
        />
        <h2>{profile.fullName}</h2>
        <p className="email">{profile.email}</p>
      </div>

      {/* 🟢 Informations personnelles */}
      <div className="profile-details">
        <p><strong>📍 Adresse :</strong> {profile.address}</p>
        <p><strong>📞 Téléphone :</strong> {profile.phoneNumber}</p>
        <p><strong>🎓 Âge :</strong> {profile.age}</p>
        <p><strong>🎯 Genre :</strong> {profile.gender}</p>
      </div>

      {/* 🟢 Section Compétences */}
      <div className="section">
        <h3>📝 Compétences</h3>
        <p>Aucune compétence ajoutée pour le moment.</p>
        <Link to="/candidates-dashboard/competence" className="btn">Ajouter mes compétences</Link>
      </div>

      {/* 🟢 Section Expériences */}
      <div className="section">
        <h3>💼 Expériences Professionnelles</h3>
        <p>Aucune expérience ajoutée pour le moment.</p>
        <Link to="/candidates-dashboard/experience" className="btn">Ajouter mes expériences</Link>
      </div>
    </div>
  );
};

export default CanProfile;

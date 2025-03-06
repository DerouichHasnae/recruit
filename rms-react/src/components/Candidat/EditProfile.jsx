// src/candidat/EditProfile.js
import React, { useState } from "react";

const EditProfile = () => {
  // State pour stocker les informations du profil
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Gérer l'envoi du formulaire (simulé ici)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Vérifier que les mots de passe correspondent
    if (profile.password !== profile.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    // Afficher un message de succès ou envoyer les données à l'API
    alert("Profil mis à jour !");
    // Ici tu pourrais ajouter un appel API pour envoyer les informations du profil
  };

  return (
    <div className="edit-profile-container">
      <h2>Éditer votre profil</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="firstName">Prénom</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            placeholder="Entrez votre prénom"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Nom</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            placeholder="Entrez votre nom"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Entrez votre email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={profile.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmez votre mot de passe"
            required
          />
        </div>

        <div className="form-group">
          <button type="submit">Sauvegarder les modifications</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

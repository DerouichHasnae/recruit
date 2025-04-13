import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import"./rec.css";
const SignUpRecruteur = () => {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    companyName: "",
    companyUrl: "",
    companyAddress: "",
    phoneNumber: "",
    countryCode: "+212",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/recruteur/signup", 
        values
      );

      // Stockage de l'ID et redirection
      if (response.data.recruteur?.id) {
        localStorage.setItem("recruiterId", response.data.recruteur.id);
        alert("Inscription réussie ! 🎉");
        navigate("/recruiter-dashboard");
      }
      
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert(
        error.response?.data?.error || 
        "Erreur de connexion au serveur ❌"
      );
    }
  };

  // Le return reste inchangé comme demandé
 return (
  <div className="recruiter-auth-container">
    <div className="recruiter-auth-box">
      <h2 className="recruiter-auth-title">Inscription Recruteur</h2>
      
      <form onSubmit={handleSubmit} className="recruiter-auth-form">
        <div className="recruiter-form-row">
          <div className="recruiter-form-group">
            <label className="recruiter-form-label">Nom Complet</label>
            <input
              type="text"
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              className="recruiter-form-input"
              required
              placeholder="Jean Dupont"
            />
          </div>

          <div className="recruiter-form-group">
            <label className="recruiter-form-label">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="recruiter-form-input"
              required
              placeholder="contact@votresociete.com"
            />
          </div>
        </div>

        <div className="recruiter-form-row">
          <div className="recruiter-form-group">
            <label className="recruiter-form-label">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="recruiter-form-input"
              required
              placeholder="••••••••"
            />
          </div>

          <div className="recruiter-form-group">
            <label className="recruiter-form-label">Nom de l'entreprise</label>
            <input
              type="text"
              name="companyName"
              value={values.companyName}
              onChange={handleChange}
              className="recruiter-form-input"
              required
              placeholder="Ma Société SAS"
            />
          </div>
        </div>

        <div className="recruiter-form-row">
          <div className="recruiter-form-group">
            <label className="recruiter-form-label">URL du site</label>
            <input
              type="url"
              name="companyUrl"
              value={values.companyUrl}
              onChange={handleChange}
              className="recruiter-form-input"
              required
              placeholder="https://www.masociete.com"
            />
          </div>

          <div className="recruiter-form-group">
            <label className="recruiter-form-label">Adresse</label>
            <input
              type="text"
              name="companyAddress"
              value={values.companyAddress}
              onChange={handleChange}
              className="recruiter-form-input"
              required
              placeholder="123 Rue des Entreprises, Paris"
            />
          </div>
        </div>

        <div className="recruiter-form-row">
          <div className="recruiter-form-group phone-group">
            <label className="recruiter-form-label">Téléphone</label>
            <div className="phone-input-container">
              <select
                name="countryCode"
                value={values.countryCode}
                onChange={handleChange}
                className="country-code-select"
              >
                <option value="+212">+212 (Maroc)</option>
                <option value="+33">+33 (France)</option>
                <option value="+1">+1 (USA/Canada)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+91">+91 (Inde)</option>
                <option value="+61">+61 (Australie)</option>
              </select>
              <input
                type="tel"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                className="phone-number-input"
                required
                placeholder="612345678"
              />
            </div>
          </div>
          
          <div className="recruiter-form-group">
            {/* Espace vide pour alignement ou champ supplémentaire */}
          </div>
        </div>

        <button type="submit" className="recruiter-submit-btn">
          S'inscrire
        </button>
      </form>

      <p className="recruiter-auth-footer">
        Vous avez déjà un compte ? <a href="/sign-in" className="recruiter-auth-link">Connectez-vous</a>
      </p>
    </div>
  </div>
);
};

export default SignUpRecruteur;
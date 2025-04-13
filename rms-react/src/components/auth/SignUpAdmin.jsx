import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ad.css";
const SignUpAdmin = () => {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
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
      const res = await axios.post("http://localhost:5000/admin/signup", values);
      alert(res.data.message);
      navigate("/sign-in");
    } catch (err) {
      alert(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-box">
        <h2 className="admin-auth-title">Inscription Administrateur</h2>
        
        <form onSubmit={handleSubmit} className="admin-auth-form">
          <div className="admin-form-group">
            <label className="admin-form-label">Nom Complet</label>
            <input
              type="text"
              name="fullName"
              onChange={handleChange}
              className="admin-form-input"
              required
              placeholder="Jean Dupont"
            />
          </div>
  
          <div className="admin-form-group">
            <label className="admin-form-label">Email Professionnel</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="admin-form-input"
              required
              placeholder="admin@votredomaine.com"
            />
          </div>
  
          <div className="admin-form-group">
            <label className="admin-form-label">Mot de passe</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="admin-form-input"
              required
              placeholder="••••••••"
            />
            <p className="admin-form-hint">Minimum 8 caractères avec chiffres et caractères spéciaux</p>
          </div>
  
          <div className="admin-form-group">
            <label className="admin-form-label">Numéro de Téléphone</label>
            <div className="admin-phone-input-container">
              <select
                name="countryCode"
                onChange={handleChange}
                className="admin-country-code-select"
                defaultValue="+33"
              >
                <option value="+33">+33 (France)</option>
                <option value="+212">+212 (Maroc)</option>
                <option value="+1">+1 (USA/Canada)</option>
                <option value="+44">+44 (UK)</option>
              </select>
              <input
                type="tel"
                name="phoneNumber"
                onChange={handleChange}
                className="admin-phone-number-input"
                required
                placeholder="612345678"
              />
            </div>
          </div>
  
          <div className="admin-form-group admin-form-checkbox">
            <input
              type="checkbox"
              id="admin-terms"
              name="terms"
              required
              className="admin-checkbox-input"
            />
            <label htmlFor="admin-terms" className="admin-checkbox-label">
              Je certifie être autorisé à créer un compte administrateur
            </label>
          </div>
  
          <button type="submit" className="admin-submit-btn">
            Créer le compte Admin
          </button>
        </form>
  
        <p className="admin-auth-footer">
          Vous avez déjà un compte ? <a href="/sign-in" className="admin-auth-link">Connectez-vous</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpAdmin;

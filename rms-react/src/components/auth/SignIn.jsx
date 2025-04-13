import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserShield, FaUserTie, FaUserGraduate, FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";
import "./sign.css"
const SignIn = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(`http://localhost:5001/${role}/signin`, values);
  
      console.log("Réponse du serveur :", res.data);
  
      if (!res.data) {
        throw new Error("Réponse du serveur vide");
      }
  
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      } else {
        console.warn("⚠️ Aucun token reçu !");
      }
  
      let user;
      if (role === "admin") {
        user = res.data.admin;
      } else if (role === "recruteur") {
        user = res.data.recruteur;
      } else if (role === "candidat") {
        user = res.data.candidat;
      }
  
      if (!user || !user.id) {
        throw new Error(`ID utilisateur introuvable pour le rôle ${role}`);
      }
  
      localStorage.setItem("userId", user.id);
      alert(`Login successful as ${role}!`);
  
      const dashboardRoutes = {
        admin: "/admin-dashboard",
        recruteur: "/recruiter-dashboard",
        candidat: "/candidates-dashboard",
      };
      
      navigate(dashboardRoutes[role] || "/");
    } catch (err) {
      console.error("❌ Erreur de connexion :", err);
      alert(err.response?.data?.error || err.message || "Une erreur est survenue");
    }
  };
  
  return (
    <div className="auth-signin-container">
      <div className="auth-signin-card">
        <div className="auth-signin-header">
          <h2 className="auth-signin-title">Connexion</h2>
          <p className="auth-signin-subtitle">Connectez-vous à votre espace</p>
        </div>
        
        {/* Sélecteur de rôle */}
        <div className="auth-signin-role-selector">
          <label className={`auth-signin-role-option ${role === "admin" ? "active" : ""}`}>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
              className="auth-signin-role-input"
            />
            <div className="auth-signin-role-content">
              <FaUserShield className="auth-signin-role-icon" />
              <span>Admin</span>
            </div>
          </label>
          
          <label className={`auth-signin-role-option ${role === "recruteur" ? "active" : ""}`}>
            <input
              type="radio"
              name="role"
              value="recruteur"
              checked={role === "recruteur"}
              onChange={() => setRole("recruteur")}
              className="auth-signin-role-input"
            />
            <div className="auth-signin-role-content">
              <FaUserTie className="auth-signin-role-icon" />
              <span>Recruteur</span>
            </div>
          </label>
          
          <label className={`auth-signin-role-option ${role === "candidat" ? "active" : ""}`}>
            <input
              type="radio"
              name="role"
              value="candidat"
              checked={role === "candidat"}
              onChange={() => setRole("candidat")}
              className="auth-signin-role-input"
            />
            <div className="auth-signin-role-content">
              <FaUserGraduate className="auth-signin-role-icon" />
              <span>Candidat</span>
            </div>
          </label>
        </div>

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="auth-signin-form">
          <div className="auth-signin-input-group">
            <FaEnvelope className="auth-signin-input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              onChange={handleChange}
              required
              className="auth-signin-input"
            />
          </div>
          
          <div className="auth-signin-input-group">
            <FaLock className="auth-signin-input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              onChange={handleChange}
              required
              className="auth-signin-input"
            />
          </div>
          
          <button type="submit" className="auth-signin-submit-btn">
            <FaSignInAlt className="auth-signin-btn-icon" />
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
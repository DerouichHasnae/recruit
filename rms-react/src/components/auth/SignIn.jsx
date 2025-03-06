import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [role, setRole] = useState("admin"); // Par défaut, admin
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(`http://localhost:5000/${role}/signin`, values);
  
      console.log("Réponse du serveur :", res.data); // 🔍 Debugging
  
      if (!res.data) {
        throw new Error("Réponse du serveur vide");
      }
  
      // Stocker le token si présent
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      } else {
        console.warn("⚠️ Aucun token reçu !");
      }
  
      // Récupérer l'ID utilisateur en fonction du rôle
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
  
      // Redirection selon le rôle
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
    <div className="auth-container">
      <h2>Sign In</h2>
      
      {/* Sélecteur de rôle */}
      <div className="role-selector">
        <label>
          <input
            type="radio"
            name="role"
            value="admin"
            checked={role === "admin"}
            onChange={() => setRole("admin")}
          />
          Admin
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="recruteur"
            checked={role === "recruteur"}
            onChange={() => setRole("recruteur")}
          />
          Recruteur
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="candidat"
            checked={role === "candidat"}
            onChange={() => setRole("candidat")}
          />
          Candidat
        </label>
      </div>

      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default SignIn;

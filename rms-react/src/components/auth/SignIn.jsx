import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaUserShield, FaUserTie, FaUser } from "react-icons/fa";
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

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      let user;
      if (role === "admin") user = res.data.admin;
      else if (role === "recruteur") user = res.data.recruteur;
      else if (role === "candidat") user = res.data.candidat;

      if (!user?.id) throw new Error("ID utilisateur introuvable");

      localStorage.setItem("userId", user.id);
      alert(`Login successful as ${role}!`);

      const dashboardRoutes = {
        admin: "/admin-dashboard",
        recruteur: "/recruiter-dashboard",
        candidat: "/candidates-dashboard",
      };
      navigate(dashboardRoutes[role] || "/");
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Erreur inconnue");
    }
  };

  return (
    <div className="signin-background">
      <div className="auth-container glass-card">
        <h2>Se connecter</h2>

        <div className="role-selector">
          <label>
            <FaUserShield />{" "}
            <input type="radio" name="role" value="admin" checked={role === "admin"} onChange={() => setRole("admin")} />
            Admin
          </label>
          <label>
            <FaUserTie />{" "}
            <input type="radio" name="role" value="recruteur" checked={role === "recruteur"} onChange={() => setRole("recruteur")} />
            Recruteur
          </label>
          <label>
            <FaUser />{" "}
            <input type="radio" name="role" value="candidat" checked={role === "candidat"} onChange={() => setRole("candidat")} />
            Candidat
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
          </div>
          <button type="submit">Connexion</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

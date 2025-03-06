import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div className="auth-container">
      <h2>Sign Up Recruteur</h2>
      <form onSubmit={handleSubmit}>
        <div className="column">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="column">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="column">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="column">
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={values.companyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="column">
          <label>Company URL:</label>
          <input
            type="url"
            name="companyUrl"
            value={values.companyUrl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="column">
          <label>Company Address:</label>
          <input
            type="text"
            name="companyAddress"
            value={values.companyAddress}
            onChange={handleChange}
            required
          />
        </div>

        <div className="column">
          <label>Phone Number:</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <select
              name="countryCode"
              value={values.countryCode}
              onChange={handleChange}
            >
              <option value="+212">+212 (Morocco)</option>
              <option value="+1">+1 (USA, Canada)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+33">+33 (France)</option>
              <option value="+91">+91 (India)</option>
              <option value="+61">+61 (Australia)</option>
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/sign-in">Sign In</a></p>
    </div>
  );
};

export default SignUpRecruteur;
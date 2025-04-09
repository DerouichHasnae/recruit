import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./re.css";

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

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up Recruteur</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="two-inputs-group">
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={values.companyName}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>Company URL:</label>
          <input
            type="url"
            name="companyUrl"
            value={values.companyUrl}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>Company Address:</label>
          <input
            type="text"
            name="companyAddress"
            value={values.companyAddress}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <div className="phone-input-group">
            <select
              name="countryCode"
              value={values.countryCode}
              onChange={handleChange}
              className="select-country"
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
              className="phone-input"
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button">Register</button>
      </form>
      <p className="signin-link">
        Already have an account? <a href="/sign-in">Sign In</a>
      </p>
    </div>
  );
};

export default SignUpRecruteur;

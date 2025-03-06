import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ApplyForm.css";
const ApplyForm = () => {
  const { offreId } = useParams(); // Récupérer l'ID de l'offre depuis l'URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    coverLetter: "",
    cvFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cvFile") {
      setFormData({ ...formData, cvFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("offreId", offreId);
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("coverLetter", formData.coverLetter);
    formDataToSend.append("cvFile", formData.cvFile);

    try {
      const response = await fetch("http://localhost:5000/candidatures", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la candidature");
      }

      alert("Candidature envoyée avec succès !");
      navigate("/offres"); // Rediriger vers la liste des offres après soumission
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-form-container">
      <h2>Postuler pour cette offre</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom complet</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Téléphone</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Lettre de motivation</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>CV (PDF uniquement)</label>
          <input
            type="file"
            name="cvFile"
            accept=".pdf"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Envoi en cours..." : "Soumettre ma candidature"}
        </button>
      </form>
    </div>
  );
};

export default ApplyForm;
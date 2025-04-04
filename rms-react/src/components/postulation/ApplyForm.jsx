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

  // Dans handleChange
const handleChange = (e) => {
  const { name, value, files } = e.target;
  
  if (name === 'cvFile' || name === 'coverLetter') {
    if (files[0]?.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont acceptés');
      return;
    }
    setFormData({ ...formData, [name]: files[0] });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    // Vérification que les fichiers sont présents
    if (!formData.cvFile || !formData.coverLetter) {
      setError("Veuillez uploader votre CV et votre lettre de motivation");
      setLoading(false);
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("offreId", offreId);
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    
    // Ajouter les fichiers correctement
    formDataToSend.append("coverLetter", formData.coverLetter);
    formDataToSend.append("cvFile", formData.cvFile);
  
    try {
      const response = await fetch("http://localhost:5001/candidatures", {
        method: "POST",
        headers: {
          // NE PAS mettre 'Content-Type': 'multipart/form-data',
          // Le navigateur le fera automatiquement avec le bon boundary
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de la candidature");
      }
  
      alert("Candidature envoyée avec succès !");
      navigate("/candidates-dashboard/applied-history");
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
           <label>Lettre de motivation (PDF uniquement)</label>
           <input
            type="file"
            name="coverLetter"
            accept=".pdf"
            onChange={handleChange}
            required
        />
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

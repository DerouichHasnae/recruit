import React, { useState } from "react";

const GestionCV = () => {
  const [cvFile, setCvFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCvFile(file);
  };

  const handleUpload = async () => {
    if (!cvFile) {
      alert("Veuillez sélectionner un fichier !");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cvFile);

    // Envoi du fichier au backend
    const response = await fetch("/api/candidate/upload-cv", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("CV téléchargé avec succès !");
    }
  };

  const handleDelete = async () => {
    // Suppression du CV côté backend
    const response = await fetch("/api/candidate/delete-cv", {
      method: "DELETE",
    });

    if (response.ok) {
      alert("CV supprimé !");
      setCvFile(null);
    }
  };

  return (
    <div>
      <h2>📄 Gestion de CV</h2>

      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <button onClick={handleUpload}>📤 Télécharger</button>

      {cvFile && (
        <div>
          <p>📎 Fichier sélectionné : {cvFile.name}</p>
          <button onClick={handleDelete}>🗑️ Supprimer</button>
        </div>
      )}
    </div>
  );
};

export default GestionCV;

import React, { useState } from "react";

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({ poste: "", entreprise: "", duree: "" });

  const addExperience = () => {
    if (newExperience.poste && newExperience.entreprise && newExperience.duree) {
      setExperiences([...experiences, newExperience]);
      setNewExperience({ poste: "", entreprise: "", duree: "" });
    }
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Envoi des données à l'API (à implémenter côté backend)
    const response = await fetch("/api/candidate/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experiences }),
    });

    if (response.ok) {
      alert("Expériences enregistrées !");
    } else {
      alert("Erreur lors de l'enregistrement des expériences.");
    }
  };

  return (
    <div>
      <h2>💼 Ajouter des expériences professionnelles</h2>
      
      {/* Formulaire pour ajouter une nouvelle expérience */}
      <input
        type="text"
        placeholder="Poste occupé"
        value={newExperience.poste}
        onChange={(e) => setNewExperience({ ...newExperience, poste: e.target.value })}
      />
      <input
        type="text"
        placeholder="Entreprise"
        value={newExperience.entreprise}
        onChange={(e) => setNewExperience({ ...newExperience, entreprise: e.target.value })}
      />
      <input
        type="text"
        placeholder="Durée (ex: 2 ans)"
        value={newExperience.duree}
        onChange={(e) => setNewExperience({ ...newExperience, duree: e.target.value })}
      />
      <button onClick={addExperience}>Ajouter</button>

      {/* Liste des expériences ajoutées */}
      <ul>
        {experiences.map((exp, index) => (
          <li key={index}>
            {exp.poste} chez {exp.entreprise} - {exp.duree}{" "}
            <button onClick={() => removeExperience(index)}>❌</button>
          </li>
        ))}
      </ul>

      {/* Bouton pour sauvegarder les expériences */}
      <button onClick={handleSave}>Enregistrer les expériences</button>
    </div>
  );
};

export default Experiences;

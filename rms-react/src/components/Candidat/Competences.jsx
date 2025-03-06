import React, { useState, useEffect } from "react";
import "./competence.scss";

const Competences = () => {
  const [competences, setCompetences] = useState([]);
  const [newCompetence, setNewCompetence] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [candidatId, setCandidatId] = useState(null);

  // Récupérer l'ID du candidat depuis le localStorage au démarrage
  useEffect(() => {
    const storedCandidatId = localStorage.getItem("candidatId");
    if (storedCandidatId) {
      const parsedId = parseInt(storedCandidatId, 10);
      if (!isNaN(parsedId)) {
        setCandidatId(parsedId);
      } else {
        alert("ID candidat invalide dans le stockage local !");
      }
    } else {
      alert("Aucun ID candidat trouvé, veuillez vous reconnecter.");
    }
  }, []);

  // Charger les compétences à chaque changement d'ID du candidat
  useEffect(() => {
    if (candidatId) {
      const fetchCompetences = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/competences/candidat/${candidatId}`
          );
          if (response.ok) {
            const data = await response.json();
            setCompetences(data);
          } else {
            console.error("Erreur lors du chargement des compétences");
          }
        } catch (error) {
          console.error("Erreur réseau :", error);
        }
      };

      fetchCompetences();
    }
  }, [candidatId]);

  // Ajouter une compétence
  const addCompetence = async () => {
    if (newCompetence.trim() === "") {
      alert("Veuillez entrer une compétence");
      return;
    }

    // Validation de l'ID candidat depuis le localStorage
    const freshCandidatId = Number(localStorage.getItem("candidatId"));
    if (!freshCandidatId || isNaN(freshCandidatId)) {
      alert("Session invalide, veuillez vous reconnecter");
      return;
    }

    // Vérification de l'existence de la compétence
    const competenceExists = competences.some(
      (c) => c.nom.toLowerCase() === newCompetence.toLowerCase().trim()
    );

    if (competenceExists) {
      alert("Cette compétence est déjà ajoutée");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/competences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: newCompetence.trim(),
          candidatId: freshCandidatId, // Utilisation de la valeur fraîche
        }),
      });

      const textResponse = await response.text();

      // Gestion des erreurs HTTP
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Tentative de parsing JSON
      try {
        const data = JSON.parse(textResponse);
        setCompetences((prev) => [...prev, data]);
        setNewCompetence("");
        alert("Compétence ajoutée avec succès !");
      } catch (jsonError) {
        throw new Error("Réponse serveur invalide");
      }
    } catch (error) {
      console.error("Erreur complète :", error);
      alert(`Échec de l'ajout : ${error.message}`);
    }
  };

  // Supprimer une compétence
  const removeCompetence = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/competences/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCompetences((prev) => prev.filter((c) => c.id !== id));
        alert("Compétence supprimée !");
      } else {
        alert("Erreur lors de la suppression de la compétence");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  // Modifier une compétence
  const startEdit = (index) => {
    setEditIndex(index);
    setNewCompetence(competences[index].nom);
  };

  const saveEdit = async () => {
    if (newCompetence.trim() === "") {
      alert("Veuillez entrer une compétence");
      return;
    }

    const competenceToUpdate = competences[editIndex];

    try {
      const response = await fetch(
        `http://localhost:5000/competences/${competenceToUpdate.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: newCompetence }),
        }
      );

      if (response.ok) {
        setCompetences((prev) =>
          prev.map((c, i) =>
            i === editIndex ? { ...c, nom: newCompetence } : c
          )
        );
        setEditIndex(null);
        setNewCompetence("");
        alert("Compétence modifiée !");
      } else {
        alert("Erreur lors de la modification de la compétence");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gestion des Compétences</h2>

      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newCompetence}
            onChange={(e) => setNewCompetence(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez une nouvelle compétence"
          />
          <button
            onClick={editIndex !== null ? saveEdit : addCompetence}
            className={`px-6 py-2 rounded-lg transition-colors ${
              editIndex !== null
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {editIndex !== null ? "Sauvegarder" : "Ajouter"}
          </button>
        </div>
      </div>

      {competences.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compétence
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {competences.map((comp, index) => (
                <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={newCompetence}
                        onChange={(e) => setNewCompetence(e.target.value)}
                        className="w-full p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-700">{comp.nom}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      {editIndex === index ? (
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                          Sauvegarder
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(index)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => removeCompetence(comp.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Competences;

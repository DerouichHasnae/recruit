import React, { useEffect, useState } from "react";

const ViewVacancies = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await fetch("http://localhost:5000/offre/candidat?limit=100");
        if (response.ok) {
          const data = await response.json();
          setOffres(data.results); // Prendre le tableau results
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Erreur lors de la récupération");
        }
      } catch (error) {
        setError("Erreur de connexion au serveur: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  const filteredOffres = offres.filter((offre) => {
    const matchesTitle = offre.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = offre.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesSalary = offre.salary.includes(salaryFilter);
    return matchesTitle && matchesLocation && matchesSalary;
  });

  const handlePostuler = async (offreId) => {
    try {
      // Exemple de logique de candidature
      const response = await fetch(`http://localhost:5000/candidatures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ offreId })
      });

      if (!response.ok) throw new Error("Échec de la candidature");
      alert("Candidature envoyée avec succès!");
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.message);
    }
  };

  return (
    <div className="content-box">
      <h2>Job Vacancies</h2>
      <p>Find the latest job openings.</p>

      {/* Barre de recherche multicritère */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par titre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rechercher par localisation..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rechercher par salaire..."
          value={salaryFilter}
          onChange={(e) => setSalaryFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Chargement des offres...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredOffres.length > 0 ? (
        <div className="offres-list">
          {filteredOffres.map((offre) => (
            <div key={offre.id} className="offre-card">
              <h3>{offre.title}</h3>
              <p>{offre.description}</p>
              <div className="offre-details">
                <p><strong>📍 Localisation:</strong> {offre.location}</p>
                <p><strong>💰 Salaire:</strong> {offre.salary}</p>
                <p><strong>👤 Recruteur:</strong> {offre.recruiterName}</p>
                <p><strong>🗓 Date de publication:</strong> {new Date(offre.publicationDate).toLocaleDateString()}</p>
                <p><strong>⏳ Date d'expiration:</strong> {new Date(offre.expirationDate).toLocaleDateString()}</p>
              </div>
              {/* Bouton Postuler aligné à droite */}
              <div className="offre-actions">
                <button className="btn-postuler" onClick={() => handlePostuler(offre.id)}>
                  Postuler
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune offre disponible pour le moment.</p>
      )}
    </div>
  );
};

export default ViewVacancies;
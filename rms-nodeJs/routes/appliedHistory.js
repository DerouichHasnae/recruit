const express = require("express");
const { Offre, Candidature, Candidat } = require("../models");  // Import your models
const router = express.Router();

// Route to get applied job offers for the logged-in candidate
router.get("/applied-history/:candidatId", async (req, res) => {
    try {
      const candidatId = req.params.candidatId; // Récupérer l'ID du candidat depuis l'URL
      console.log(`Fetching applied offers for candidate with ID: ${candidatId}`);
  
      // Récupérer toutes les offres auxquelles le candidat a postulé
      const appliedOffers = await Candidature.findAll({
        where: { candidatId: candidatId },  // Filtrer par candidatId
        include: [
          {
            model: Offre,
            as: "offre",  // Utiliser l'alias 'offre' défini dans l'association
            attributes: [
              'id', 
              'title', 
              'description', 
              'location', 
              'salary', 
              'publicationDate', 
              'expirationDate'
            ]
          },
        ],
      });
  
      // Si aucune offre n'est trouvée, renvoyer une erreur
      if (!appliedOffers.length) {
        return res.status(404).json({ message: "No job offers found for this candidate." });
      }
  
      // Retourner la liste des offres postulées
      res.json(appliedOffers);
    } catch (error) {
      console.error("Error fetching applied offers:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  });
  

module.exports = router;

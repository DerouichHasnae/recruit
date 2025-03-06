const express = require("express");
const router = express.Router();
const { Offre, Recruteur } = require("../models"); 


router.get("/", async (req, res) => {
  try {
    const offres = await Offre.findAll({
      include: [{
        model: Recruteur,
        attributes: ["companyName", "email", "phoneNumber"],
        required: true
      }],
      order: [["publicationDate", "DESC"]]
    });

    const formattedOffres = offres.map(offre => ({
      id: offre.id,
      title: offre.title,
      description: offre.description,
      location: offre.location,
      salary: offre.salary,
      entreprise: {
        nom: offre.Recruteur.companyName,
        contact: {
          email: offre.Recruteur.email,
          telephone: offre.Recruteur.phoneNumber
        }
      }
    }));

    res.json({ 
      success: true,
      count: offres.length,
      results: formattedOffres
    });

  } catch (error) {
    console.error("Erreur critique:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur - " + error.message
    });
  }
});

module.exports = router;
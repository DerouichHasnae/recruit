const express = require("express");
const router = express.Router();
const { Candidature } = require("../models");

// Route pour accepter une candidature
router.put("/:id/accept", async (req, res) => {
  try {
    const candidature = await Candidature.findByPk(req.params.id);
    
    if (!candidature) {
      return res.status(404).json({ error: "Candidature non trouvée" });
    }

    await candidature.update({
      status: "acceptee"
    });

    res.json({ 
      message: "Candidature acceptée avec succès",
      candidature 
    });
  } catch (error) {
    console.error("Erreur acceptation candidature:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour rejeter une candidature
router.put("/:id/reject", async (req, res) => {
  try {
    const candidature = await Candidature.findByPk(req.params.id);
    
    if (!candidature) {
      return res.status(404).json({ error: "Candidature non trouvée" });
    }

    await candidature.update({
      status: "rejetee",
      interviewDate: null,
      interviewLink: null
    });

    res.json({ 
      message: "Candidature rejetée avec succès",
      candidature 
    });
  } catch (error) {
    console.error("Erreur rejet candidature:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour programmer un entretien
router.put("/:id/schedule-interview", async (req, res) => {
  // Validation de l'ID
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ 
      message: "ID de candidature invalide" 
    });
  }

  // Validation des données
  const { interviewDate, zoomLink } = req.body;
  if (!interviewDate) {
    return res.status(400).json({ 
      message: "La date est obligatoire" 
    });
  }

  try {
    const candidature = await Candidature.findByPk(id);
    if (!candidature) {
      return res.status(404).json({ 
        message: "Candidature introuvable" 
      });
    }

    // Conversion de la date
    const dateEntretien = new Date(interviewDate);
    if (isNaN(dateEntretien.getTime())) {
      return res.status(400).json({ 
        message: "Format de date invalide" 
      });
    }

    // Mise à jour
    await candidature.update({
      interviewDate: dateEntretien,
      interviewLink: zoomLink,
      status: "acceptee"
    });

    res.json(candidature);
  } catch (error) {
    console.error("Erreur SQL:", error);
    res.status(500).json({ 
      message: "Erreur interne",
      details: error.message 
    });
  }
});

module.exports = router;
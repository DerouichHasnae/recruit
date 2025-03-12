const express = require("express");
const multer = require("../multerConfig");
const Candidature = require("../models/Candidature");

const router = express.Router();

// Soumettre une candidature
router.post("/", multer.single("cvFile"), async (req, res) => {
  try {
    const { offreId, fullName, email, phoneNumber, coverLetter, skills } = req.body;
    const cvFile = req.file ? req.file.filename : null;

    if (!cvFile) return res.status(400).json({ message: "Le fichier CV est requis" });

    const candidature = await Candidature.create({
      offreId,
      fullName,
      email,
      phoneNumber,
      coverLetter,
      skills,
      cvFile,
    });

    res.status(201).json({ message: "Candidature envoyée avec succès", candidature });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Récupérer toutes les candidatures
router.get("/", async (req, res) => {
  try {
    const candidatures = await Candidature.findAll();
    res.status(200).json(candidatures);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;

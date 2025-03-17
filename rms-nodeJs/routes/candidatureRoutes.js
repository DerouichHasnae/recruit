const express = require('express');
const router = express.Router();
const { Candidature } = require('../models'); // Importer le modèle Candidature
const multer = require('multer'); // Pour gérer l'upload des fichiers

// Configurer multer pour gérer les fichiers (CV, lettre de motivation)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Répertoire où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nom du fichier avec un timestamp
  }
});

const upload = multer({ storage });

router.post('/', upload.fields([
  { name: 'cvFile', maxCount: 1 }, // Fichier CV
  { name: 'coverLetter', maxCount: 1 }, // Fichier de lettre de motivation
]), async (req, res) => {
  try {
    const { fullName, email, offreId } = req.body;

    // Vérifier si les fichiers sont fournis
    if (!req.files['cvFile'] || !req.files['coverLetter']) {
      return res.status(400).json({ message: 'CV et lettre de motivation sont requis.' });
    }

    // Créer une nouvelle candidature
    const newCandidature = await Candidature.create({
      fullName,
      email,
      coverLetter: req.files['coverLetter'][0].path, // Chemin du fichier de la lettre de motivation
      cvFile: req.files['cvFile'][0].path, // Chemin du fichier CV
      offreId,
    });

    res.status(201).json({
      message: 'Candidature soumise avec succès.',
      candidature: newCandidature
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la soumission de la candidature.', error: error.message });
  }
});

module.exports = router;

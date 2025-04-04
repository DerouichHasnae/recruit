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

// Dans candidatureRoutes.js
router.post('/', 
  upload.fields([
    { name: 'cvFile', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      const { fullName, email, phoneNumber, offreId } = req.body;

      // Vérification des fichiers
      if (!req.files['cvFile'] || !req.files['coverLetter']) {
        return res.status(400).json({ 
          success: false,
          message: 'CV et lettre de motivation sont requis' 
        });
      }

      // Création de la candidature
      const newCandidature = await Candidature.create({
        fullName,
        email,
        phoneNumber,
        coverLetter: req.files['coverLetter'][0].path,
        cvFile: req.files['cvFile'][0].path,
        offreId
      });

      res.status(201).json({
        success: true,
        message: 'Candidature soumise avec succès',
        data: newCandidature
      });

    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la candidature',
        error: error.message
      });
    }
  }
);


module.exports = router;

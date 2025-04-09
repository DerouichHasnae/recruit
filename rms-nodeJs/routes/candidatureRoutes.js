const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Candidature, Candidat } = require('../models');

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont acceptés'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Route POST pour les candidatures
router.post('/', 
  upload.fields([
    { name: 'cvFile', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      // Vérification des champs obligatoires
      const { candidatId, offreId, fullName, email, phoneNumber } = req.body;
      
      if (!candidatId || !offreId) {
        return res.status(400).json({
          success: false,
          message: 'ID candidat ou offre manquant'
        });
      }

      // Vérifier que le candidat existe
      const candidat = await Candidat.findByPk(candidatId);
      if (!candidat) {
        return res.status(404).json({
          success: false,
          message: 'Candidat non trouvé'
        });
      }

      // Vérification des fichiers
      if (!req.files?.['cvFile']?.[0] || !req.files?.['coverLetter']?.[0]) {
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
        offreId,
        candidatId
      });

      return res.status(201).json({
        success: true,
        data: newCandidature
      });

    } catch (error) {
      console.error('Erreur:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
);

module.exports = router;
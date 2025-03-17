const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Candidat = require("../models/candidat");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Inscription du candidat avec image
router.post("/signup", upload.single("profileImage"), async (req, res) => {
  try {
    const { fullName, email, phoneNumber, gender, address, age, password } = req.body;
    const profileImage = req.file ? req.file.path : null;

    const newCandidat = await Candidat.create({
      fullName,
      email,
      phoneNumber,
      gender,
      address,
      age,
      password,
      profileImage,
    });

    res.status(201).json({ message: "Candidat registered successfully", candidat: newCandidat });
  } catch (error) {
    console.error("Error registering candidat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Connexion du candidat
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis !" });
    }

    const candidat = await Candidat.findOne({ where: { email } });
    if (!candidat) {
      return res.status(404).json({ error: "Email non trouvé" });
    }

    // Vérification du mot de passe (sans hashage)
    if (candidat.password !== password) {
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }

    res.status(200).json({ message: "Connexion réussie", candidat });
  } catch (error) {
    console.error("Erreur lors de la connexion du candidat:", error);
    res.status(500).json({ error: "Erreur lors de la connexion", details: error.message });
  }
});

// Récupération du profil avec photo
router.get("/profile", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const candidat = await Candidat.findByPk(userId);

    if (!candidat) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = {
      fullName: candidat.fullName,
      email: candidat.email,
      phoneNumber: candidat.phoneNumber,
      address: candidat.address,
      age: candidat.age,
      gender: candidat.gender,
      profileImage: candidat.profileImage,
      skills: candidat.skills || '' // Assure que c'est une chaîne vide par défaut
    };

    res.json(userProfile);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Error retrieving profile" });
  }
});

// Ajouter une compétence au candidat
router.post('/add-skills', async (req, res) => {
  const { userId, skill } = req.body;

  if (!userId || !skill) {
      return res.status(400).json({ message: "userId et skill sont requis" });
  }

  try {
      const candidat = await Candidat.findOne({ where: { id: userId } });
      if (!candidat) {
          return res.status(404).json({ message: "Candidat non trouvé" });
      }

      candidat.skills = skill;
      await candidat.save();

      res.json({ message: "Compétences mises à jour", candidat });
  } catch (error) {
      console.error("Erreur serveur:", error);
      res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer les compétences d'un candidat
router.get('/skills', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
      return res.status(400).json({ message: 'userId est requis' });
  }

  try {
      const candidat = await Candidat.findOne({ where: { id: userId } });
      if (!candidat) {
          return res.status(404).json({ message: 'Candidat non trouvé' });
      }

      res.json({ skills: candidat.skills }); // Retourner les compétences de l'utilisateur
  } catch (error) {
      console.error('Erreur lors de la récupération des compétences:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});


// Mettre à jour les compétences du candidat
router.put("/update-skills", async (req, res) => {
  const { userId, skills } = req.body;

  if (!userId || !skills) {
    return res.status(400).json({ message: "User ID and skills are required" });
  }

  try {
    const candidat = await Candidat.findByPk(userId);

    if (!candidat) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mettre à jour les compétences
    candidat.skills = skills;
    await candidat.save();

    res.status(200).json({ message: "Compétences mises à jour avec succès", candidat });
  } catch (error) {
    console.error("Error updating skills:", error);
    res.status(500).json({ message: "Error updating skills" });
  }
});
// Route pour supprimer une compétence
router.put('/suprime-skills', async (req, res) => {
  const { userId, skills } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const candidat = await Candidat.findByPk(userId); // Utilisez findByPk pour Sequelize
    if (!candidat) {
      return res.status(404).json({ message: 'Candidat non trouvé' });
    }

    // Mettre à jour les compétences du candidat
    candidat.skills = skills; // Remplacez les compétences par la nouvelle liste

    // Sauvegarder les modifications dans la base de données
    await candidat.save();

    // Répondre avec les données mises à jour
    res.status(200).json({ candidat });
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la compétence' });
  }
});

module.exports = router;
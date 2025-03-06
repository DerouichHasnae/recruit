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


// Endpoint pour l'inscription d'un candidat
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
    console.log("🔍 Données reçues pour connexion candidat:", req.body);

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
    console.error("❌ Erreur lors de la connexion du candidat:", error);
    res.status(500).json({ error: "Erreur lors de la connexion", details: error.message });
  }
});


// Route pour récupérer le profil
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
      profileImage: candidat.profileImage, // Récupérer l'image
    };

    res.json(userProfile);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Error retrieving profile" });
  }
});

module.exports = router;

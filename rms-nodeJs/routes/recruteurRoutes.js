const express = require("express");
const Recruteur = require("../models/recruteur");

const router = express.Router();

// Route pour l'inscription d'un recruteur
router.post("/signup", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { fullName, email, password, companyName, companyUrl, companyAddress, countryCode, phoneNumber } = req.body;

    if (!fullName || !email || !password || !companyName || !phoneNumber) {
      return res.status(400).json({ error: "Tous les champs sont requis !" });
    }

    // Vérifier si l'email existe déjà
    const existingRecruteur = await Recruteur.findOne({ where: { email } });
    if (existingRecruteur) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    // Création du recruteur
    const newRecruteur = await Recruteur.create({
      fullName,
      email,
      password,
      companyName,
      companyUrl,
      companyAddress,
      countryCode,
      phoneNumber,
    });

    console.log("✅ Recruteur créé avec succès:", newRecruteur);
    res.status(201).json({ message: "Recruteur inscrit avec succès", recruteur: newRecruteur });

  } catch (error) {
    console.error("❌ Erreur lors de l'inscription:", error);
    res.status(500).json({ error: "Erreur lors de l'inscription", details: error.message });
  }
});

// Route pour la connexion d'un recruteur
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const recruteur = await Recruteur.findOne({ where: { email } });
    if (!recruteur) {
      return res.status(404).json({ error: "Email non trouvé" });
    }

    if (recruteur.password !== password) {
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }

    res.status(200).json({ message: "Connexion réussie", recruteur });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion:", error);
    res.status(500).json({ error: "Erreur lors de la connexion", details: error.message });
  }
});

module.exports = router;

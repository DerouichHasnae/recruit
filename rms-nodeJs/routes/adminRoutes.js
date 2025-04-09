const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const router = express.Router();

// Route pour l'inscription (Sign-Up)
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    // Vérifier si l'email existe déjà
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Création de l'admin sans hachage du mot de passe
    const newAdmin = await Admin.create({
      fullName,
      email,
      password, // Mot de passe en clair (non sécurisé)
      phoneNumber,
    });

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour la connexion (Sign-In)
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'admin existe
    const admin = await Admin.findOne({ where: { email } });
    if (!admin || admin.password !== password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: admin.id, email: admin.email }, "SECRET_KEY", {
      expiresIn: "1h",
    });

    // Envoi de l'objet admin avec le token
    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        // Add any other properties you'd like to send
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
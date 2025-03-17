const express = require("express");
const router = express.Router();
const Offre = require("../models/Offre");
const Recruteur = require("../models/recruteur");

// 🔹 Route pour publier une offre
router.post("/", async (req, res) => {
  try {
    const { 
      title, 
      description, 
      location, 
      publicationDate, 
      expirationDate, 
      salary, 
      recruiterId 
    } = req.body;

    if (!recruiterId) {
      return res.status(400).json({ message: "Le recruteur est obligatoire" });
    }

    const recruteur = await Recruteur.findByPk(recruiterId);
    if (!recruteur) {
      return res.status(404).json({ message: "Recruteur non trouvé" });
    }

    const offre = await Offre.create({
      title,
      description,
      location,
      publicationDate,
      expirationDate,
      salary,
      recruiterId
    });

    res.status(201).json(offre);
  } catch (error) {
    console.error("Erreur lors de la publication de l'offre:", error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message
    });
  }
});

// 🔹 Route pour les recruteurs (leurs offres)
router.get("/", async (req, res) => {
  try {
    const recruiterId = req.query.recruiterId;

    if (!recruiterId || isNaN(recruiterId)) {
      return res.status(400).json({ message: "ID recruteur invalide" });
    }

    const offres = await Offre.findAll({
      where: { recruiterId: parseInt(recruiterId) },
      include: {
        model: Recruteur,
        attributes: ["fullName"],
        as: "recruteur",
        required: true
      },
    });

    const formattedOffres = offres.map((offre) => ({
      id: offre.id,
      title: offre.title,
      description: offre.description,
      location: offre.location,
      publicationDate: offre.publicationDate,
      expirationDate: offre.expirationDate,
      salary: offre.salary,
      recruiterName: offre.recruteur ? offre.recruteur.fullName : "Inconnu" // Ajout du nom du recruteur
    }));

    res.json(formattedOffres);
  } catch (error) {
    console.error("Erreur lors de la récupération des offres:", error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message
    });
  }
});

// 🔹 Route pour les candidats (toutes les offres)
router.get("/candidat", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const offres = await Offre.findAndCountAll({
      include: {
        model: Recruteur,
        attributes: ["companyName", "email", "phoneNumber"], // Correction ici
        as: "recruteur",
        required: true
      },
      order: [["publicationDate", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    const formattedOffres = {
      total: offres.count,
      page: parseInt(page),
      totalPages: Math.ceil(offres.count / limit),
      results: offres.rows.map((offre) => ({
        id: offre.id,
        title: offre.title,
        description: offre.description,
        location: offre.location,
        publicationDate: offre.publicationDate,
        expirationDate: offre.expirationDate,
        salary: offre.salary,
        entreprise: offre.Recruteur ? {
          nom: offre.Recruteur.companyName,
          contact: {
            email: offre.Recruteur.email,
            telephone: offre.Recruteur.phoneNumber // Correction ici
          }
        } : null
      }))
    };

    res.json(formattedOffres);
  } catch (error) {
    console.error("Erreur lors de la récupération des offres:", error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message
    });
  }
});

module.exports = router;
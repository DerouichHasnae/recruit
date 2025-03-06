const express = require('express');
const router = express.Router();
const Competence = require('../models/competence'); // Import direct du modèle
const Candidat =require('../models/candidat');

// Récupérer toutes les compétences
router.get('/', async (req, res) => {
  try {
    // Récupère toutes les compétences avec l'association candidat
    const competences = await Competence.findAll({
      include: {
        model: Candidat,             // Associe le modèle 'Candidat' à la compétence
        as: 'candidat',              // L'alias de l'association, qui correspond à ce que tu définis dans le modèle Competence
        attributes: ['fullName']          // Sélectionne seulement le nom du candidat (pour ne pas retourner toutes les colonnes du modèle Candidat)
      }
    });
    res.json(competences);  // Retourne la liste des compétences, incluant l'information sur le candidat
  } catch (error) {
    res.status(500).json({ message: error.message });  // Si une erreur survient, elle est renvoyée avec un code 500
  }
});


// Créer une nouvelle compétence
router.post("/", async (req, res) => {
  try {
    const { nom, candidatId } = req.body;

    // Vérifie si tous les champs sont remplis
    if (!nom || !candidatId) {
      return res.status(400).json({ error: "Le nom et candidatId sont requis." });
    }

    // Vérifie si le candidat existe
    const candidat = await Candidat.findByPk(candidatId);
    if (!candidat) {
      return res.status(404).json({ error: "Candidat introuvable" });
    }

    // Crée la compétence avec Sequelize
    const competence = await Competence.create({ nom, candidatId });

    console.log("✅ Compétence enregistrée :", competence);

    res.status(201).json(competence);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la compétence :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de la compétence" });
  }
});


// Mettre à jour une compétence
router.put('/:id', async (req, res) => {
  try {
    const competence = await Competence.findByPk(req.params.id);
    if (competence) {
      await competence.update(req.body);
      res.json(competence);
    } else {
      res.status(404).json({ message: 'Compétence non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer une compétence
router.delete('/:id', async (req, res) => {
  try {
    const competence = await Competence.findByPk(req.params.id);
    if (competence) {
      await competence.destroy();
      res.json({ message: 'Compétence supprimée' });
    } else {
      res.status(404).json({ message: 'Compétence non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
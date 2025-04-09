const express = require('express');
const router = express.Router();
const { Candidature, Offre } = require('../models');
const { Op } = require('sequelize');

// Récupérer toutes les notifications (entretiens programmés) pour un candidat
router.get('/candidat/:candidatId', async (req, res) => {
  try {
    const { candidatId } = req.params;
    
    const entretiens = await Candidature.findAll({
      where: { 
        candidatId,
        interviewDate: { [Op.not]: null } // Seulement les entretiens programmés
      },
      include: [
        { 
          model: Offre,
          as: 'offre',
          attributes: ['title', 'description'] // On inclut seulement ces champs
        }
      ],
      order: [['interviewDate', 'ASC']] // Tri par date d'entretien
    });

    res.json(entretiens);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer le nombre de notifications non lues (pour le badge)
router.get('/candidat/:candidatId/count', async (req, res) => {
  try {
    const { candidatId } = req.params;
    
    const count = await Candidature.count({
      where: { 
        candidatId,
        interviewDate: { [Op.not]: null },
        // isRead: false // Si vous ajoutez ce champ plus tard
      }
    });

    res.json({ count });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
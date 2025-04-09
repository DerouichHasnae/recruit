const express = require('express');
const router = express.Router();
const db = require('../models'); // Assurez-vous que le chemin est correct

// Récupérer toutes les candidatures pour une offre spécifique
// Dans routes/candidature.js
router.get('/:offreId', async (req, res) => {
  try {
    const { offreId } = req.params;
    
    // Requête SQL brute pour contourner Sequelize temporairement
    const [results] = await db.sequelize.query(
      'SELECT * FROM candidatur WHERE "offreId" = ?', 
      { replacements: [offreId] }
    );
    
    console.log('Résultats SQL bruts:', results);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur SQL directe' });
  }
});


module.exports = router;
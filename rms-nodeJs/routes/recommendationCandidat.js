const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

/**
 * @route GET /api/candidates/recommended/:recruiterId
 * @description Récupère les profils complets des candidats adaptés aux offres du recruteur
 */
router.get('/:recruiterId', async (req, res) => {
  try {
      const { recruiterId } = req.params;

      // Suppression de toute vérification d'authentification ici
      console.log(`Requête reçue pour le recruteur ID: ${recruiterId}`);

      const pythonProcess = spawn('python', [
          path.join(__dirname, '../ml_engine/recommendation_engine.py'),
          '--recruteur',
          recruiterId
      ], {
          stdio: ['pipe', 'pipe', 'pipe'],
          encoding: 'utf8'
      });

      let jsonData = "";
      let errorOutput = "";

      pythonProcess.stdout.on('data', (data) => {
          // On ne garde que la dernière ligne qui contient le JSON
          const lines = data.toString().split('\n');
          const lastLine = lines[lines.length - 1];
          
          try {
              JSON.parse(lastLine);
              jsonData = lastLine;
          } catch (e) {
              // Ce n'est pas du JSON, on l'ignore
          }
      });

      pythonProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0 || errorOutput) {
            return res.status(500).json({
                success: false,
                error: "Erreur de recommandation",
                details: errorOutput || 'Code de sortie non nul'
            });
        }
    
        try {
            const result = JSON.parse(jsonData);
            
            return res.json({
                success: true,
                data: result.recommendations.map(candidate => ({
                    ...candidate,
                    location: candidate.location || null,
                    profileImage: candidate.profileImage || null
                })) || []
            });
        } catch (e) {
            return res.status(500).json({
                success: false,
                error: "Format de données invalide",
                details: process.env.NODE_ENV === 'development' ? jsonData : null
            });
        }
    });

  } catch (error) {
      return res.status(500).json({
          success: false,
          error: "Erreur serveur",
          details: process.env.NODE_ENV === 'development' ? error.stack : null
      });
  }
});

module.exports = router;

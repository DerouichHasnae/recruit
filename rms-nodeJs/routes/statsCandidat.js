const express = require("express");
const router = express.Router();
const { Candidature, Offre } = require("../models");
const Sequelize = require('sequelize');  // Assurez-vous d'utiliser Sequelize et pas sequelize

// Statistiques globales d’un candidat
router.get("/candidat/:id/stats", async (req, res) => {
  const candidatId = req.params.id;

  try {
    // 1. Total des candidatures
    const totalCandidatures = await Candidature.count({
      where: { candidatId }
    });

    // 2. Candidatures par mois (pour le bar chart)
    const monthlyCandidatures = await Candidature.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'month'],  // Utilisation de Sequelize ici
        [Sequelize.fn('count', Sequelize.col('id')), 'count']  // Utilisation de Sequelize ici
      ],
      where: { candidatId },
      group: ['month'],
      order: [['month', 'ASC']],
      raw: true
    });

    // Formater les données mensuelles pour le frontend
    const formattedMonthly = monthlyCandidatures.map(item => ({
      month: new Date(item.month).toLocaleString('default', { month: 'short' }),
      count: item.count
    }));

    // 3. Répartition par statut (pour le pie chart)
    const statusDistribution = await Candidature.findAll({
      attributes: [
        'status',
        [Sequelize.fn('count', Sequelize.col('id')), 'count']  // Utilisation de Sequelize ici
      ],
      where: { candidatId },
      group: ['status'],
      raw: true
    });

    // Formater les données de statut
    const formattedStatus = statusDistribution.map(item => ({
      name: item.status,
      value: item.count
    }));

    // 4. Dernières candidatures (optionnel)
    const recentCandidatures = await Candidature.findAll({
      where: { candidatId },
      include: [{ model: Offre, as: "offre" }],
      order: [["createdAt", "DESC"]],
      limit: 5
    });

    res.json({
      totalCandidatures,
      monthlyCandidatures: formattedMonthly,
      statusCandidatures: formattedStatus,
      recentCandidatures: recentCandidatures
    });
  } catch (err) {
    console.error("Erreur stats candidat:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;

const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const Candidat = require("./candidat");
// Import des modèles
const Recruteur = require("./recruteur")
const Offre = require("./Offre")
const Candidature = require("./Candidature")

// 1. Association entre Recruteur et Offre
Recruteur.hasMany(Offre, {
  foreignKey: "recruiter_id", // Clé étrangère dans Offre
  as: "offres", // Alias pour l'association
});

Offre.belongsTo(Recruteur, {
  foreignKey: "recruiter_id", // Clé étrangère dans Offre
  as: "recruteur", // Alias pour l'association
});

// 2. Association entre Offre et Candidature
Offre.hasMany(Candidature, {
  foreignKey: "offreId", // Clé étrangère dans Candidature
  as: "candidatures", // Alias pour l'association
});

Candidature.belongsTo(Offre, {
  foreignKey: "offreId", // Clé étrangère dans Candidature
  as: "offre", // Alias pour l'association
});

// Création d'un objet db pour exporter les modèles et l'instance Sequelize
const db = {
  sequelize,
  Sequelize,
  Recruteur,
  Offre,
  Candidature,
  Candidat

};

// Définition des associations dynamiques (si nécessaire)
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

// Synchronisation de la base de données
sequelize
  .sync({ force: false }) // `force: true` pour réinitialiser la base de données (à utiliser avec précaution)
  .then(() => console.log("✅ Database & tables created!"))
  .catch((err) => console.error("❌ Error syncing database:", err));

// Export des modèles et de l'instance Sequelize
module.exports = db;
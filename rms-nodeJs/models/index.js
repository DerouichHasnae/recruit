const sequelize = require("../config/database");
const Admin = require("./admin");
const Candidat = require("./candidat");
const Recruteur = require("./recruteur");
const Offre = require("./offre");
const Competence = require("./competence"); // Correction : appel direct du modèle

const db = {
  sequelize,
  Admin,
  Candidat,
  Recruteur,
  Offre,
  Competence
};

// Définition des associations
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});
// Définir les associations après l'importation des modèles
Candidat.hasMany(Competence, {
  foreignKey: "candidatId",
  as: "competences", // Alias pour la relation
  onDelete: "CASCADE",
});

Competence.belongsTo(Candidat, {
  foreignKey: "candidatId",
  as: "candidat",
});

// Synchronisation unique de la base de données
sequelize
  .sync()
  .then(() => console.log("✅ Database & tables created!"))
  .catch((err) => console.error("❌ Error syncing database:", err));

module.exports = db;

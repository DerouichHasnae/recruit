// models/competence.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Candidat = require("./candidat"); // Importation du modèle Candidat ici

const Competence = sequelize.define("Competence", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  candidatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true // Validation supplémentaire
    },
    references: {
      model: "Candidat", // La table Candidat est utilisée comme référence
      key: "id",
    },
  },
});

// Associer Competence à Candidat
Competence.belongsTo(Candidat, {
  foreignKey: "candidatId",
  as: "candidat",
});

module.exports = Competence;

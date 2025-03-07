// models/postuler.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Postuler = sequelize.define("Postuler", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cvFile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  offreId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
    references: {
      model: "Offre",
      key: "id",
    },
  },
  candidatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
    references: {
      model: "Candidat",
      key: "id",
    },
  },
});

// Définir les associations dans une fonction
Postuler.associate = (models) => {
  Postuler.belongsTo(models.Candidat, {
    foreignKey: "candidatId",
    as: "candidat",
  });
  Postuler.belongsTo(models.Offre, {
    foreignKey: "offreId",
    as: "offre",
  });
};

module.exports = Postuler;
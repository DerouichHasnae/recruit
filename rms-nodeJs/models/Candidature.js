const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Connexion déjà faite
const Offre = require("./Offre");

const Candidature = sequelize.define("Candidature", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  offreId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cvFile: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});



module.exports = Candidature;

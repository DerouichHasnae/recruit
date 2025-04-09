const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Candidature = sequelize.define("Candidature", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'en attente',
    validate: {
      isIn: [['en attente', 'acceptee', 'rejetee']] 
    }
  },
  interviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  interviewLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  offreId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  candidatId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'candidatur', // pour correspondre au nom de table dans la migration
  timestamps: true // active automatiquement createdAt et updatedAt
});

module.exports = Candidature;
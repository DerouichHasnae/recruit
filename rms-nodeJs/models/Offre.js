const { DataTypes } = require('sequelize'); 
const sequelize = require("../config/database");
const Recruteur = require("./recruteur");
const Candidature = require("./Candidature")

const Offre = sequelize.define('Offre', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publicationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'publication_date' // Mapping explicite vers snake_case
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expiration_date' // Mapping explicite vers snake_case
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recruiterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'recruiter_id', // Nom physique en base
    references: {
      model: Recruteur,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'offre',
  timestamps: true,
  underscored: true, // Conversion automatique camelCase → snake_case
  createdAt: 'created_at', // Formatage explicite
  updatedAt: 'updated_at'  // Formatage explicite
});





module.exports = Offre;
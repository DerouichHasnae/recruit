const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Admin = sequelize.define("Admin", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'admin', // Spécifie explicitement le nom de la table
  freezeTableName: true, // Empêche Sequelize de modifier le nom de la table en pluriel

});

module.exports = Admin;

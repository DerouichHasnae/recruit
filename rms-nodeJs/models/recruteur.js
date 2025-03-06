const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Recruteur = sequelize.define(
  "Recruteur",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "recruteur",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Recruteur;

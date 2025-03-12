"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Candidatures", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      offreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "offre", // Nom de la table Offre
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      candidatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "candidat", // Nom de la table Candidat
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      coverLetter: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cvFile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("en attente", "acceptée", "refusée"),
        defaultValue: "en attente",
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Candidatures");
  },
};
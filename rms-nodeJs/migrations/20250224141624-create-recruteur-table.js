'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Création de la table 'recruteurs'
    await queryInterface.createTable('recruteur', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      companyUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      companyAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      countryCode: {  // Ajout de la colonne 'countryCode'
        type: Sequelize.STRING,
        allowNull: false // ou true si tu veux qu'il soit optionnel
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Suppression de la table 'recruteurs' en cas de rollback
    await queryInterface.dropTable('recruteur');
  }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Création de la table Competences
    await queryInterface.createTable('competences', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      candidatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'candidat', 
          key: 'id',
        },
        onDelete: 'CASCADE', // Supprimez les compétences liées quand le candidat est supprimé
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    // Suppression de la table Competences
    await queryInterface.dropTable('competences');
  }
};

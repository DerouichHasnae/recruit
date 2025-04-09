module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('candidatur', { // Notez le 'C' majuscule
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true },
      },
      phoneNumber: { // Ajouté pour correspondre au modèle
        type: Sequelize.STRING,
        allowNull: false,
      },
      coverLetter: {
        type: Sequelize.TEXT, // Changé de STRING à TEXT pour correspondre au modèle
        allowNull: false,
      },
      cvFile: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      offreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'offre', // Notez le pluriel et la majuscule
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      candidatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'candidat', // Notez le pluriel et la majuscule
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Candidatures');
  }
};
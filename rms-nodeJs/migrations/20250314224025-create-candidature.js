module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('candidatures', {
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
        unique: true,
      },
      coverLetter: {
        type: Sequelize.STRING, // ou BLOB si vous voulez stocker le fichier en binaire
        allowNull: false,
      },
      cvFile: {
        type: Sequelize.STRING, // ou BLOB pour le fichier PDF
        allowNull: false,
      },
      offreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'offre', // Nom de la table des offres
          key: 'id',
        },
      },
      candidatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'candidat', // Nom de la table des candidats
          key: 'id',
        },
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
    await queryInterface.dropTable('candidatures');
  }
};

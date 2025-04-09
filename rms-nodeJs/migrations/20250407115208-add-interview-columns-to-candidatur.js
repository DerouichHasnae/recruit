module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('candidatur', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'en_attente', // Valeur par défaut pour "en attente"
    });

    await queryInterface.addColumn('candidatur', 'interviewDate', {
      type: Sequelize.DATE,
      allowNull: true, // Cette colonne peut être nulle tant qu'il n'y a pas de date d'entretien
    });

    await queryInterface.addColumn('candidatur', 'interviewLink', {
      type: Sequelize.STRING,
      allowNull: true, // Cette colonne peut être nulle tant qu'il n'y a pas de lien
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('candidatur', 'status');
    await queryInterface.removeColumn('candidatur', 'interviewDate');
    await queryInterface.removeColumn('candidatur', 'interviewLink');
  }
};

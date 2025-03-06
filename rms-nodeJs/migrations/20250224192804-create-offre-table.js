module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('offre', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      publication_date: { // 👈 Nom physique en snake_case
        type: Sequelize.DATE,
        allowNull: false,
      },
      expiration_date: { // 👈 Nom physique en snake_case
        type: Sequelize.DATE,
        allowNull: false,
      },
      salary: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recruiter_id: { // 👈 Nom physique en snake_case
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'recruteur',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: { // 👈 Nom physique en snake_case
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: { // 👈 Nom physique en snake_case
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('offre');
  }
};
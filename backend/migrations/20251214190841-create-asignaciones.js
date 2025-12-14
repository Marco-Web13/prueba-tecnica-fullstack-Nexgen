'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Asignaciones', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      maestro_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      materia_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Materias', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      cupo_maximo: { type: Sequelize.INTEGER, defaultValue: 40 },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Asignaciones');
  }
};
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Calificaciones', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      alumno_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Alumnos', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      materia_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Materias', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      maestro_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      nota: { type: Sequelize.DECIMAL(5, 2) },
      observaciones: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Calificaciones');
  }
};
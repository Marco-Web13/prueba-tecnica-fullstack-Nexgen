'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Alumnos', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nombre: { type: Sequelize.STRING(150), allowNull: false },
      matricula: { type: Sequelize.STRING(50), unique: true },
      fecha_nacimiento: { type: Sequelize.DATEONLY },
      grupo: { type: Sequelize.STRING(50) },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Alumnos');
  }
};
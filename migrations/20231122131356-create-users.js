'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(50)
        
      },
      displayName: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(120)
      },
      location: {
        allowNull: true,
        type: Sequelize.STRING(100)
      },
      bio: {
        allowNull: false,
        type: Sequelize.TEXT(200)
      },
      webiste: {
        allowNull: true,
        type: Sequelize.STRING(100)
      },
      dateOfBirth: {
        allowNull: false,
        type: Sequelize.DATE,
        validate: {
          isAbove13(value) {
            const today = new Date();
            const userBirthDate = new Date(value);
            const ageDiff = today.getFullYear() - userBirthDate.getFullYear();
  
            if (ageDiff < 13) {
              throw new Error('User must be at least 13 years old.');
            }
          },
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.NOW

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.NOW
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(256)
      },
      profilePicUrl: {
        allowNull: true,
        type: Sequelize.STRING(1024)

      },
      headerPicUrl: {
        allowNull: true,
        type: Sequelize.STRING(1024)
      }
  })
},
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
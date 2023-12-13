'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('repost', 'post', 'reply'),
        defaultValue:'post'
      },
      referenceId: {
        allowNull: true,
        type: Sequelize.BIGINT,
        References: {
              model:"Posts",
              key:"id"

        },
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
      },
      content: {
        type: Sequelize.STRING(280),
        allowNull: false
},
      postedAt: {
        type: Sequelize.DATE,
        allowNull: true

      },
      createdAt: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
     
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};
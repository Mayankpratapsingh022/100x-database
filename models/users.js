'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    id: {
      allowNull: true,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    username: {
      allowNull: true,
      unique: true,
      type: DataTypes.STRING(50)
      
    },
    displayName: {
      allowNull: true,
      type: DataTypes.STRING(50)
    },
    email: {
      allowNull: true,
      unique: true,
      type: DataTypes.STRING(120)
    },
    location: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    bio: {
      allowNull: true,
      type: DataTypes.TEXT(200)
    },
    webiste: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    dateOfBirth: {
      allowNull: true,
      type: DataTypes.DATE,
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
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue:DataTypes.NOW

    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue:DataTypes.NOW
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING(256)
    },
    profilePicUrl: {
      allowNull: true,
      type: DataTypes.STRING(1024)

    },
    headerPicUrl: {
      allowNull: true,
      type: DataTypes.STRING(1024)
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
}
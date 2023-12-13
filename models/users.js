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
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    username: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(50)
      
    },
    displayName: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(120)
    },
    location: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    bio: {
      allowNull: false,
      type: DataTypes.TEXT(200)
    },
    webiste: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },
    dateOfBirth: {
      allowNull: false,
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
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue:DataTypes.NOW

    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue:DataTypes.NOW
    },
    password: {
      allowNull: false,
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
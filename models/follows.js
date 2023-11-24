'use strict';
const user = require("./users");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follows extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Follows.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    followerID:{
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: user,
        key: "id",
      },
    },
    followingId:{
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: user,
        key: "id",
      },
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,

    }


  }, {
    sequelize,
    modelName: 'Follows',
  });
  return Follows;
};
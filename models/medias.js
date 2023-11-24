'use strict';
const post = require("./posts");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Medias.init({
    index:{
      type: DataTypes.INTEGER,
      allowNull: false 
    },
    postedId:{
      type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: post,
          key: "id",
        },
    },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      values: ["image", "video", "gif"],
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Medias',
  });
  return Medias;
};
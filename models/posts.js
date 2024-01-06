"use strict";

const user = require("./users");
const { Model,DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Posts.init(
    {
      id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      type: {
        type: DataTypes.ENUM,
        values: ["repost", "post", "reply"],
        defaultValue: "post",
        allowNull: true,
      },
      referenceId: {
        type: DataTypes.BIGINT,
        allowNull: true,
       
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: user,
          key: "id",
        },
      },
      content: {
        type: DataTypes.STRING(280),
        allowNull: true,
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Posts",
    }
  );
  return Posts;
};

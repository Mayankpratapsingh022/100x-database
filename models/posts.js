"use strict";

const user = require("./users");
const { Model } = require("sequelize");
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
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      type: {
        type: DataTypes.ENUM,
        values: ["repost", "post", "reply"],
        defaultValue: "post",
        allowNull: false,
      },
      referenceId: {
        type: DataTypes.BIGINT,
        allowNull: true,
       
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: user,
          key: "id",
        },
      },
      content: {
        type: DataTypes.STRING(280),
        allowNull: false,
      },
      postedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
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

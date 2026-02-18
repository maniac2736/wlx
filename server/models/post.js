"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post.init(
    {
      slug: DataTypes.STRING,
      published: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Post",
    },
  );

  Post.associate = (models) => {
    Post.hasMany(models.PostSection, {
      foreignKey: "postId",
      onDelete: "CASCADE",
    });
  };
  return Post;
};

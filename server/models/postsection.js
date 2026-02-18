"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostSection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PostSection.init(
    {
      postId: DataTypes.BIGINT,
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      section_order: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PostSection",
    },
  );

  PostSection.associate = (models) => {
    PostSection.belongsTo(models.Post, { foreignKey: "postId" });
    PostSection.hasMany(models.PostImage, {
      foreignKey: "sectionId",
      onDelete: "CASCADE",
    });
  };
  return PostSection;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init(
    {
      type: DataTypes.STRING,
      category: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};

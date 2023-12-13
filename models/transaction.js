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
      Transaction.belongsTo(models.User, {
        as: "created_user",
        foreignKey: "created_user_id",
      });

      Transaction.belongsTo(models.User, {
        as: "updated_user",
        foreignKey: "updated_user_id",
      });

      Transaction.belongsToMany(models.ProductVariant, {
        as: "product_variant_id",
        through: {
          model: models.TransactionDetail,
        },
      });

      Transaction.hasMany(models.TransactionDetail, {
        as: "transaction_detail",
      });
    }
  }
  Transaction.init(
    {
      active: DataTypes.BOOLEAN,
      transaction_no: DataTypes.STRING,
      total_amount: DataTypes.INTEGER,
      created_user_id: DataTypes.INTEGER,
      updated_user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      underscored: true,
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
  return Transaction;
};

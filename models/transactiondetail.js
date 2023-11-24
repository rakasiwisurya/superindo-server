"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransactionDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TransactionDetail.belongsTo(models.ProductVariant, {
        as: "product_variant",
        foreignKey: "product_variant_id",
      });

      TransactionDetail.belongsTo(models.Transaction, {
        as: "transaction",
        foreignKey: "transaction_id",
      });

      TransactionDetail.belongsTo(models.User, {
        foreignKey: "created_user",
      });

      TransactionDetail.belongsTo(models.User, {
        foreignKey: "updated_user",
      });
    }
  }
  TransactionDetail.init(
    {
      price: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      subtotal: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      product_variant_id: DataTypes.INTEGER,
      transaction_id: DataTypes.INTEGER,
      created_user: DataTypes.INTEGER,
      updated_user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TransactionDetail",
      tableName: "transaction_details",
      underscored: true,
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
  return TransactionDetail;
};

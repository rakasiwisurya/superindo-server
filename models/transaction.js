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
        foreignKey: "created_user",
      });

      Transaction.belongsTo(models.User, {
        foreignKey: "updated_user",
      });

      Transaction.belongsToMany(models.ProductVariant, {
        as: "transaction",
        through: {
          model: models.TransactionDetail,
        },
      });
    }
  }
  Transaction.init(
    {
      active: DataTypes.BOOLEAN,
      transaction_no: DataTypes.STRING,
      total_amount: DataTypes.INTEGER,
      created_user: DataTypes.INTEGER,
      updated_user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      underscored: true,
      createdAt: "created_date",
      updatedAt: "updated_date",
      hooks: {
        beforeValidate: (product, options) => {
          if (!product.transaction_no) {
            product.transaction_no =
              "TRNS" + (options.sequelizeInstance.lastID + 1).toString().padStart(6, "0");
          }
        },
      },
    }
  );
  return Transaction;
};

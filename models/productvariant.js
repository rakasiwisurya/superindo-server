"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductVariant.belongsTo(models.Product, {
        as: "product",
        foreignKey: "product_id",
      });

      ProductVariant.belongsTo(models.User, {
        as: "created_user",
        foreignKey: "created_user_id",
      });

      ProductVariant.belongsTo(models.User, {
        as: "updated_user",
        foreignKey: "updated_user_id",
      });

      ProductVariant.belongsToMany(models.Transaction, {
        as: "transaction",
        through: {
          model: models.TransactionDetail,
        },
      });

      ProductVariant.hasMany(models.TransactionDetail, {
        as: "transaction_detail",
      });
    }
  }
  ProductVariant.init(
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      price: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      image_location: DataTypes.STRING,
      product_id: DataTypes.INTEGER,
      created_user_id: DataTypes.INTEGER,
      updated_user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProductVariant",
      tableName: "product_variants",
      underscored: true,
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
  return ProductVariant;
};

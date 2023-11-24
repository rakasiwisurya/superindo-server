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
        foreignKey: "created_user",
      });

      ProductVariant.belongsTo(models.User, {
        foreignKey: "updated_user",
      });

      ProductVariant.belongsToMany(models.Transaction, {
        as: "transaction",
        through: {
          model: models.TransactionDetail,
        },
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
      created_user: DataTypes.INTEGER,
      updated_user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProductVariant",
      tableName: "product_variants",
      underscored: true,
      createdAt: "created_date",
      updatedAt: "updated_date",
      hooks: {
        beforeValidate: (product, options) => {
          if (!product.plu) {
            product.plu =
              "VRNT" + (options.sequelizeInstance.lastID + 1).toString().padStart(6, "0");
          }
        },
      },
    }
  );
  return ProductVariant;
};

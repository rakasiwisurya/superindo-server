"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.ProductCategory, {
        as: "product_category",
        foreignKey: "product_category_id",
      });

      Product.belongsTo(models.User, {
        foreignKey: "created_date",
      });

      Product.belongsTo(models.User, {
        foreignKey: "updated_user",
      });
    }
  }
  Product.init(
    {
      plu: DataTypes.STRING,
      name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      product_category_id: DataTypes.INTEGER,
      created_user: DataTypes.INTEGER,
      updated_user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      underscored: true,
      createdAt: "created_date",
      updatedAt: "updated_date",
      hooks: {
        beforeValidate: (product, options) => {
          if (!product.plu) {
            product.plu =
              "PDCT" + (options.sequelizeInstance.lastID + 1).toString().padStart(6, "0");
          }
        },
      },
    }
  );
  return Product;
};

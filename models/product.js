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
        as: "created_user",
        foreignKey: "created_user_id",
      });

      Product.belongsTo(models.User, {
        as: "updated_user",
        foreignKey: "updated_user_id",
      });
    }
  }
  Product.init(
    {
      plu: DataTypes.STRING,
      name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      product_category_id: DataTypes.INTEGER,
      created_user_id: DataTypes.INTEGER,
      updated_user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      underscored: true,
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
  return Product;
};

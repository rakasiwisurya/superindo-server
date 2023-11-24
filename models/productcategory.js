"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductCategory.belongsTo(models.User, {
        foreignKey: "created_user",
      });

      ProductCategory.belongsTo(models.User, {
        foreignKey: "updated_user",
      });
    }
  }
  ProductCategory.init(
    {
      name: DataTypes.STRING,
      created_user: DataTypes.INTEGER,
      updated_user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProductCategory",
      tableName: "product_categories",
      underscored: true,
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
  return ProductCategory;
};

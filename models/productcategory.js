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
        as: "created_user",
        foreignKey: "created_user_id",
      });

      ProductCategory.belongsTo(models.User, {
        as: "updated_user",
        foreignKey: "updated_user_id",
      });
    }
  }
  ProductCategory.init(
    {
      name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      created_user_id: DataTypes.INTEGER,
      updated_user_id: DataTypes.INTEGER,
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

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.ProductCategory, {
        as: "created_user_product_category",
        foreignKey: "created_user_id",
      });

      User.hasMany(models.ProductCategory, {
        as: "updated_user_product_category",
        foreignKey: "updated_user_id",
      });

      User.hasMany(models.Product, {
        as: "created_user_product",
        foreignKey: "created_user_id",
      });

      User.hasMany(models.Product, {
        as: "updated_user_product",
        foreignKey: "updated_user_id",
      });

      User.hasMany(models.ProductVariant, {
        as: "created_user_product_variant",
        foreignKey: "created_user_id",
      });

      User.hasMany(models.ProductVariant, {
        as: "updated_user_product_variant",
        foreignKey: "updated_user_id",
      });

      User.hasMany(models.Transaction, {
        as: "created_user_transaction",
        foreignKey: "created_user_id",
      });

      User.hasMany(models.Transaction, {
        as: "updated_user_transaction",
        foreignKey: "updated_user_id",
      });

      User.hasMany(models.TransactionDetail, {
        as: "created_user_transaction_detail",
        foreignKey: "created_user_id",
      });

      User.hasMany(models.TransactionDetail, {
        as: "updated_user_transaction_detail",
        foreignKey: "updated_user_id",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.ENUM("ADMINISTRATOR", "CUSTOMER"),
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      createdAt: "created_date",
      updatedAt: "updated_date",
    }
  );
  return User;
};

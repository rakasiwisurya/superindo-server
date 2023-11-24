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
      // define association here
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.ENUM("ADMINISTRATOR", "CUSTOMER", "OPERATOR"),
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

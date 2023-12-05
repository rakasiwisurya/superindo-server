const Joi = require("joi");
const { Product, ProductCategory, User } = require("../models");
const { Op } = require("sequelize");

exports.addProduct = async (req, res) => {
  const { plu, name } = req.body;
  const { id: userId } = req.user;

  const schema = Joi.object({
    plu: Joi.string().max(10).required(),
    name: Joi.string().max(100).required(),
    product_category_id: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const isProductExist = await Product.findOne({
      where: {
        [Op.or]: { plu, name },
      },
      attributes: ["name", "plu"],
    });

    if (isProductExist) {
      return res.status(400).send({
        status: "Failed",
        message: "Product already exist",
      });
    }

    await Product.create({
      ...req.body,
      created_user_id: userId,
      updated_user_id: userId,
    });

    res.send({
      status: "Success",
      message: "Success add product",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    let products = await Product.findAll({
      where: { active: true },
      order: [["created_date", "DESC"]],
      include: [
        {
          model: ProductCategory,
          as: "product_category",
          attributes: ["name"],
        },
        {
          model: User,
          as: "created_user",
          attributes: ["username"],
        },
        {
          model: User,
          as: "updated_user",
          attributes: ["username"],
        },
      ],
    });

    products = JSON.parse(JSON.stringify(products));

    const data = products.map((product) => {
      const newData = {
        ...product,
        product_category_name: product.product_category.name,
        created_user: product.created_user.username,
        updated_user: product.updated_user.username,
      };
      delete newData.product_category;
      return newData;
    });

    res.send({
      status: "Success",
      message: "Success get all product",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let data = await Product.findOne({
      where: { id, active: true },
      include: [
        {
          model: ProductCategory,
          as: "product_category",
          attributes: ["name"],
        },
        {
          model: User,
          as: "created_user",
          attributes: ["username"],
        },
        {
          model: User,
          as: "updated_user",
          attributes: ["username"],
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    if (data) {
      data.product_category_name = data.product_category.name;
      data.created_user = data.created_user.username;
      data.updated_user = data.updated_user.username;
      delete data.product_category;
    }

    res.send({
      status: "Success",
      message: "Success get detail product",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const payload = {
    ...req.body,
    updated_user_id: userId,
  };

  try {
    await Product.update(payload, {
      where: { id },
    });

    res.send({
      status: "Success",
      message: "Success update product",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

exports.nonactiveProduct = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const payload = {
    active: false,
    updated_user_id: userId,
  };

  try {
    await Product.update(payload, {
      where: { id },
    });

    res.send({
      status: "Success",
      message: "Success nonactivate product",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

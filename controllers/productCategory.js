const Joi = require("joi");
const { ProductCategory, User } = require("../models");

exports.addProductCategory = async (req, res) => {
  const { name } = req.body;
  const { id: userId } = req.user;

  const schema = Joi.object({
    name: Joi.string().max(30).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const isProductCategoryExist = await ProductCategory.findOne({
      where: { name },
      attributes: ["name"],
    });

    if (isProductCategoryExist) {
      return res.status(400).send({
        status: "Failed",
        message: "Product category already exist",
      });
    }

    await ProductCategory.create({
      name,
      created_user_id: userId,
      updated_user_id: userId,
    });

    res.send({
      status: "Success",
      message: "Success add product category",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.getProductCategories = async (req, res) => {
  try {
    let productCategories = await ProductCategory.findAll({
      where: { active: true },
      order: [["created_date", "DESC"]],
      include: [
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

    productCategories = JSON.parse(JSON.stringify(productCategories));

    const data = productCategories?.map((productCategory) => ({
      ...productCategory,
      created_user: productCategory.created_user.username,
      updated_user: productCategory.updated_user.username,
    }));

    res.send({
      status: "Success",
      message: "Success get all product categories",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.getProductCategory = async (req, res) => {
  const { id } = req.params;

  try {
    let data = await ProductCategory.findOne({
      where: { id, active: true },
      include: [
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
      data.created_user = data.created_user.username;
      data.updated_user = data.updated_user.username;
    }

    res.send({
      status: "Success",
      message: "Success get detail product category",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.updateProductCategory = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const payload = {
    ...req.body,
    updated_user_id: userId,
  };

  try {
    await ProductCategory.update(payload, {
      where: { id },
    });

    res.send({
      status: "Success",
      message: "Success update product category",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.nonactiveProductCategory = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const payload = {
    active: false,
    updated_user_id: userId,
  };

  try {
    await ProductCategory.update(payload, {
      where: { id },
    });

    res.send({
      status: "Success",
      message: "Success nonactivate product category",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

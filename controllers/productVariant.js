const Joi = require("joi");
const { Op } = require("sequelize");
const { Product, ProductVariant, User } = require("../models");
const { cloudinary } = require("../libraries/cloudinary");

exports.addProductVariant = async (req, res) => {
  const { name, code, price, qty, product_id } = req.body;
  const { id: userId } = req.user;

  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    code: Joi.string().max(10).required(),
    price: Joi.number().required(),
    qty: Joi.number().required(),
    product_id: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const isProductVariantExist = await ProductVariant.findOne({
      where: {
        [Op.or]: { code, name },
      },
      attributes: ["code", "name"],
    });

    if (isProductVariantExist) {
      return res.status(400).send({
        status: "Failed",
        message: "Product variant already exist",
      });
    }

    const payload = {
      name,
      code,
      price,
      qty,
      product_id,
      created_user_id: userId,
      updated_user_id: userId,
    };

    if (req.file) {
      if (process.env.NODE_ENV === "production") {
        const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
          folder: "/superindo/product_variants",
          use_filename: true,
          unique_filename: false,
        });

        payload.image_location = cloudinaryUpload.public_id;
      } else {
        payload.image_location = req.file.filename;
      }
    }

    await ProductVariant.create(payload);

    res.send({
      status: "Success",
      message: "Success add product variant",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.getProductVariants = async (req, res) => {
  try {
    let productVariants = await ProductVariant.findAll({
      where: { active: true },
      order: [["created_date", "DESC"]],
      include: [
        {
          model: Product,
          as: "product",
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

    productVariants = JSON.parse(JSON.stringify(productVariants));

    const data = productVariants?.map((productVariant) => {
      const newData = {
        ...productVariant,
        image_location:
          process.env.NODE_ENV === "production" && productVariant.image_location
            ? cloudinary.url(productVariant.image_location)
            : `${req.protocol}://${req.headers.host}/${process.env.UPLOAD_PATH}/${
                productVariant.image_location ?? "no-image.png"
              }`,
        product_name: productVariant.product.name,
        created_user: productVariant.created_user.username,
        updated_user: productVariant.updated_user.username,
      };
      delete newData.product;
      return newData;
    });

    res.send({
      status: "Success",
      message: "Success get all product variant",
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

exports.getProductVariant = async (req, res) => {
  const { id } = req.params;

  try {
    let data = await ProductVariant.findOne({
      where: { id, active: true },
      include: [
        {
          model: Product,
          as: "product",
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
      data.image_location =
        process.env.NODE_ENV === "production" && data.image_location
          ? cloudinary.url(data.image_location)
          : `${req.protocol}://${req.headers.host}/${process.env.UPLOAD_PATH}/${
              data.image_location ?? "no-image.png"
            }`;
      data.product_name = data.product.name;
      data.created_user = data.created_user.username;
      data.updated_user = data.updated_user.username;
      delete data.product;
    }

    res.send({
      status: "Success",
      message: "Success get detail product variant",
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

exports.updateProductVariant = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const payload = {
    ...req.body,
    updated_user_id: userId,
  };

  try {
    const productVariant = await ProductVariant.findOne({
      where: { id },
    });

    if (req.file) {
      if (process.env.NODE_ENV === "production") {
        if (productVariant.image_location) {
          await cloudinary.uploader.destroy(productVariant.image_location);
        }

        const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
          folder: "/superindo/product_variants",
          use_filename: true,
          unique_filename: false,
        });

        payload.image_location = cloudinaryUpload.public_id;
      } else {
        payload.image_location = req.file.filename;
      }
    }

    await ProductVariant.update(payload, {
      where: { id },
    });

    res.send({
      status: "Success",
      message: "Success update product variant",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.nonactiveProductVariant = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const payload = {
    active: false,
    updated_user_id: userId,
  };

  try {
    await ProductVariant.update(payload, {
      where: { id },
    });

    res.send({
      status: "Success",
      message: "Success nonactivate product variant",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.deleteProductVariant = async (req, res) => {
  const { id } = req.params;

  try {
    if (process.env.NODE_ENV === "production") {
      const productVariant = await ProductVariant.findOne({
        where: { id },
      });

      if (productVariant?.image_location) {
        await cloudinary.uploader.destroy(productVariant.image_location);
      }
    }

    await ProductVariant.destroy({ where: { id } });

    res.send({
      status: "Success",
      message: "Success delete product variant",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {
  Product,
  ProductCategory,
  ProductVariant,
  Transaction,
  TransactionDetail,
  User,
} = require("../models");

exports.register = async (req, res) => {
  const { username, password } = req.body;

  const schema = Joi.object({
    username: Joi.string().max(30).required(),
    password: Joi.string().max(255).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const user = await User.findOne({ where: { username }, attributes: ["username"] });

    if (user) {
      return res.status(400).send({
        status: "Failed",
        message: "Username already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userData = await User.create({
      username,
      password: hashedPassword,
    });

    userData = JSON.parse(JSON.stringify(userData));
    delete userData.password;
    delete userData.updated_date;
    delete userData.created_date;

    const token = jwt.sign(userData, process.env.TOKEN_KEY);

    res.send({
      status: "Success",
      message: "Your account has succesfully created",
      data: { ...userData, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  const schema = Joi.object({
    username: Joi.string().max(30).required(),
    password: Joi.string().max(255).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const user = await User.findOne({ where: { username }, attributes: ["username"] });

    if (user) {
      return res.status(400).send({
        status: "Failed",
        message: "Username already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userData = await User.create({
      username,
      password: hashedPassword,
      role: "ADMINISTRATOR",
    });

    userData = JSON.parse(JSON.stringify(userData));
    delete userData.password;
    delete userData.updated_date;
    delete userData.created_date;

    const token = jwt.sign(userData, process.env.TOKEN_KEY);

    res.send({
      status: "Success",
      message: "Your account has succesfully created",
      data: { ...userData, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    let user = await User.findOne({
      where: { username },
      attributes: {
        exclude: ["created_date", "updated_date"],
      },
    });

    if (!user) {
      return res.status(400).send({
        status: "Failed",
        message: "Username or password is incorrect",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "Username or password is incorrect",
      });
    }

    user = JSON.parse(JSON.stringify(user));
    delete user.password;

    const token = jwt.sign(user, process.env.TOKEN_KEY);

    res.send({
      status: "Success",
      message: "Login succesful",
      data: { ...user, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    let user = await User.findOne({
      where: { username },
      attributes: {
        exclude: ["created_date", "updated_date"],
      },
    });

    if (!user) {
      return res.status(400).send({
        status: "Failed",
        message: "Username or password is incorrect",
      });
    }

    if (user?.role !== "ADMINISTRATOR") {
      return res.status(400).send({
        status: "Failed",
        message: "You are not administrator",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "Username or password is incorrect",
      });
    }

    user = JSON.parse(JSON.stringify(user));
    delete user.password;

    const token = jwt.sign(user, process.env.TOKEN_KEY);

    res.send({
      status: "Success",
      message: "Login succesful",
      data: { ...user, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.getUserTransactions = async (req, res) => {
  // const { offset, limit = 10 } = req.query;
  const { id } = req.user;

  try {
    let userTransactions = await Transaction.findAll({
      where: { created_user_id: id },
      // offset,
      // limit,
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

    userTransactions = JSON.parse(JSON.stringify(userTransactions));

    const data = userTransactions?.map((userTransaction) => {
      const newData = {
        id: userTransaction.id,
        active: userTransaction.active,
        transaction_no: userTransaction.transaction_no,
        total_amount: userTransaction.total_amount,
        created_user_id: userTransaction.created_user_id,
        updated_user_id: userTransaction.updated_user_id,
        created_date: userTransaction.created_date,
        updated_date: userTransaction.updated_date,
        created_user: userTransaction.created_user.username,
        updated_user: userTransaction.updated_user.username,
      };

      delete userTransaction.transaction_detail;

      return newData;
    });

    res.send({
      status: "Success",
      message: "Success get all user transaction",
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

exports.getUserTransaction = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  try {
    let transaction = await Transaction.findOne({
      where: { id, created_user_id: userId, active: true },
      include: [
        {
          model: TransactionDetail,
          as: "transaction_detail",
          attributes: [
            "id",
            "price",
            "qty",
            "subtotal",
            "active",
            "product_variant_id",
            "transaction_id",
            "created_user_id",
            "updated_user_id",
            "created_date",
            "updated_date",
          ],
          include: [
            {
              model: ProductVariant,
              as: "product_variant",
              include: [
                {
                  model: Product,
                  as: "product",
                  include: {
                    model: ProductCategory,
                    as: "product_category",
                  },
                },
              ],
            },
          ],
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

    transaction = JSON.parse(JSON.stringify(transaction));

    const data = {
      id: transaction.id,
      transaction_no: transaction.transaction_no,
      total_amount: transaction.total_amount,
      created_user: transaction.created_user.username,
      updated_user: transaction.updated_user.username,
      created_user_id: transaction.created_user_id,
      updated_user_id: transaction.updated_user_id,
      created_date: transaction.created_date,
      updated_date: transaction.updated_date,
      transaction_details: transaction.transaction_detail?.map((transactionDetail) => ({
        id: transactionDetail.id,
        price: transactionDetail.price,
        qty: transactionDetail.qty,
        subtotal: transactionDetail.subtotal,
        product_variant_id: transactionDetail.product_variant.id,
        product_variant_name: transactionDetail.product_variant.name,
        product_variant_code: transactionDetail.product_variant.code,
        product_variant_price: transactionDetail.product_variant.price,
        product_variant_image_location: transactionDetail.product_variant.image_location,
        product_id: transactionDetail.product_variant.product.id,
        product_plu: transactionDetail.product_variant.product.plu,
        product_name: transactionDetail.product_variant.product.name,
        product_category_id: transactionDetail.product_variant.product.product_category.id,
        product_category_name: transactionDetail.product_variant.product.product_category.nam,
      })),
    };

    res.send({
      status: "Success",
      message: "Success get detail user transaction",
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

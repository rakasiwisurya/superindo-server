const Joi = require("joi");
const { sequelize, ProductVariant, Transaction, TransactionDetail, User } = require("../models");

exports.addTransaction = async (req, res) => {
  const { products } = req.body;
  const { id: userId } = req.user;

  const schema = Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          qty: Joi.number().required(),
          product_variant_id: Joi.number().required(),
        })
      )
      .required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  const t = await sequelize.transaction();

  try {
    let totalAmount = 0;

    const lastTransaction = await Transaction.findOne({
      order: [["transaction_no", "DESC"]],
      limit: 1,
      attributes: ["transaction_no"],
      transaction: t,
    });

    const transactionInit = await Transaction.create(
      {
        total_amount: totalAmount,
        transaction_no: lastTransaction
          ? `TRNS${String(+lastTransaction.transaction_no.substring(6) + 1).padStart(6, "0")}`
          : `TRNS000001`,
        created_user_id: userId,
        updated_user_id: userId,
      },
      { transaction: t }
    );

    await Promise.all(
      products.map(async ({ qty, product_variant_id }) => {
        const productVariant = await ProductVariant.findOne({
          where: { id: product_variant_id },
          attributes: ["price", "qty"],
          transaction: t,
        });

        const restQty = productVariant.qty - qty;
        const subtotal = productVariant.price * qty;
        totalAmount += subtotal;

        await ProductVariant.update(
          { qty: restQty, updated_user_id: userId },
          { where: { id: product_variant_id }, transaction: t }
        );

        await TransactionDetail.create(
          {
            price: productVariant.price,
            qty,
            subtotal,
            product_variant_id,
            transaction_id: transactionInit.id,
            created_user_id: userId,
            updated_user_id: userId,
          },
          { transaction: t }
        );
      })
    );

    await Transaction.update(
      { total_amount: totalAmount },
      {
        where: { id: transactionInit.id },
        transaction: t,
      }
    );

    await t.commit();

    res.send({
      status: "Success",
      message: "Success create new transaction",
    });
  } catch (error) {
    await t.rollback();

    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    let data = await TransactionDetail.findAll({
      where: { active: true },
      order: [["created_date", "DESC"]],
      include: [
        {
          model: ProductVariant,
          as: "product_variant",
        },
        {
          model: Transaction,
          as: "transaction",
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

    res.send({
      status: "Success",
      message: "Success get all transaction",
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

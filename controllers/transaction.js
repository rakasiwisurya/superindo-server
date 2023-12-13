const Joi = require("joi");
const {
  sequelize,
  Product,
  ProductCategory,
  ProductVariant,
  Transaction,
  TransactionDetail,
  User,
} = require("../models");

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
      await products.map(async ({ qty, product_variant_id }) => {
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
            ProductVariantId: product_variant_id,
            TransactionId: transactionInit.id,
            created_user_id: userId,
            updated_user_id: userId,
          },
          { transaction: t }
        );
      })
    );

    transactionInit.set({ total_amount: totalAmount });
    await transactionInit.save({ transaction: t });

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
      message: error.message,
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    let transactions = await Transaction.findAll({
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

    transactions = JSON.parse(JSON.stringify(transactions));

    const data = transactions?.map((transaction) => ({
      ...transaction,
      created_user: transaction.created_user.username,
      updated_user: transaction.updated_user.username,
    }));

    res.send({
      status: "Success",
      message: "Success get all transaction",
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

exports.getTransactionDetails = async (req, res) => {
  try {
    let transactionDetails = await TransactionDetail.findAll({
      where: { active: true },
      order: [["created_date", "DESC"]],
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

    transactionDetails = JSON.parse(JSON.stringify(transactionDetails));

    const data = transactionDetails?.map((transactionDetail) => {
      const newData = {
        ...transactionDetail,
        transaction_no: transactionDetail.transaction.transaction_no,
        product_variant_code: transactionDetail.product_variant.code,
        product_variant_name: transactionDetail.product_variant.name,
        product_variant_image_location: `${req.protocol}://${req.headers.host}/${
          process.env.UPLOAD_PATH
        }/${transactionDetail.product_variant.image_location ?? "no-image.png"}`,
        product_plu: transactionDetail.product_variant.product.plu,
        product_name: transactionDetail.product_variant.product.name,
        product_category_name: transactionDetail.product_variant.product.product_category.name,
        created_user: transactionDetail.created_user.username,
        updated_user: transactionDetail.updated_user.username,
      };

      delete newData.product_variant;
      delete newData.ProductVariantId;
      delete newData.transaction;
      delete newData.TransactionId;

      return newData;
    });

    res.send({
      status: "Success",
      message: "Success get all transaction",
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

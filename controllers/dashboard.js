const { Product, ProductCategory, ProductVariant, Transaction, User } = require("../models");

exports.getDashboard = async (req, res) => {
  try {
    const totalProduct = await Product.count({ where: { active: true } });
    const totalProductCategory = await ProductCategory.count({ where: { active: true } });
    const totalProductVariant = await ProductVariant.count({ where: { active: true } });
    const totalTransaction = await Transaction.count({ where: { active: true } });
    const totalCustomerUser = await User.count({ where: { role: "CUSTOMER" } });
    const totalAdministratorUser = await User.count({ where: { role: "ADMINISTRATOR" } });

    res.send({
      status: "Success",
      message: "Success get dashboard data summarry",
      data: {
        total_product: totalProduct,
        total_product_category: totalProductCategory,
        total_product_variant: totalProductVariant,
        total_transaction: totalTransaction,
        total_customer_user: totalCustomerUser,
        total_adminstrator_user: totalAdministratorUser,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

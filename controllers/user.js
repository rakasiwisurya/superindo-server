const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

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
      message: "Internal server error",
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
      message: "Internal server error",
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
      message: "Internal server error",
    });
  }
};

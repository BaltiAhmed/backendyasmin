const httpError = require("../models/error");

const admin = require("../models/admin");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { email, password } = req.body;
  let existingAdmin;
  try {
    existingAdmin = await admin.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existingAdmin) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createdAdmin = new admin({
    email,
    password,
  });

  try {
    await createdAdmin.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { id: createdAdmin.id, email: createdAdmin.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  res.status(201).json({
    adminId: createdAdmin.id,
    email: createdAdmin.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed", 422));
  }
  const { email, password } = req.body;
  let existingAdmin;
  try {
    existingAdmin = await admin.findOne({ email: email });
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingAdmin || existingAdmin.password !== password) {
    return next(new httpError("user does not exist", 422));
  }
  let token;
  try {
    token = jwt.sign(
      { id: existingAdmin.id, email: existingAdmin.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ admin: existingAdmin, token: token });
};

const getAdmin = async (req, res, next) => {
  let existingAdmin;
  try {
    existingAdmin = await admin.find();
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ admin: existingAdmin });
};


exports.signup = signup
exports.login = login
exports.getAdmin = getAdmin

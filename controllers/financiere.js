const httpError = require("../models/error");

const financiere = require("../models/financiere");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  /* const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  } */

  const {
    nom,
    prenom,
    adresse,
    telephone,
    cin,
    budget,
    domaine,
    email,
    password,
  } = req.body;
  let existingfinanciere;
  try {
    existingfinanciere = await financiere.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existingfinanciere) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createdfinanciere = new financiere({
    nom,
    prenom,
    adresse,
    telephone,
    cin,
    budget,
    domaine,
    image: req.file.path,
    email,
    password,
    projets: [],
  });

  try {
    await createdfinanciere.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { id: createdfinanciere.id, email: createdfinanciere.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  res.status(201).json({
    useidrId: createdfinanciere.id,
    email: createdfinanciere.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed", 422));
  }
  const { email, password } = req.body;
  let existingfinanciere;
  try {
    existingfinanciere = await financiere.findOne({ email: email });
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingfinanciere || existingfinanciere.password !== password) {
    return next(new httpError("user does not exist", 422));
  }
  let token;
  try {
    token = jwt.sign(
      { id: existingfinanciere.id, email: existingfinanciere.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ financiere: existingfinanciere, token: token });
};

const updatefinanciere = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const {
    nom,
    prenom,
    adresse,
    telephone,
    cin,
    budget,
    domaine,
    email,
    password,
  } = req.body;
  const id = req.params.id;
  let existingfinanciere;

  try {
    existingfinanciere = await financiere.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  existingfinanciere.nom = nom;
  existingfinanciere.prenom = prenom;
  existingfinanciere.adresse = adresse;
  existingfinanciere.telephone = telephone;
  existingfinanciere.cin = cin;
  existingfinanciere.budget = budget;
  existingfinanciere.domaine = domaine;
  existingfinanciere.image = req.file.path;
  existingfinanciere.email = email;
  existingfinanciere.password = password;

  try {
    existingfinanciere.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ existingfinanciere: existingfinanciere });
};

const getfinanciere = async (req, res, next) => {
  let existingfinanciere;
  try {
    existingfinanciere = await financiere.find({}, "-pasword");
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingfinanciere: existingfinanciere });
};

const getfinanciereById = async (req, res, next) => {
  const id = req.params.id;
  let existingfinanciere;
  try {
    existingfinanciere = await financiere.findById(id);
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingfinanciere: existingfinanciere });
};

const deletefinanciere = async (req, res, next) => {
  const id = req.params.id;
  let existingfinanciere;
  try {
    existingfinanciere = await financiere.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingfinanciere) {
    return next(new httpError("user does not exist ", 500));
  }
  try {
    existingfinanciere.remove();
  } catch {
    return next(new httpError("failed ", 500));
  }
  res.status(200).json({ message: "deleted" });
};

exports.signup = signup;
exports.login = login;
exports.updatefinanciere = updatefinanciere;
exports.getfinanciere = getfinanciere;
exports.getfinanciereById = getfinanciereById;
exports.deletefinanciere = deletefinanciere;

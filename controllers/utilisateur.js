const httpError = require("../models/error");

const utilisateur = require("../models/utilisateur");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const { create } = require("../models/utilisateur");

const signup = async (req, res, next) => {
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
    qualification,
    email,
    password,
  } = req.body;
  let existingUtilisateur;
  try {
    existingUtilisateur = await utilisateur.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existingUtilisateur) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  

  const createdUtilisateur = new utilisateur({
    nom,
    prenom,
    adresse,
    telephone,
    cin,
    qualification,
    email,
    password,
    projets: [],
  });

  

  try {
    await createdUtilisateur.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { id: createdUtilisateur.id, email: createdUtilisateur.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  res
    .status(201)
    .json({
      useidrId: createdUtilisateur.id,
      email: createdUtilisateur.email,
      token: token,
    });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed", 422));
  }
  const { email, password } = req.body;
  let existingUtilisateur;
  try {
    existingUtilisateur = await utilisateur.findOne({ email: email });
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingUtilisateur || existingUtilisateur.password !== password) {
    return next(new httpError("user does not exist", 422));
  }
  let token;
  try {
    token = jwt.sign(
      { id: existingUtilisateur.id, email: existingUtilisateur.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ utilisateur: existingUtilisateur, token: token });
};

const updateUtilisateur = async (req, res, next) => {
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
    qualification,
    email,
    password,
  } = req.body;
  const id = req.params.id;
  let existingUtilisateur;

  try {
    existingUtilisateur = await utilisateur.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  existingUtilisateur.nom = nom;
  existingUtilisateur.prenom = prenom;
  existingUtilisateur.adresse = adresse;
  existingUtilisateur.telephone = telephone;
  existingUtilisateur.cin = cin;
  existingUtilisateur.qualification = qualification;
  existingUtilisateur.email = email;
  existingUtilisateur.password = password;

  try {
    existingUtilisateur.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ existingUtilisateur: existingUtilisateur });
};

const getUtilisateur = async (req, res, next) => {
  let existingUtilisateur;
  try {
    existingUtilisateur = await utilisateur.find({}, "-pasword");
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingUtilisateur: existingUtilisateur });
};

const getUtilisateurById = async (req, res, next) => {
  const id = req.params.id;
  let existingUtilisateur;
  try {
    existingUtilisateur = await utilisateur.findById(id);
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingUtilisateur: existingUtilisateur });
};

const deleteUtilisateur = async (req, res, next) => {
  const id = req.params.id;
  let existingUtilisateur;
  try {
    existingUtilisateur = await utilisateur.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingUtilisateur) {
    return next(new httpError("user does not exist ", 500));
  }
  try {
    existingUtilisateur.remove();
  } catch {
    return next(new httpError("failed ", 500));
  }
  res.status(200).json({ message: "deleted" });
};

exports.signup = signup;
exports.login = login;
exports.updateUtilisateur = updateUtilisateur;
exports.getUtilisateur = getUtilisateur;
exports.getUtilisateurById = getUtilisateurById;
exports.deleteUtilisateur = deleteUtilisateur;

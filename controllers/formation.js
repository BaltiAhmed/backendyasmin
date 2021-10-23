const httpError = require("../models/error");
const formation = require("../models/formation");
const utilisateur = require("../models/utilisateur");
const { validationResult } = require("express-validator");

const ajout = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { titre, dateI, sujet, dateD, description } = req.body;

  const createdFormation = new formation({
    titre,
    dateI,
    image: req.file.path,
    sujet,
    dateD,
    description,
    condidat: [],
    participants: [],
  });

  try {
    await createdFormation.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ formation: createdFormation });
};

const getFormation = async (req, res, next) => {
  let existingFormation;
  try {
    existingFormation = await formation.find();
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ formations: existingFormation });
};

const getFormationById = async (req, res, next) => {
  const id = req.params.id;
  let existingFormation;
  try {
    existingFormation = await formation.findById(id);
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ formations: existingFormation });
};

const updateFormation = async (req, res, next) => {
  const id = req.params.id;
  const { titre, dateI, sujet, dateD, description } = req.body;

  let existingFormation;
  try {
    existingFormation = await formation.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingFormation.titre = titre;
  existingFormation.dateI = dateI;
  existingFormation.image = req.file.path;
  existingFormation.sujet = sujet;
  existingFormation.dateD = dateD;
  existingFormation.description = description;

  try {
    existingFormation.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ formation: existingFormation });
};

const deleteFormation = async (req, res, next) => {
  const id = req.params.id;
  let existingFormation;
  try {
    existingFormation = await formation.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingFormation) {
    return next(new httpError("user does not exist ", 500));
  }
  try {
    existingFormation.remove();
  } catch {
    return next(new httpError("failed ", 500));
  }
  res.status(200).json({ message: "deleted" });
};

exports.ajout = ajout;
exports.getFormation = getFormation;
exports.getFormationById = getFormationById;
exports.updateFormation = updateFormation;
exports.deleteFormation = deleteFormation
const httpError = require("../models/error");

const production = require("../models/production");
const projet = require("../models/projet");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const ajout = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { type, marche, idProjet } = req.body;

  let existingProjet;
  try {
    existingProjet = await projet.findById(idProjet);
  } catch {
    return next(new httpError("failed ", 500));
  }

  const createdProduction = new production({
    type,
    marche,
  });

  try {
    await createdProduction.save();
    existingProjet.productions.push(createdProduction);
    await existingProjet.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ createdProduction });
};

const updateProduction = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }
  const id = req.params.id;
  const { type, marche } = req.body;

  let existingProduction;
  try {
    existingProduction = await production.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingProduction.type = type;
  existingProduction.marche = marche;

  try {
    existingProduction.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ existingProduction });
};

const getProduction = async (req, res, next) => {
  let existingProduction;
  try {
    existingProduction = await production.find();
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ production: existingProduction });
};

const getProductionById = async (req, res, next) => {
  const id = req.params.id;
  let existingProduction;
  try {
    existingProduction = await production.findById(id);
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingProduction });
};

const deleteProduction = async (req, res, next) => {
  const id = req.params.id;
  let existingProduction;
  try {
    existingProduction = await production.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingProduction) {
    return next(new httpError(" does not exist ", 500));
  }
  try {
    existingProduction.remove();
  } catch {
    return next(new httpError("failed ", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const getProductionByProjectId = async (req, res, next) => {
    const id = req.params.id;
  
    let existingProduction;
    try {
        existingProduction = await projet.findById(id).populate("productions");
    } catch (err) {
      const error = new httpError(
        "Fetching project failed, please try again later.",
        500
      );
      return next(error);
    }
  
    if (!existingProduction || existingProduction.productions.length === 0) {
      return next(
        new httpError("Could not find project for the provided user id.", 404)
      );
    }
  
    res.json({
      production: existingProduction.productions.map((el) =>
        el.toObject({ getters: true })
      ),
    });
  };

exports.ajout = ajout;
exports.updateProduction = updateProduction;
exports.getProduction = getProduction;
exports.getProductionById = getProductionById;
exports.deleteProduction = deleteProduction;
exports.getProductionByProjectId = getProductionByProjectId

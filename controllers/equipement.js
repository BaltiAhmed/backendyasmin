const httpError = require("../models/error");

const equipement = require("../models/equipement");
const projet = require("../models/projet");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const ajout = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, type, prix, quantite, idProjet } = req.body;

  let existingProjet;
  try {
    existingProjet = await projet.findById(idProjet);
  } catch {
    return next(new httpError("failed ", 500));
  }

  const createdEquipement = new equipement({
    nom,
    type,
    prix,
    quantite,
  });

  try {
    await createdEquipement.save();
    existingProjet.equipements.push(createdEquipement);
    await existingProjet.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ createdEquipement });
};

const updateEquipement = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }
  const id = req.params.id;
  const { nom, type, prix, quantite } = req.body;

  let existingEquipement;
  try {
    existingEquipement = await equipement.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingEquipement.nom = nom;
  existingEquipement.type = type;
  existingEquipement.prix = prix;
  existingEquipement.quantite = quantite;

  try {
    existingEquipement.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ existingEquipement });
};

const getEquipement = async (req, res, next) => {
  let existingEquipement;
  try {
    existingEquipement = await equipement.find();
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingEquipement });
};

const getEquipementById = async (req, res, next) => {
  const id = req.params.id;
  let existingEquipement;
  try {
    existingEquipement = await equipement.findById(id);
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingEquipement });
};

const deleteEquipement = async (req, res, next) => {
  const id = req.params.id;
  let existingEquipement;
  try {
    existingEquipement = await equipement.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingEquipement) {
    return next(new httpError("user does not exist ", 500));
  }
  try {
    existingEquipement.remove();
  } catch {
    return next(new httpError("failed ", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const getEquimentByProjectId = async (req, res, next) => {
  const id = req.params.id;

  let existingEquipement;
  try {
    existingEquipement = await projet.findById(id).populate("equipements");
  } catch (err) {
    const error = new httpError(
      "Fetching project failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingEquipement || existingEquipement.equipements.length === 0) {
    return next(
      new httpError("Could not find project for the provided user id.", 404)
    );
  }

  res.json({
    equipements: existingEquipement.equipements.map((el) =>
      el.toObject({ getters: true })
    ),
  });
};

exports.ajout = ajout;
exports.updateEquipement = updateEquipement;
exports.getEquipement = getEquipement;
exports.getEquipementById = getEquipementById;
exports.deleteEquipement = deleteEquipement;
exports.getEquimentByProjectId = getEquimentByProjectId;

const httpError = require("../models/error");
const projet = require("../models/projet");
const utilisateur = require("../models/utilisateur");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const ajout = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { titre, descreption, datelancement, IdUtilisateur } = req.body;

  let existingUtilisateur;
  try {
    existingUtilisateur = await utilisateur.findById(IdUtilisateur);
  } catch {
    return next(new httpError("failed ", 500));
  }

  const createdProjet = new projet({
    titre,
    descreption,
    datelancement,
    equipements: [],
    marketings: [],
  });

  try {
    await createdProjet.save();
    existingUtilisateur.projets.push(createdProjet);
    await existingUtilisateur.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ createdProjet });
};

const updateProjet = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }
  const id = req.params.id;
  const { titre, descreption, datelancement } = req.body;

  let existingProjet;
  try {
    existingProjet = await projet.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingProjet.titre = titre;
  existingProjet.descreption = descreption;
  existingProjet.datelancement = datelancement;

  try {
    existingProjet.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ existingProjet });
};

const getProjet = async (req, res, next) => {
  let existingProjet;
  try {
    existingProjet = await projet.find();
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingProjet });
};

const getProjetById = async (req, res, next) => {
  const id = req.params.id;
  let existingProjet;
  try {
    existingProjet = await projet.findById(id);
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingProjet: existingProjet });
};

const deleteProjet = async (req, res, next) => {
  const id = req.params.id;
  let existingProjet;
  try {
    existingProjet = await projet.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingProjet) {
    return next(new httpError("user does not exist ", 500));
  }
  try {
    existingProjet.remove();
  } catch {
    return next(new httpError("failed ", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const getProjetByUserId = async (req, res, next) => {
    const id = req.params.id;
  
    let existingUser;
    try {
        existingUser = await utilisateur.findById(id).populate("projets");
    } catch (err) {
      const error = new httpError(
        "Fetching project failed, please try again later.",
        500
      );
      return next(error);
    }
  
    if (!existingUser || existingUser.projets.length === 0) {
      return next(
        new httpError("Could not find project for the provided user id.", 404)
      );
    }
  
    res.json({
      projet: existingUser.projets.map((el) =>
        el.toObject({ getters: true })
      ),
    });
  };

exports.ajout = ajout;
exports.updateProjet = updateProjet;
exports.getProjet = getProjet;
exports.getProjetById = getProjetById;
exports.deleteProjet = deleteProjet;
exports.getProjetByUserId = getProjetByUserId

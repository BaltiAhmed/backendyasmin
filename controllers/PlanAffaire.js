const httpError = require("../models/error");
const planaffaire = require("../models/PlanAffaire");
const { validationResult } = require("express-validator");
const projet = require("../models/projet");

const ajout = async (req, res, next) => {
  const { description, date, IdProjet } = req.body;

  const createdPlanAffaire = new planaffaire({
    description,
    date,
  });

  console.log(description, date, IdProjet)

  let exististingProjet;

  try {
    exististingProjet = await projet.findById(IdProjet);
  } catch (err) {
    const error = new httpError("problem !!!!!", 500);
    return next(error);
  }

  console.log(exististingProjet);

  try {
    await createdPlanAffaire.save();
    exististingProjet.planAffaire.push(createdPlanAffaire);
    exististingProjet.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ planAffaire: createdPlanAffaire });
};

const getPlanaffaireByProjetId = async (req, res, next) => {
  const id = req.params.id;

  let existingPlanAffaire;
  try {
    existingPlanAffaire = await projet.findById(id).populate("planAffaire");
  } catch (err) {
    const error = new httpError(
      "Fetching failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingPlanAffaire || existingPlanAffaire.planAffaire.length === 0) {
    return next(
      new httpError("Could not find for the provided user id.", 404)
    );
  }

  res.json({
    PlanAffaire: existingPlanAffaire.planAffaire.map((el) =>
      el.toObject({ getters: true })
    ),
  });
};

exports.ajout = ajout;
exports.getPlanaffaireByProjetId = getPlanaffaireByProjetId

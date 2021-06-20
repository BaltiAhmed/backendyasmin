const httpError = require("../models/error");

const marketing = require("../models/marketing");
const projet = require("../models/projet");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const ajout = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { type, cout, duree, idProjet } = req.body;

  let existingProjet;
  try {
    existingProjet = await projet.findById(idProjet);
  } catch {
    return next(new httpError("failed ", 500));
  }

  const createdMarketing = new marketing({
    type,
    cout,
    duree,
  });

  try {
    await createdMarketing.save();
    existingProjet.marketings.push(createdMarketing);
    await existingProjet.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ marketing: createdMarketing });
};

const updateMarketing = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }
  const id = req.params.id;
  const { type, cout, duree } = req.body;

  let existingMarketing;
  try {
    existingMarketing = await marketing.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingMarketing.type = type;
  existingMarketing.cout = cout;
  existingMarketing.duree = duree;

  try {
    existingMarketing.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ existingMarketing });
};

const getMarketing = async (req, res, next) => {
  let existingMarketing;
  try {
    existingMarketing = await marketing.find();
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingMarketing });
};

const getMarketingById = async (req, res, next) => {
  const id = req.params.id;
  let existingMarketing;
  try {
    existingMarketing = await marketing.findById(id);
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingMarketing });
};

const deleteMarketing = async (req, res, next) => {
  const id = req.params.id;
  let existingMarketing;
  try {
    existingMarketing = await marketing.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }
  if (!existingMarketing) {
    return next(new httpError("user does not exist ", 500));
  }
  try {
    existingMarketing.remove();
  } catch {
    return next(new httpError("failed ", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const getMarketingByProjectId = async (req, res, next) => {
    const id = req.params.id;
  
    let existingMarketing;
    try {
        existingMarketing = await projet.findById(id).populate("marketings");
    } catch (err) {
      const error = new httpError(
        "Fetching project failed, please try again later.",
        500
      );
      return next(error);
    }
  
    if (!existingMarketing || existingMarketing.marketings.length === 0) {
      return next(
        new httpError("Could not find  for the provided user id.", 404)
      );
    }
  
    res.json({
      marketing: existingMarketing.marketings.map((el) =>
        el.toObject({ getters: true })
      ),
    });
  };


exports.ajout = ajout;
exports.updateMarketing = updateMarketing;
exports.getMarketing = getMarketing;
exports.getMarketingById = getMarketingById;
exports.deleteMarketing = deleteMarketing;
exports.getMarketingByProjectId = getMarketingByProjectId

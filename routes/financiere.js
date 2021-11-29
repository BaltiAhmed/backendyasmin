const express = require("express");
const route = express.Router();

const financiereControllers = require("../controllers/financiere");

const { check } = require("express-validator");

const fileUpload = require("../middleware/file-uploads");

route.post(
  "/signup",
  fileUpload.single("image"),
  check("nom").not().isEmpty(),
  check("prenom").not().isEmpty(),
  check("adresse").not().isEmpty(),
  check("telephone").not().isEmpty(),
  check("cin").not().isEmpty(),
  check("budget").not().isEmpty(),
  check("domaine").not().isEmpty(),
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  financiereControllers.signup
);

route.patch(
  "/:id",
  fileUpload.single("image"),
  check("nom").not().isEmpty(),
  check("prenom").not().isEmpty(),
  check("adresse").not().isEmpty(),
  check("telephone").not().isEmpty(),
  check("cin").not().isEmpty(),
  check("budget").not().isEmpty(),
  check("domaine").not().isEmpty(),
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  financiereControllers.updatefinanciere
);

route.post(
  "/login",
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  financiereControllers.login
);

route.get("/", financiereControllers.getfinanciere);
route.get("/:id", financiereControllers.getfinanciereById);
route.delete("/:id", financiereControllers.deletefinanciere);

module.exports = route;

const express = require("express");
const route = express.Router();
const { check } = require("express-validator");
const planAffaireControllers = require("../controllers/PlanAffaire");

route.post("/ajout", planAffaireControllers.ajout);
route.get('/projet/:id',planAffaireControllers.getPlanaffaireByProjetId)


module.exports = route;


const express = require("express");
const route = express.Router();

const productionControllers = require("../controllers/production");

const { check } = require("express-validator");

route.post(
  "/ajout",
  check("type").not().isEmpty(),
  check("marche").not().isEmpty(),

  productionControllers.ajout
);

route.patch(
  "/:id",
  check("type").not().isEmpty(),
  check("marche").not().isEmpty(),

  productionControllers.updateProduction
);

route.get("/", productionControllers.getProduction);
route.get("/projet/:id", productionControllers.getProductionByProjectId);
route.get("/:id", productionControllers.getProductionById);
route.delete("/:id", productionControllers.deleteProduction);

module.exports = route;

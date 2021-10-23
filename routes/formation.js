const express = require('express');
const route = express.Router();

const formationControllers = require('../controllers/formation')

const fileUpload = require("../middleware/file-uploads");

route.post('/ajout',fileUpload.single("image"), formationControllers.ajout)
route.get('/',formationControllers.getFormation)
route.get('/:id',formationControllers.getFormationById)
route.delete('/:id',formationControllers.deleteFormation)
route.patch('/:id',fileUpload.single("image"),formationControllers.updateFormation)

module.exports = route
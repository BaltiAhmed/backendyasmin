const express = require('express');
const route = express.Router();

const equipementControllers = require('../controllers/equipement')

const {check} = require('express-validator')

route.post('/ajout', 
check('nom')
.not()
.isEmpty(),
check('type')
.not()
.isEmpty(),
check('prix')
.not()
.isEmpty(),
check('quantite')
.not()
.isEmpty()
, equipementControllers.ajout)

route.patch('/:id', 
check('nom')
.not()
.isEmpty(),
check('type')
.not()
.isEmpty(),
check('prix')
.not()
.isEmpty(),
check('quantite')
.not()
.isEmpty()
, equipementControllers.updateEquipement)

route.get('/',equipementControllers.getEquipement)
route.get('/:id',equipementControllers.getEquipementById)
route.delete('/:id',equipementControllers.deleteEquipement)


module.exports = route
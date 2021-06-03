const express = require('express');
const route = express.Router();

const projetControllers = require('../controllers/projet')

const {check} = require('express-validator')

route.post('/ajout', 
check('titre')
.not()
.isEmpty(),
check('descreption')
.not()
.isEmpty(),
check('datelancement')
.not()
, projetControllers.ajout)

route.patch('/:id', 
check('titre')
.not()
.isEmpty(),
check('descreption')
.not()
.isEmpty(),
check('datelancement')
.not()
, projetControllers.updateProjet)

route.get('/',projetControllers.getProjet)
route.get('/:id',projetControllers.getProjetById)
route.delete('/:id',projetControllers.deleteProjet)
route.get('/utilisateur/:id',projetControllers.getProjetByUserId)




module.exports = route
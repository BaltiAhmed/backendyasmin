const express = require('express');
const route = express.Router();

const utilisateurControllers = require('../controllers/utilisateur')

const {check} = require('express-validator')

route.post('/signup', 
check('nom')
.not()
.isEmpty(),
check('prenom')
.not()
.isEmpty(),
check('adresse')
.not()
.isEmpty(),
check('telephone')
.not()
.isEmpty(),
check('cin')
.not()
.isEmpty(),
check('qualification')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, utilisateurControllers.signup)

route.patch('/:id', 
check('nom')
.not()
.isEmpty(),
check('prenom')
.not()
.isEmpty(),
check('adresse')
.not()
.isEmpty(),
check('telephone')
.not()
.isEmpty(),
check('cin')
.not()
.isEmpty(),
check('qualifications')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, utilisateurControllers.updateUtilisateur)

route.post('/login', 
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, utilisateurControllers.login)

route.get('/',utilisateurControllers.getUtilisateur)
route.get('/:id',utilisateurControllers.getUtilisateurById)
route.delete('/:id',utilisateurControllers.deleteUtilisateur)


module.exports = route
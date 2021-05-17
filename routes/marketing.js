const express = require('express');
const route = express.Router();

const marketingControllers = require('../controllers/marketing')

const {check} = require('express-validator')

route.post('/ajout', 
check('prix')
.not()
.isEmpty(),
check('cout')
.not()
.isEmpty(),
check('duree')
.not()
.isEmpty()

, marketingControllers.ajout)

route.patch('/:id', 
check('prix')
.not()
.isEmpty(),
check('cout')
.not()
.isEmpty(),
check('duree')
.not()
.isEmpty()

, marketingControllers.updateMarketing)

route.get('/',marketingControllers.getMarketing)
route.get('/:id',marketingControllers.getMarketingById)
route.delete('/:id',marketingControllers.deleteMarketing)


module.exports = route

var express 					= require('express');
var router 						= express.Router();
var authenticationController 	= require('../controllers/authenticationController')
var productsController 	        = require('../controllers/productsController')
var productsController 	        = require('../controllers/leadsController')

router.route('/')				.get(authenticationController.index)
router.route('/authentication')	.post(authenticationController.authentication)
router.route('/signupauth')	.post(authenticationController.signup)

module.exports = router;

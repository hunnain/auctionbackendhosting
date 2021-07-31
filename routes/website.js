
var express 					= require('express');
var router 						= express.Router();
var productsController 	        = require('../controllers/productsController')
var leadsController 	        = require('../controllers/leadsController')

router.route('/products')       .get(productsController.index)
router.route('/leads/create')   .post(leadsController.create)

module.exports = router;

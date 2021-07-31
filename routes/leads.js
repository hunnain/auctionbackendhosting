var express 					= require('express');
var router 						= express.Router();
var controller 	                = require('../controllers/leadsController')

router.route('/')				.get(controller.index)
router.route('/create')         .post(controller.create)
router.route('/update')         .post(controller.update)
router.route('/delete')	        .post(controller.delete)

module.exports = router;

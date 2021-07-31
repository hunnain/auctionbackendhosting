var express 		    = require('express')
var router 			    = express.Router()
var controller 	        = require('../controllers/ordersController')

router.route('/')			                            .get(controller.index)
router.route('/create')		                            .post(controller.create)
// router.route('/update')		                            .post(controller.update)
router.route('/delete')		                            .post(controller.delete)
router.route('/updateStatus')	                        .post(controller.updateStatus)
router.route('/updatePaymentDetail')	                .post(controller.updatePaymentDetail)
router.route('/updateProductTracking')	                .post(controller.updateProductTracking)
router.route('/confirmation/:confirmationCode')         .get(controller.orderConfirmation)

module.exports = router;

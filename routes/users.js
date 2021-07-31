var express 	= require('express')
var router 		= express.Router()
var controller 	= require('../controllers/usersController')

router.route('/')				.get(controller.index)
router.route('/update')			.post(controller.update)
router.route('/delete')			.post(controller.delete)
router.route('/updatePassword')	.post(controller.updatePassword)
router.route('/addToWatchList')	.post(controller.addToWatchList)

module.exports = router;

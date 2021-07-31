const User      = require('../models/user');
const bcrypt    = require("bcrypt")
const jwt 	    = require('jsonwebtoken');
// Validation 
const validationSignup = require('../Validation/userSignupAuth');

function generateAccessToken(userObj) {
	return jwt.sign(userObj, process.env.TOKEN_SECRET, { expiresIn: '1d' });
}
exports.index = function (req, res) {
    res.json("Welcome to no-where void!");
};
exports.authentication = async (req, res) => {
    const user = await User.findOne({
		email: req.body.email
	});
	if (user) {
		const passwordCompare = await bcrypt.compare(
			req.body.password,
			user.password
		);
        console.log(passwordCompare)
		if (!passwordCompare) {
            res.sendStatus(400)
		}
        const token = generateAccessToken({
            _id     : user._id,
            userType: user.userType,
            email   : req.body.email,
            password: req.body.password
        });
        delete user["password"]
        res.json({
            token,
            user
        });
	}else{
        res.sendStatus(400)
    }
};



  exports.signup = async (req, res) =>{
    var user = new User();
    user.userType   = req.body.userType
    user.firstName  = req.body.firstName
    user.lastName   = req.body.lastName
    user.email      = req.body.email.toLowerCase()
    user.password   = req.body.password
    user.mobileNo   = req.body.mobileNo

    // call a func and check for validation
    const { errors, isValid } = validationSignup(req.body)
  //check if it returns false it means errors occurs
  if (!isValid) {
    errors.success = false
    return res.status(200).json(errors);
  }

        //   Check Email
        const userEmail = await User.findOne({ 'email': req.body.email })
      if (userEmail) {
        return res.status(200).json({
            success: false,
            status: "Email Exist"
          });
      }

    //   Check Mobile No
        const userMobile = await User.findOne({ 'mobileNo': req.body.mobileNo })
        if (userMobile) {
        return res.status(200).json({
            success: false,
            status: "Phone Number Exist"
            });
        }
    try {
         user.save(function (err, user) {
            if (err)
                res.json(err);
            res.json({
                statusCode: 200,
                message: "New User Created!",
                data: user
            });
        });        
    } catch (error) {
        return res.status(200).json({
            err: error,
            success: false,
            status: "Internal Server Error"
          });
    }

};

exports.changePassword = async (req, res) =>{
    
};
exports.delete = function (req, res) {
    
};
exports.updatePassword = function (req, res) {
    
};
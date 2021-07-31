const User = require('../models/user');

exports.index = function (req, res) {
    let parameters = {}
    if(Object.keys(req.body).length){
        parameters = req.body 
    }
    User.find(parameters, function (err, users) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.send(users);
    });
};

exports.update = function (req, res) {
    User.findOne({_id: req.user._id}, function (err, users) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.send(users);
    });
    
};
exports.delete = function (req, res) {
    
};
exports.updatePassword = function (req, res) {
    
};
exports.addToWatchList = async function (req, res) {
    let user = await User.findOne({_id: req.user._id}, function (err, users) {
        if (err)
            res.statusCode = 400;
            res.json(err);
    });
    if(user.watchList.length ==0){
        user.watchList = []
    }
    user.watchList.push(req.body.productId)
    await user.save(function (err, user) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.json({
            statusCode: 200,
            message: "Added to Watchlist",
            watchList: user
        });
    })
};
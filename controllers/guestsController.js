const fs        = require("fs")
const Lead      = require('../models/lead');
const Product   = require('../models/product');
const jwt 	    = require('jsonwebtoken');


exports.index = function (req, res) {
    let parameters = {}
    if(Object.keys(req.body).length){
        parameters = req.body 
    }
    Product.find(parameters, function (err, products) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.send(products);
    });
};

exports.index = function (req, res) {
    let parameters = {}
    if(req.body.length){
        parameters = req.body 
    }
    Product.find(parameters, function (err, products) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.send(products);
    });
};
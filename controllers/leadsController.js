const fs        = require("fs")
const Lead      = require('../models/lead');
const jwt 	    = require('jsonwebtoken');


exports.index = function (req, res) {
    let parameters = {}
    if(Object.keys(req.body).length){
        parameters = req.body 
    }
    Lead.find(parameters, function (err, leads) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.send(leads);
    });
};
exports.create = function (req, res) {
    let lead = new Lead();
    lead.fisrtName          = req.body.fisrtName
    lead.lastName           = req.body.lastName
    lead.mobileNo           = req.body.mobileNo
    lead.emailAddress       = req.body.emailAddress
    lead.subject            = req.body.subject
    lead.message            = req.body.message
    lead.save(function (err, product) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.json({
            statusCode: 200,
            message: "Query has been added, it is now in reveiw process!",
        });
    });
};
exports.update = async function (req, res) {
    let lead = await Lead.findOne({_id: req.body.leadId}, function (err) {
        if (err)
            res.statusCode = 400;
            res.json(err);
    });
    lead.status          = req.body.status
    lead.save(function (err) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.json({
            statusCode: 200,
            message: "Query has been updated",
        });
    });
};
exports.delete = async function (req, res) {
    try {
        await Lead.findByIdAndRemove(req.body.leadId)
        res.json({
            statusCode: 200,
            message: "Lead has been deleted!",
        });        
    } catch (error) {
        res.json({
            message: error,
            error: true
        });        
    }
};
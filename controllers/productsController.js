const fs        = require("fs")
const Product   = require('../models/product');
const User      = require('../models/user');
const jwt 	    = require('jsonwebtoken');

exports.index = function (req, res) {
    
    // let parameters = {}
    // if(Object.keys(req.query).length){
    //     parameters = req.query 
    // }
    // console.log(parameters);
    Product.find({}, function (err, products) {
        if (err){
        console.log("err",err)
            res.statusCode = 400;
            res.json(err);
            // return res.status(200).json({
            //     data: products,
            //     success: true,
            //     status: "Product List"
            //   });
        }
        res.send(products)
            
    })
};
exports.create = function (req, res) {
    let images = [];
    var product = new Product();
    product.userId          = req.user._id
    product.name            = req.body.name
    product.brand           = req.body.brand
    product.modelNo         = req.body.modelNo
    product.description     = req.body.description
    product.bidHistory      = []
    product.images          = images
    product.save(function (err, product) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        // if(req.body.images.length){
        //     savedImages(req.user._id, product._id, req.body.images)
        // }
        res.json({
            statusCode: 200,
            message: "Product has been created, it is now in reveiw process!",
            data: product
        });
    });
};
exports.update = async function (req, res) {
    const savedImagesPromise = new Promise(async function (resolve, reject) {
        let images = []
        for (let i = 0; i < req.body.images.length; i++) {
            const image     = req.body.images[i];
            let fileName    = "/assets/productsImages/"+jwt.sign({_id: req.user._id, datetime:new Date}, process.env.TOKEN_SECRET)+".png"
            let m           = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if(m!=null){
                let base64Data  = Buffer.from(m[2],'base64');
                await fs.writeFile("public"+fileName, base64Data, function(err){
                    if(!err){
                        images.push(fileName)
                        console.log("file Saved")
                    }else{
                        console.error(err)
                        reject(err)
                    }
                });
            }
            if(i+1 == req.body.images.length){
                resolve([images,m]);
            }
        }
    });
    savedImagesPromise.then(async function (images) {
        product = await Product.findOne({_id: req.body.productId}, function (err) {
            if (err)
                res.json(err);
        });
        product.name            = req.body.name
        product.brand           = req.body.brand
        product.modelNo         = req.body.modelNo
        product.description     = req.body.description
        product.auctionExpireAt = req.body.auctionExpireAt
        product.startingPrice   = req.body.startingPrice
        product.status          = req.body.status
        if(images){
            product.images          = images
        }
        product.save(function (err, product) {
            if (err)
                res.json(err);
            if(req.body.images.length){
            }
            res.json({
                statusCode: 200,
                message: "Product has been Updated!",
                data: product
            });
        });
    }).catch(function (error) {  
        console.error(error)
    })
};
exports.delete = async function (req, res) {
    try {
        await Product.findByIdAndRemove(req.body.productId)
        res.json({
            statusCode: 200,
            message: "Product has been deleted!",
        });        
    } catch (error) {
        res.json({
            message: error,
            error: true
        });        
    }

};
exports.addbids = async function (req, res) {
    product = await Product.findOne({_id: req.body.productId}, function (err) {
        if (err)
            res.statusCode = 400;
            res.json(err);
    });
    user    = await User.findOne({_id: req.user._id}, function (err) {
        if (err)
            res.statusCode = 400;
            res.json(err);
    });
    product.bidHistory.push({
        userId      : req.user._id,
        bidAmount   : req.body.bidAmount,
        bidTime     :  new Date(),
        status      : "pending",
    })
    user.bidsList.push({
        productId   : req.body.productId,
        bidAmount   : req.body.bidAmount,
        bidTime     :  new Date(),
        status      : "pending",
    })
    product.save(function (err) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        user.save(function (_err) {
            if (_err)
                res.json(_err);
            res.json({
                statusCode: 200,
                message: "Bid has been submitted to this Product!",
                data: product
            });
        })
    });
};
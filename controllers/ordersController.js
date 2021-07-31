const Order     = require('../models/order')
const General   = require('../models/general')
const Product   = require('../models/product')
const Stripe    = require("stripe")(process.env.STRIPE_SECRET_KEY)
const jwt       = require('jsonwebtoken');

async function createPaymentIntent(product) {
    const paymentIntent = await Stripe.paymentIntents.create({
        description : product.productId+" || "+product.orderId,
        amount      : product.amount,
        currency    : "usd"
    });
    return paymentIntent.client_secret
}

async function getOrderDetail(orderId, res) {
    return await Order.findOne({_id: orderId}, function (err) {
        if (err)
            res.statusCode = 400;
            res.json(err);
    });
}

exports.index = function (req, res) {
    let parameters = {}
    if(Object.keys(req.body).length){
        parameters = req.body 
    }
    /**
     *  $and: [
          { $or: [{a: 1}, {b: 1}] },
          { $or: [{c: 1}, {d: 1}] }
        ]
     */
    Order.find(parameters, function (err, order) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.send(order);
    }).populate('userId').populate('productId');
}

exports.create = async function (req, res) {
    let charges = await General.findOne({type: "charges"}, function (err) {
        if (err)
            res.json(err)
    })
    charges = charges.list

    let product = await Product.findOne({_id: req.body.productId}, function (err) {
        if (err)
            res.statusCode = 400;
            res.json(err);
    })
    let userbidDetail = product.bidHistory[product.bidHistory.length-1]
    // userbidDetail = await product.bidHistory.filter(function (bid) {  
    //     return bid.bidAmount == req.user._id;
    //     // return bid.userId == req.user._id;
    // })
    let order = new Order();
    order.userId        = req.user._id
    order.productId     = req.body.productId
    order.issueDate     = new Date()
    order.price         = userbidDetail.bidAmount
    order.qty           = req.body.qty
    order.deliveryFee   = charges.delivery
    order.vat           = charges.vat
    order.save( async function (err, order) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        let client_secret = await createPaymentIntent({productId: req.body.productId, orderId: order._id, amount: userbidDetail.bidAmount})
        res.json({
            statusCode: 200,
            message: "Order has been created, it is now in pending process!",
            data: order,
            client_secret: client_secret
        });
    });
}

exports.updatePaymentDetail = async function (req, res) {
    let order = getOrderDetail(req.body.orderId, res)
    order.paymentDetail = req.body.paymentDetail
    order.save(function (err, order) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.json({
            statusCode: 200,
            message: "Order Payment has been Updated",
            data: order
        });
    });
}

exports.updateProductTracking = function (req, res) {
    let order = getOrderDetail(req.body.orderId, res)
    order.productTracking.push(req.body) 
    order.save(function (err, order) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.json({
            statusCode: 200,
            message: "Order has been Updated",
            data: order
        });
    });
}

exports.updateStatus = async function (req, res) {
    let order = await getOrderDetail(req.body.orderId, res)
    order.productTracking.push(req.body) 
    order.save(function (err, order) {
        if (err)
            res.statusCode = 400;
            res.json(err);
        res.json({
            statusCode: 200,
            message: "Order has been Updated",
            data: order
        });
    });
}

exports.delete = async function (req, res) {
    try {
        await Product.findByIdAndRemove(req.params.id)
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
}

exports.orderConfirmation = async function (req, res) {
    try {
        const token = Buffer.from(req.params.confirmationCode, 'base64').toString('ascii')
        console.log(token)
        if (token == null) 
            return res.sendStatus(401)
        jwt.verify(token, process.env.TOKEN_SECRET, (err, info) => {
            if (err) 
                return res.sendStatus(403)
            delete info.iat
            res.json(info)
        })
        // await Product.findOne({confirmationCode: req.body.confirmationCode})
        // res.json({
        //     message: "Product has been deleted!",
        // });        
    } catch (error) {
        res.json({
            message: error,
            error: true
        });        
    }
}
const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const Schema    = mongoose.Schema;

const productTrackingSchema = mongoose.Schema([{
    status: {
        type: String,
        required: false,
    },
    dateTime: {
        type: Date,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
}])
const OrderSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'product',
    },
    issueDate:{
        type: Date,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    qty:{
        type: Number,
        required: true,
    },
    deliveryFee:{
        type: Number,
        required: true,
    },
    vat:{ 
        type: Number,
        required: true, 
        default: null
    },
    status:{ 
        type: String,
        enum : ['pending', 'confirmed', 'delivered', 'complete'],
        default: 'pending' 
    },
    paymentDetail: {
        type: Object,
        required: false, 
        default: null
    },
    productTracking: [productTrackingSchema],
    created_at:{ type: Date, default: Date.now },
    updated_at:{ type: Date, default: Date.now },
    updated:{type: Date, default: Date.now}
}, {versionKey: false}, {strict: false})


const OrderModel = mongoose.model('order', OrderSchema);

module.exports  = OrderModel;
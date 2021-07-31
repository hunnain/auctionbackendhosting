const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const Schema    = mongoose.Schema;

const BillingDetailSchema = mongoose.Schema([{
    cardType: {
        type: String,
        required: false,
    },
    cardNumber: {
        type: Number,
        required: false,
        default: null
    },
    status: {
        type: String,
        required: false,
        enum : ['active', 'inactive'],
        default: 'inactive'
    },
}])

const InvoiceAddressSchema = mongoose.Schema([{
    address: {
        type: String,
        required: false,
        default: null
    },
    city: {
        type: String,
        required: false,
        default: null
    },
    country: {
        type: String,
        required: false,
        default: null
    },
    zipCode: {
        type: String,
        required: false,
        default: null
    },
    status: {
        type: String,
        required: false,
        enum : ['active', 'inactive'],
        default: 'inactive'
    },
}])

const BidHistorySchema = mongoose.Schema([{
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'product',
        default: null
    },
    bidAmount: {
        type: Number,
        required: false,
        default: null
      },
    bidTime: {
        type: Date,
        required: false,
        default: null
    },
    status: {
        type: String,
        required: false,
        enum : ['pending', 'loss', 'win'],
        default: 'pending'
    },
}])

const UserSchema = new Schema({
    userType: {
        type: String,
        enum : ['admin', 'buyer', 'seller', 'both'],
        default: 'buyer'
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true
    },
    watchList      : {
        type    : Array,
        required: false,
        default: []
    },
    billingDetails  : [BillingDetailSchema],
    invoiceAddresses: [InvoiceAddressSchema],
    bidsList        : [BidHistorySchema],
    created_at      : { type: Date, default: Date.now },
})

UserSchema.pre( 'save',
    async function (next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    }
)

UserSchema.methods.isValidPassword = async function(password) {
    const user      = this;
    const compare   = await bcrypt.compare(password, user.password);
    return compare;
}

const UserModel = mongoose.model('user', UserSchema);

module.exports  = UserModel;
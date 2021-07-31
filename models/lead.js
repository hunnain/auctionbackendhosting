const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const leadSchema = new Schema({
    fisrtName:{ 
        type: String, 
        required: false,
    },
    lastName:{ 
        type: String, 
        required: false,
    },
    mobileNo:{ 
        type: String, 
        required: false,
    },
    emailAddress:{ 
        type: String, 
        required: false,
    },
    subject:{ 
        type: String, 
        required: false,
    },
    message:{ 
        type: String, 
        required: false,
    },
    status: {
        type: String,
        required: false,
        enum : ['unread', 'read', 'replied'],
        default: 'unread'
    },
    created_at      : { type: Date, default: Date.now },
}, {versionKey: false}, {strict: false})


const leadModel = mongoose.model('lead', leadSchema);

module.exports  = leadModel;
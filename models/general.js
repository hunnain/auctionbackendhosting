const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const generalSchema = new Schema({
    type:{ 
        type: String, 
        required: false,
    },
    list: {
        type: Object,
        required: false, 
        default: {}
    }
}, {versionKey: false}, {strict: false})


const generalModel = mongoose.model('general', generalSchema);

module.exports  = generalModel;
const mongoose = require('mongoose');
const customerSchema = mongoose.Schema({

    name: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    password: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("customers", customerSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const querySchema = new mongoose.Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "customers"
    },
    storage_id: {
        type: Schema.Types.ObjectId,
        ref: "storages"
    },
    total: {
        type: String
    },
    mobile: { type: String },


    payment: {
        type: Boolean,
        default: false
    },
    duration: {
        type: String
    },
    isEmpty: {
        type: Boolean,
        default: true
    },

    items: [{
        date: {
            type: Date,
            default: Date.now
        },
        name: {
            type: String,
        },
        weight: {
            type: String,
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("orderStorage", querySchema);
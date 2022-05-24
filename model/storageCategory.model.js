const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({

    name:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }

});

module.exports =  mongoose.model("categories",categorySchema);
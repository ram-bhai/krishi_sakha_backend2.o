const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    charges:{
        type:String
    },
    travellingCharge:{
       type:String
    },
    description:{
        type:String
    },
    adminDescription:{
        type:String
    },
    images:{
      type:String
    },
    video:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
    ,reviews: [{
        user: String,
        feedback: {
            type: String
        }
    }],
    isAvailable:{
        type:Boolean,
        default:true
    }
  
});

module.exports = mongoose.model("services",serviceSchema);
const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
    },
    total:{
        type:String,
    },
    address:{
        type:String,
    },
    mobile:{type:String},
    shipping:{type:Boolean,
        default:false
    },
    payment:{
      type:Boolean,
      default:false
    },
    duration:{
        type:String
    },
    orderList:[{
        tool_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"services"
        },
        bookingDate: {
            type: String
        },
        date:{
            type:Date,
            default:Date.now
        }
    }],
    date:{
        type:Date,
        default:Date.now
    },
})
module.exports = mongoose.model("orders",orderSchema);
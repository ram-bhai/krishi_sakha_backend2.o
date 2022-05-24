const mongoose = require('mongoose');
const storageSchema = new mongoose.Schema({

   storageId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"categories"
   },
   capacity:{
       type:String
   },
   location:{
       type:String
   },
   
   isAvailable: {
    type: Boolean,
    default: true

   },
   image:{
    type:String,
   },
   video:{
    type:String,
   },
   name:{
       type:String
   },
   duration:{
       type:String
   },
   items: [{
    name: {
        type: String,
    },
    charges: {
        type: String,
    },
    description: {
        type: String,
    },
    temperature:{
        type: String,
    }
   }],
  
   reviews: [{
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
    },
    feedback: {
        type: String
    }
   }],
   

});

module.exports = mongoose.model("storages",storageSchema);
const mongoose = require("mongoose");

const returnSchema = mongoose.Schema({
    salesman:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user-stas"
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client"
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        require:true
    },
    reason:{
        type:String
    },
    status:{
        type:String,
        enum: ["pending", "approved", "rejected"], 
        default:"pending"
    }
},{timestamps:true})

const returnModel = mongoose.model("Return",returnSchema);

module.exports = returnModel;
const mongoose = require('mongoose')

const collectionSchema = mongoose.Schema({
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client"
    },
    salesman:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user-stas"
    },
    amount:{
        type:Number
    },
    date:{
        type:Date,
    }
},{timestamps:true})

const collectionModel = mongoose.model("Collections",collectionSchema);

module.exports = collectionModel;
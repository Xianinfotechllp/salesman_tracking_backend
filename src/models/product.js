const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:false
    }
},{timestamps:true})

const productModel = mongoose.model("Product",productSchema);

module.exports = productModel
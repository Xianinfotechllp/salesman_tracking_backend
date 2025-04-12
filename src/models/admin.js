const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    name:{
        type:String,
        requried:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
})

const adminModel = mongoose.model('testadmin',adminSchema)
module.exports = adminModel;
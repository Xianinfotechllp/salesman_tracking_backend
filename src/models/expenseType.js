const mongoose = require('mongoose');

const expenseTypeSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
})

const expenseTypeModel = mongoose.model('expense-type',expenseTypeSchema);

module.exports = expenseTypeModel;
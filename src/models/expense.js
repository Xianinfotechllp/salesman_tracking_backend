const mongoose = require('mongoose')

const expenseSchema = mongoose.Schema({
     salesman:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user-stas",
     },
     expenseType:{
        type:String
     },
     amount:{
        type:Number,
     },
     notes:{
        type:String,
        required:true,
     },
     receiptURL:{
        type:String,
        required:true
     },
     status:{
        type:String,
        enum:["pending","cancelled","completed"]
     }
},{timestamps:true})

const expenseModel = mongoose.model("Expense",expenseSchema);

module.exports = expenseModel;
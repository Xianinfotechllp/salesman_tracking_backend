const mongoose = require('mongoose')

const notesSchema = mongoose.Schema({
    salesman:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user-stas"
    },
    title:{
        type:String
    },
    note:{
        type:String
    }
},{timestamp:true ,versionKey: false })

const notesModel = mongoose.model("Notes",notesSchema);

module.exports = notesModel;
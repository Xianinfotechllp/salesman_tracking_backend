const mongoose = require("mongoose");

const fieldStaffSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    require: true,
  },
},{timestamps:true});

const fieldStaffModel = mongoose.model("Field-Staff", fieldStaffSchema);

module.exports = fieldStaffModel;

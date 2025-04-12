const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    salesman: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user-stas"
    },
    checkInTime: {
        type: Date,
    },
    checkOutTime: {
        type: Date,
    },
    location: String,
    image:{
        type:String,
    }
}, { timestamps: true }); 

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = attendanceModel;

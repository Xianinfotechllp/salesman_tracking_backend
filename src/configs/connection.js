const mongoose = require('mongoose');

async function connectToDB(){
    try {
        await mongoose.connect(process.env.DB_URI,{
            serverSelectionTimeoutMS:15000,
        })
        console.log("DB connected");
    } catch (error) {
        console.log("Failed to Connect to DB:",error.message);
    }
}

module.exports = {connectToDB}
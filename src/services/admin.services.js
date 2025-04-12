const adminModel = require("../models/admin");

const {getAll,getById} = require("../repository/genericRepository")

async function getAllAdmin(adminModel){
    return await getAll(adminModel);
}

async function getAdminById(adminModel,id){
    return await getById(adminModel,id);
}

module.exports = {
    getAllAdmin,
    getAdminById
}
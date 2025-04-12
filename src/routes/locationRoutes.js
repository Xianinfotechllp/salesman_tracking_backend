const express = require('express');
const { verifyToken } = require('../middleware/verifyToken');
const {handleAddLocation} = require("../controllers/location.controller")
const router = express.Router();

router.post("/",verifyToken,handleAddLocation);


module.exports = router;
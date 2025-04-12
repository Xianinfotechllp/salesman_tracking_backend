const express = require("express")
const router = express.Router()
const {handleGetLeaderboard} = require("../controllers/leaderboard.controller")

router.get("/",handleGetLeaderboard);

module.exports = router;
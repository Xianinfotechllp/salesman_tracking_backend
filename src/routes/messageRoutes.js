const { HandleGetMessages,HandleSaveMessage } = require("../controllers/message.controller");
const router = require("express").Router();

// Route to send a message
router.post("/sendmsg",HandleSaveMessage);

// Route to get messages between two users
router.get("/getmsg", HandleGetMessages);

module.exports = router;

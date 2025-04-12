const express = require("express");
const router = express.Router();
const {
    handleScheduleMeeting,
    handleGetAllMeetings,
    handleGetMeetingsBySalesmanId,
    handleUpdateMeeting,
    handleCancelMeeting,
    handleGetMeetingById
} = require("../controllers/meeting.controller");

router.post("/", handleScheduleMeeting);
router.get("/", handleGetAllMeetings);
router.get("/getMeeting/:id",handleGetMeetingById);
router.get("/salesman/:salesmanId", handleGetMeetingsBySalesmanId);
router.put("/:id", handleUpdateMeeting);
router.delete("/:id", handleCancelMeeting);

module.exports = router;

const express = require("express");
const { 
    handleCheckIn, 
    handleCheckOut, 
    handleGetAllAttendance, 
    handleGetAttendanceBySalesman 
} = require("../controllers/attendance.controller");
const { verifyToken } = require("../middleware/verifyToken");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/check-in", verifyToken,upload.single("image"), handleCheckIn);
router.put("/check-out/:id", verifyToken,handleCheckOut);
router.get("/", verifyToken ,handleGetAllAttendance);
router.get("/:salesmanId", handleGetAttendanceBySalesman);

module.exports = router;

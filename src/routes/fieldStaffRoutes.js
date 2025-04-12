const express = require("express");
const router = express.Router(); 
const {
  handleAddFieldStaff,
  handleGetFieldStaffById,
  handleGetAllFieldStaff,
  handleUpdateFieldStaff,
  handleRemoveFieldStaff,
} = require("../controllers/fieldStaff.controller");

router.post("/", handleAddFieldStaff);
router.get("/:id", handleGetFieldStaffById);
router.get("/", handleGetAllFieldStaff);
router.put("/:id", handleUpdateFieldStaff);
router.delete("/:id", handleRemoveFieldStaff);

module.exports = router;

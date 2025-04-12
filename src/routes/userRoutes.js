const express = require("express");
const {
  handleGetUserMetrics,
  handleGetAllUsers,
  handleGetUserById,
  handleEditUser,
  handleDeleteUser,
} = require("../controllers/user.controller");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, handleGetAllUsers);
router.get("/metrics/:id", handleGetUserMetrics);
router.get("/:id", handleGetUserById);
router.put("/edit/:id",handleEditUser);
router.delete("/delete/:id",handleDeleteUser);

module.exports = router;

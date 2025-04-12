const express = require("express");
const router = express.Router();
const {
  handleCreateTask,
  handleGetAllTasks,
  handleGetTasksBySalesmanId,
  handleUpdateTaskStatus,
  handleDeleteTask,
} = require("../controllers/task.controller");
const { verifyToken, verifyAdmin } = require("../middleware/verifyToken");

//Admin
router.post("/", verifyToken, verifyAdmin, handleCreateTask);
router.get("/", verifyToken, verifyAdmin, handleGetAllTasks);
 
//Salesman
router.get("/salesman/:salesmanId", handleGetTasksBySalesmanId);
router.put("/status/:id", verifyToken, handleUpdateTaskStatus);
router.delete("/:id", handleDeleteTask);

module.exports = router;

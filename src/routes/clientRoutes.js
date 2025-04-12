const express = require("express");
const {
  handleAddClient,
  handleGetAllClients,
  handleGetClientById,
  handleUpdateClient,
  handleDeleteClient,
  handleAddClientByUser,
  handleGetClientsBySalesman,
  handleDeleteClientBranch
} = require("../controllers/client.controller");

const router = express.Router();

router.post("/", handleAddClientByUser);
router.get("/", handleGetAllClients);
router.get("/:id", handleGetClientById);
router.get("/salesman/:salesmanId", handleGetClientsBySalesman);
router.put("/:id", handleUpdateClient);
router.delete("/:id", handleDeleteClient);
router.delete("/clients/:clientId/branches", handleDeleteClientBranch);

module.exports = router;

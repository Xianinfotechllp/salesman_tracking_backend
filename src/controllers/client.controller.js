const Client = require("../models/client");
const clientService = require("../services/client.service")

const handleAddClient = async (req, res) => {
  try {
    const clientData = req.body;
    const newClient = await clientService.createClient(clientData);
    return res
      .status(201)
      .json({ message: "Client added successfully", client: newClient });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleAddClientByUser = async (req, res) => {
  try {
    const { salesmanId, ...clientData } = req.body; 

    if (!salesmanId) {
      return res.status(400).json({ message: "Salesman ID is required" });
    }

    const newClient = await clientService.createClientByUser(clientData, salesmanId);

    return res
      .status(201)
      .json({ message: "Client added successfully", client: newClient });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleGetClientsBySalesman = async (req, res) => {
  try {
    const { salesmanId } = req.params;

    if (!salesmanId) {
      return res.status(400).json({ message: "Salesman ID is required" });
    }

    const clients = await clientService.getClientsBySalesman(salesmanId);

    return res.status(200).json({
      message: "Clients fetched successfully",
      clients,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};



const handleGetAllClients = async (req, res) => {
  try {
    const clients = await clientService.getAllClients();
    return res.status(200).json({ clients });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleGetClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await clientService.getClientById(id);
    return res.status(200).json({ client });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleUpdateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const clientData = req.body;
    const updatedClient = await clientService.updateClient(id, clientData);
    return res
      .status(200)
      .json({ message: "Client updated successfully", client: updatedClient });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleDeleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await clientService.deleteClient(id);
    return res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const handleDeleteClientBranch = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { branchName, latitude, longitude } = req.body;

    if (!branchName || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Branch name and location required" });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const initialBranchCount = client.branches.length;
    client.branches = client.branches.filter(
      (branch) =>
        !(branch.branchName === branchName &&
          branch.location.latitude === latitude &&
          branch.location.longitude === longitude)
    );

    
    if (client.branches.length === initialBranchCount) {
      return res.status(404).json({ message: "Branch not found" });
    }

    await client.save();

    return res.status(200).json({ message: "Branch deleted successfully", client });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  handleAddClient,
  handleAddClientByUser,
  handleGetClientsBySalesman,
  handleGetAllClients,
  handleGetClientById,
  handleUpdateClient,
  handleDeleteClient,
  handleDeleteClientBranch
};

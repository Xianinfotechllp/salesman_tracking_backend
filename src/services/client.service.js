const { validateClientSchema } = require("../utils/validator");
const GenericRepo = require("../repository/genericRepository");
const Client = require("../models/client");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

const createClient = async (clientData) => {
  try {
    const { error, value } = validateClientSchema(clientData);
    if (error) {
      throw new ApiError(400, error.message);
    }
    return await GenericRepo.create(Client, value);
  } catch (error) {
    throw error;
  }
};

const createClientByUser = async (clientData, salesmanId) => {
  try {
    if (!salesmanId) {
      throw new ApiError(400, "Salesman ID is required");
    }

    const fullClientData = { ...clientData, salesmanId };

    const { error, value } = validateClientSchema(fullClientData);
    if (error) {
      throw new ApiError(400, error.message);
    }

    return await GenericRepo.create(Client, value);
  } catch (error) {
    throw error;
  }
};

const getClientsBySalesman = async (salesmanId) => {
  try {
    if (!salesmanId) {
      throw new ApiError(400, "Salesman ID is required");
    }

    const salesmanObjectId = new mongoose.Types.ObjectId(salesmanId);

    const clients = await Client.find({ salesmanId: salesmanObjectId }).select(
      "name companyName email contact address outstandingDue ordersPlaced"
    );

    if (!clients || clients.length === 0) {
      throw new ApiError(404, "No clients found for this salesman");
    }

    return clients;
  } catch (error) {
    throw error;
  }
};

const getAllClients = async () => {
  try {
    return await GenericRepo.getAll(Client, ["salesman"]);
  } catch (error) {
    throw new Error(`Error fetching clients: ${error.message}`);
  }
};

const getClientById = async (id) => {
  try {
    return await GenericRepo.getById(Client, id);
  } catch (error) {
    throw error;
  }
};

const updateClient = async (id, clientData) => {
  try {
    const allowedFields = [
      "name",
      "contact",
      "address",
      "ordersPlaced",
      "outstandingDue",
      "branches",
    ];

    const filteredData = Object.keys(clientData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = clientData[key];
        return obj;
      }, {});

    if (Object.keys(filteredData).length === 0) {
      throw new ApiError(400, "No valid fields provided for update.");
    }

    return await GenericRepo.update(Client, id, filteredData);
  } catch (error) {
    throw error;
  }
};

const deleteClient = async (id) => {
  try {
    return await GenericRepo.remove(Client, id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createClient,
  createClientByUser,
  getClientsBySalesman,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};

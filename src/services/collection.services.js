// services/collectionService.js
const { validateCollectionSchema } = require("../utils/validator");
const collectionModel = require("../models/collection");
const GenericRepo = require("../repository/genericRepository");
const ApiError = require("../utils/ApiError");
const userModel = require("../models/users");
const clientModel = require("../models/client");
const mongoose = require("mongoose");
const notificationService = require("../services/notification.services");

const createCollection = async (collectionData) => {
  const { error, value } = validateCollectionSchema(collectionData);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { client, salesman } = value; 

  if (!mongoose.Types.ObjectId.isValid(salesman)) {
    throw new ApiError(400, "Invalid salesman ID format");
  }

  const existingClient = await clientModel.findOne({ name: client });

  if (!existingClient) {
    throw new ApiError(404, "Client not found");
  }

  if (!mongoose.Types.ObjectId.isValid(existingClient._id)) {
    throw new ApiError(400, "Invalid client ID format");
  }

  const existingSalesman = await userModel.findById(salesman);
  if (!existingSalesman) {
    throw new ApiError(404, "Salesman not found");
  }

  try {
    const newCollection = await GenericRepo.create(collectionModel, {
      ...value,
      client: existingClient._id,
    });

    await notificationService.createNotification({
      recipient: salesman,
      recipientType: "user-stas",
      message: `A new collection has been created for client ${existingClient.name}.`,
    });

    return newCollection;
  } catch (error) {
    throw new ApiError(500, `Error creating collection: ${error.message}`);
  }
};

const getAllCollections = async () => {
  try {
    const collections = await GenericRepo.getAll(collectionModel);
    return collections;
  } catch (error) {
    throw new ApiError(500, `Error fetching collections: ${error.message}`);
  }
};

const getCollectionsBySalesmanId = async (salesmanId) => {
  if (!mongoose.Types.ObjectId.isValid(salesmanId)) {
    throw new ApiError(400, "Invalid salesman ID format");
  }

  const existingSalesman = await userModel.findById(salesmanId);
  if (!existingSalesman) {
    throw new ApiError(404, "Salesman not found");
  }

  const collections = await collectionModel.aggregate([
    {
      $match: {
        salesman: new mongoose.Types.ObjectId(salesmanId),
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "client",
        foreignField: "_id",
        as: "clientDetails",
      },
    },
    {
      $unwind: {
        path: "$clientDetails",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        _id: 1,
        salesman: 1,
        client: 1,
        clientName: "$clientDetails.name",
        amount: 1,
        date: 1,
        outstandingDue: "$clientDetails.outstandingDue",
        ordersPlaced: "$clientDetails.ordersPlaced",
      },
    },
  ]);

  if (!collections.length) {
    throw new ApiError(404, "No collections found for this salesman");
  }

  return collections;
};


const getCollectionById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Collection ID format");
  }

  const collection = await collectionModel.findById(id).populate("client", "name");

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  return collection;
};




const updateCollection = async (id, collectionData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Collection ID format");
  }

  const { error, value } = validateCollectionSchema(collectionData);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const existingCollection = await GenericRepo.getById(collectionModel, id);
  if (!existingCollection) {
    throw new ApiError(404, "Collection not found");
  }

  try {
    const updatedCollection = await GenericRepo.update(
      collectionModel,
      id,
      value
    );

    await notificationService.createNotification({
      recipient: existingCollection.salesman,
      recipientType: "user-stas",
      message: `Your collection for client ${existingCollection.client} has been updated.`,
    });

    return updatedCollection;
  } catch (error) {
    throw new ApiError(500, `Error updating collection: ${error.message}`);
  }
};

const deleteCollection = async (id) => {
  if (!id) {
    throw new ApiError(400, "Collection ID is required");
  }

  try {
    const existingCollection = await GenericRepo.getById(collectionModel, id);

    if (!existingCollection) {
      throw new ApiError(404, "Collection not found");
    }

    const client = await GenericRepo.getById(
      clientModel,
      existingCollection.client
    );

    if (!client) {
      throw new ApiError(404, "Client not found");
    }

    if (client.outstandingDue > 0) {
      throw new ApiError(
        400,
        `Cannot delete collection. Client ${client.name} has an outstanding due of ₹${client.outstandingDue}.`
      );
    }

    const deletedCollection = await GenericRepo.remove(collectionModel, id);

    await notificationService.createNotification({
      recipient: existingCollection.salesman,
      recipientType: "user-stas",
      message: `Your collection for client ${client.name} has been deleted.`,
    });

    return deletedCollection;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCollection,
  getAllCollections,
  getCollectionsBySalesmanId,
  getCollectionById,
  updateCollection,
  deleteCollection,
};

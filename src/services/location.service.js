const mongoose = require("mongoose");
const Location = require("../models/location");
const User = require("../models/users");
const GenericRepo = require("../repository/genericRepository");
const ApiError = require("../utils/ApiError");

const addLocation = async (locationData) => {
  try {
    const { salesman, latitude, longitude } = locationData;

    if (!mongoose.Types.ObjectId.isValid(salesman)) {
      throw new ApiError(400, "Invalid salesman ID format");
    }

    const userExists = await GenericRepo.getById(User, salesman);
    if (!userExists) {
      throw new ApiError(404, "Salesman not found");
    }

    const newLocation = new Location({ salesman, latitude, longitude });
    return await GenericRepo.create(Location, newLocation);
  } catch (error) {
    throw error;
  }
};

const getLocationsBySalesman = async (salesmanId) => {
  try {
    const locations = await Location.find({ salesman: salesmanId })
      .sort({ createdAt: -1 }) 
      .lean();

    if (!locations.length) {
      throw new ApiError(404, "No locations found for this salesman");
    }

    return locations;
  } catch (error) {
    throw error;
  }
};
module.exports = { addLocation,getLocationsBySalesman };

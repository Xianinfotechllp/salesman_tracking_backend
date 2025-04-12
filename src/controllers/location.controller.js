const locationService = require("../services/location.service");

const handleAddLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const salesman = req.user.id;

    const newLocation = await locationService.addLocation({
      salesman,
      latitude,
      longitude,
    });

    return res.status(201).json({
      message: "Location added successfully",
      location: newLocation,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetLocationsBySalesman = async (req, res) => {
  try {
    const salesmanId = req.user.id; 
    const locations = await locationService.getLocationsBySalesman(salesmanId);

    return res.status(200).json({ locations });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = { handleAddLocation, handleGetLocationsBySalesman };

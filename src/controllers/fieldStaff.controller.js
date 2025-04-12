const {
    addFieldStaff,
    getAllFieldStaff,
    getFieldStaffById,
    updateFieldStaff,
    removeFieldStaff,
  } = require("../services/fieldStaff.services");
  
  const handleAddFieldStaff = async (req, res) => {
    const staffData = req.body;
  
    try {
      const newStaff = await addFieldStaff(staffData);
      return res
        .status(201)
        .json({ message: "Field staff added successfully", staff: newStaff });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  };
  
  const handleGetAllFieldStaff = async (req, res) => {
    try {
      const staffList = await getAllFieldStaff();
      return res.status(200).json({ staff: staffList });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  };
  
  const handleGetFieldStaffById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const staff = await getFieldStaffById(id);
      return res.status(200).json({ staff });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  };
  
  const handleUpdateFieldStaff = async (req, res) => {
    const { id } = req.params;
    const staffData = req.body;
  
    try {
      const updatedStaff = await updateFieldStaff(id, staffData);
      return res
        .status(200)
        .json({ message: "Field staff updated successfully", staff: updatedStaff });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  };
  
  const handleRemoveFieldStaff = async (req, res) => {
    const { id } = req.params;
  
    try {
      await removeFieldStaff(id);
      return res.status(200).json({ message: "Field staff removed successfully" });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  };
  
  module.exports = {
    handleAddFieldStaff,
    handleGetAllFieldStaff,
    handleGetFieldStaffById,
    handleUpdateFieldStaff,
    handleRemoveFieldStaff,
  };
  
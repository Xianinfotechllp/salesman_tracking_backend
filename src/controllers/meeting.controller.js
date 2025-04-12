const {
  scheduleMeeting,
  getAllMeetings,
  getMeetingsBySalesman,
  getMeetingById,
  updateMeeting,
  cancelMeeting,
} = require("../services/meeting.services");

const handleScheduleMeeting = async (req, res) => {
  const meetingData = req.body;

  try {
    const newMeeting = await scheduleMeeting(meetingData); // Call the service function
    return res
      .status(201)
      .json({ message: "Meeting scheduled successfully", meeting: newMeeting });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};


const handleGetAllMeetings = async (req, res) => {
  try {
    const meetings = await getAllMeetings();
    return res.status(200).json({ meetings });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleGetMeetingById = async (req, res) => {
  const { id } = req.params;

  try {
    const meeting = await getMeetingById(id); 
    return res.status(200).json({ meeting });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};


const handleGetMeetingsBySalesmanId = async (req, res) => {
  const { salesmanId } = req.params;

  try {
    const meetings = await getMeetingsBySalesman(salesmanId);
    return res.status(200).json({ meetings });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};


const handleUpdateMeeting = async (req, res) => {
  const { id } = req.params;
  const meetingData = req.body;

  try {
    const updatedMeeting = await updateMeeting(id, meetingData); 
    return res
      .status(200)
      .json({
        message: "Meeting updated successfully",
        meeting: updatedMeeting,
      });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const handleCancelMeeting = async (req, res) => {
  const { id } = req.params;

  try {
    await cancelMeeting(id); 
    return res.status(200).json({ message: "Meeting cancelled successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  handleScheduleMeeting,
  handleGetAllMeetings,
  handleGetMeetingById,
  handleGetMeetingsBySalesmanId,
  handleUpdateMeeting,
  handleCancelMeeting,
};

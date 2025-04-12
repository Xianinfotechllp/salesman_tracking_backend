const User = require("../models/users")

const handleGetLeaderboard = async (req, res) => {
  try {
    let { page = 1, limit = 10, userId } = req.query;
    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    
    const users = await User.find().sort({ points: -1 }).select("_id name points").lean();
    const totalUsers = users.length;

    const paginatedUsers = users.slice((page - 1) * limit, page * limit);

    let userRank = null;

    if (userId) {
      const user = users.find(user => user._id.toString() === userId);
      
      if (user) {
        console.log(user)
        userRank = {
          userId,
          name:user.name,
          rank: users.findIndex(u => u._id.toString() === userId) + 1, 
          points: user.points ?? 0, 
        };
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    }

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      leaderboard: paginatedUsers,
      userRank, 
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




  module.exports = {handleGetLeaderboard}
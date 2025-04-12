const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

async function handleAdminLogin(req, res) {
  const { name, password } = req.body;

  try {
    const admin = await Admin.findOne({ name });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        name: admin.name,
        role: "admin",
      },
      SECRET_KEY,
      { expiresIn: "8h" }
    );

    return res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        role: "admin",
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { handleAdminLogin };

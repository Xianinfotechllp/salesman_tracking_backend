const express = require("express")
const router = express.Router();
const Admin = require("../models/admin");
const {handleAdminLogin} = require("../controllers/adminAuth.controller");

router.post("/login", handleAdminLogin)

//temporary code
router.post("/register", async (req, res) => {
    const { name, password } = req.body;
  
    try {
      
      const existingAdmin = await Admin.findOne({ name });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }
  
  
      const newAdmin = new Admin({
        name,
        password, 
      });
  
      await newAdmin.save();
  
      return res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;